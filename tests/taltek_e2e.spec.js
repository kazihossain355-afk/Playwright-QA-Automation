import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { getDatabaseConnection } from '../db/db_connection.js';

dotenv.config();

test('TalentTek E2E - UI → API → DB → UI', async ({ page, request }) => {
  test.setTimeout(90_000);

  await page.context().tracing.start({
    screenshots: true,
    snapshots: true,
  });

  const baseUrl = (process.env.TALTEK_BASE_URL || 'https://qa.taltektc.com')
    .replace(/\/$/, '');

  const apiToken = process.env.TALTEK_API_TOKEN;

  if (!apiToken) {
    throw new Error('TALTEK_API_TOKEN must be configured.');
  }

  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

  const studentToCreate = {
    firstName: 'Kazi',
    lastName: 'Hossain',
    email: `taltek.e2e.${uniqueSuffix}@example.com`,
    password: 'E2ePass123',
    dob: { year: 1990, month: 1, day: 1 },
    gender: 'male',
  };

  const studentUpdate = {
    firstName: 'Arif',
    lastName: 'Rahman',
    email: `taltek.updated.${uniqueSuffix}@example.com`,
    dob: { year: 1992, month: 2, day: 2 },
    gender: 'female',
  };

  let connection;
  let studentId;

  try {
    // Connect to database
    connection = await getDatabaseConnection();

    // ==========================================
    // 1. UI - Create Student
    // ==========================================

    await page.goto(`${baseUrl}/signup.html`);

    await page.locator('input[name="firstName"]').fill(studentToCreate.firstName);
    await page.locator('input[name="lastName"]').fill(studentToCreate.lastName);
    await page.locator('input[name="email"]').fill(studentToCreate.email);
    await page.locator('input[name="password"]').fill(studentToCreate.password);
    await page.locator('input[name="confirmPassword"]').fill(studentToCreate.password);

    await page.locator('select[name="month"]').selectOption('01');
    await page.locator('select[name="day"]').selectOption('01');
    await page.locator('select[name="year"]').selectOption(
      String(studentToCreate.dob.year)
    );

    await page.locator('#male').check();
    await page.locator('#defaultCheck1').check();

    const signupResponsePromise = page.waitForResponse(response =>
      response.url() === `${baseUrl}/api/signup.php` &&
      response.request().method() === 'POST'
    );

    await page.locator('#signup-form button[type="submit"]').click();

    const signupResponse = await signupResponsePromise;

    expect(signupResponse.ok()).toBeTruthy();

    const signupResult = await signupResponse.json();

    expect(signupResult.success).toBeTruthy();

    studentId = signupResult.data?.id;

    expect(studentId).toBeTruthy();

    await expect(
      page.getByText(`Your student ID is: ${studentId}`)
    ).toBeVisible();

    // ==========================================
    // 2. UI - Login
    // ==========================================

    await Promise.all([
      page.waitForURL('**/index.html'),
      page.getByRole('button', { name: 'OK' }).click(),
    ]);

    await page.locator('#login_form input[name="email"]').fill(
      studentToCreate.email
    );

    await page.locator('#login_form input[name="password"]').fill(
      studentToCreate.password
    );

    const loginResponsePromise = page.waitForResponse(response =>
      response.url() === `${baseUrl}/api/login_user.php` &&
      response.request().method() === 'POST'
    );

    await page.locator('#login_form input[type="submit"]').click();

    const loginResponse = await loginResponsePromise;

    expect(loginResponse.ok()).toBeTruthy();

    await page.waitForURL('**/home.html');

    const accessToken = await page.evaluate(() =>
      localStorage.getItem('accessToken')
    );

    expect(accessToken).toBeTruthy();

    // ==========================================
    // 3. API - Update Student
    // ==========================================

    const headers = {
      'Content-Type': 'application/json',
      api_token: apiToken,
      Authorization: `Bearer ${accessToken}`,
    };

    const updateResponse = await request.put(
      `${baseUrl}/api/student/update/${encodeURIComponent(studentId)}`,
      {
        headers,
        data: studentUpdate,
      }
    );

    expect(updateResponse.ok()).toBeTruthy();

    const updateResult = await updateResponse.json();

    expect(updateResult.success).toBeTruthy();

    // ==========================================
    // 4. API - Verify Student
    // ==========================================

    const apiResponse = await request.get(
      `${baseUrl}/api/user_info.php?student_id=${encodeURIComponent(studentId)}`,
      { headers }
    );

    expect(apiResponse.ok()).toBeTruthy();

    const apiResult = await apiResponse.json();

    expect(apiResult.success).toBeTruthy();

    const apiStudent = apiResult.data;

    expect(apiStudent.student_id).toBe(studentId);
    expect(apiStudent.first_name).toBe(studentUpdate.firstName);
    expect(apiStudent.last_name).toBe(studentUpdate.lastName);
    expect(apiStudent.email).toBe(studentUpdate.email);

    expect(String(apiStudent.dob.year)).toBe(
      String(studentUpdate.dob.year)
    );

    expect(Number(apiStudent.dob.month)).toBe(studentUpdate.dob.month);
    expect(Number(apiStudent.dob.day)).toBe(studentUpdate.dob.day);

    expect(apiStudent.gender).toBe(studentUpdate.gender);

    // ==========================================
    // 5. Database - Verify Student
    // ==========================================

    const [databaseRows] = await connection.execute(
      `SELECT student_id, first_name, last_name, email,
              DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate, gender
       FROM users
       WHERE student_id = ?`,
      [studentId]
    );

    expect(databaseRows).toHaveLength(1);

    expect(databaseRows[0]).toMatchObject({
      student_id: studentId,
      first_name: studentUpdate.firstName,
      last_name: studentUpdate.lastName,
      email: studentUpdate.email,
      birthdate: '1992-02-02',
      gender: studentUpdate.gender,
    });

    // ==========================================
    // 6. UI - Verify Updated Student
    // ==========================================

    await page.reload();

    await expect(page.locator('#studentId')).toHaveText(studentId);

    await expect(page.locator('#name')).toHaveText(
      `${studentUpdate.firstName} ${studentUpdate.lastName}`
    );

    await expect(page.locator('#email')).toHaveText(studentUpdate.email);

    await expect(page.locator('#birthdate')).toHaveText(
      `${apiStudent.dob.year}-${apiStudent.dob.month}-${apiStudent.dob.day}`
    );

    await expect(page.locator('#gender')).toHaveText(
      studentUpdate.gender
    );
    await page.screenshot({
    path: 'test-results/taltek-student-updated.png',
    fullPage: true
});

  } finally {

    // Cleanup test data
    if (connection) {
      try {
        if (studentId) {
          await connection.execute(
            'DELETE FROM users WHERE student_id = ?',
            [studentId]
          );
        }
      } finally {
        await connection.end();
      }
    }

    // Save Trace Viewer data
    await page.context().tracing.stop({
      path: 'test-results/taltek-trace.zip',
    });
  }
});