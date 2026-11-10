import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { CartCheckoutPage } from '../../pages/CartCheckoutPage.js';

test('Cart and Checkout using POM', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    // Login Page Object
    const loginPage = new LoginPage(page);

    await loginPage.login('standard_user', 'secret_sauce');

    // Add product
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Open cart
    await page.locator('.shopping_cart_link').click();

    // Cart and Checkout Page Object
    const cartCheckoutPage = new CartCheckoutPage(page);

    // Checkout
    await cartCheckoutPage.checkout();

    // Fill checkout information
    await cartCheckoutPage.fillInformation(
        'Kazi',
        'Hossain',
        '06457'
    );

    // Continue
    await cartCheckoutPage.continueCheckout();

    // Verify checkout overview
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // Finish order
    await cartCheckoutPage.finishOrder();

    // Verify order confirmation
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
});