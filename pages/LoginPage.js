import { expect } from '@playwright/test';

// LOCATORS-where is the element?
export class LoginPage {

    constructor(page) {
        this.page = page;

        this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
        this.loginButton = this.page.getByRole('button', { name: 'Login' });
    }
   // Action-what do I do with the element?
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

}