export class CartCheckoutPage {

    constructor(page) {
        this.page = page;

        // LOCATORS
        this.cartItem = page.getByText('Sauce Labs Backpack');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.zipCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
    }

    // ACTIONS
    async checkout() {
        await this.checkoutButton.click();
    }

    async fillInformation(firstName, lastName, zipCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zipCode);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }
}