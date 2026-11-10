import { test, expect } from '@playwright/test';
test('Valid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});



 test('Invalid login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('invalid_password');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText("Epic sadface: Username and password do not match any user in this service")).toBeVisible();
});

test('Add product and checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Add Sauce Labs Backpack
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // Verify cart has 1 item
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Open cart
  await page.locator('.shopping_cart_link').click();

  // Verify product is in cart
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

  // Checkout
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Fill checkout information
  await page.getByRole('textbox', { name: 'First Name' }).fill('Kazi');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Hossain');
  await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('06457');

  // Continue
  await page.getByRole('button', { name: 'Continue' }).click();

  // Verify checkout overview
  await expect(page.getByText('Checkout: Overview')).toBeVisible();

  // Finish order
  await page.getByRole('button', { name: 'Finish' }).click();

  // Verify order confirmation
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});

test('View product details and add product to cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Click the Sauce Labs Backpack product
  await page.getByText('Sauce Labs Backpack').first().click();

  // Verify product details page
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('$29.99')).toBeVisible();

  // Verify the large product image
  await expect(
    page.getByRole('img', { name: 'Sauce Labs Backpack' })
  ).toBeVisible();

  // Add product to cart from the product details page
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Verify cart has 1 item
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});


test('Dropdown Sort products by price low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Select Price (low to high)
  await page.getByRole('combobox').selectOption('lohi');

  // Verify selected option
  await expect(page.getByRole('combobox')).toHaveValue('lohi');
});