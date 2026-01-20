import { Page } from '@playwright/test';

export default class loginPage{
    async load(page: Page) {
		await page.goto('/login');
	}

    	private get emailInput() {
		return `[data-testid=email]`;
	}

	private get passwordInput() {
		return `[data-testid=password]`;
	}

    private get submitButton() {
		return `[data-testid=submit]`;
	}

    	async login(page: Page) {
        await page.type(this.emailInput, 'testuser1@gmail.com');
        await page.type(this.passwordInput,'Test@1234');
        await page.click(this.submitButton);

	}
}