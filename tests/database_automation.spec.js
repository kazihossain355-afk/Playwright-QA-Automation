import { test, expect } from '@playwright/test';
import { getDatabaseConnection } from '../db/db_connection.js';

test('Database - Verify user exists in MySQL', async () => {

  const connection = await getDatabaseConnection();

  const [rows] = await connection.execute(
    `SELECT first_name, last_name, email
     FROM users
     WHERE first_name = ?`,
    ['Kazi']
  );

  console.log('Database Result:', rows);

  expect(rows.length).toBeGreaterThan(0);

  await connection.end();
});