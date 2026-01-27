import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';


export default class SignupPage {
	async load(page: Page) {
		await page.goto('/signup');
	}

	private get firstNameInput() {
		return `[data-testid=first-name]`;
	}

	private get lastNameInput() {
		return `[data-testid=last-name]`;
	}

	private get emailInput() {
		return `[data-testid=email]`;
	}

	private get passwordInput() {
		return `[data-testid=password]`;
	}

	private get confirmPasswordInput() {
		return `[data-testid=confirm-password]`;
	}

	private get submitButton() {
		return `[data-testid=submitt]`;
	}

	async signup(page: Page) {
        await page.type(this.firstNameInput, faker.person.firstName());
        await page.type(this.lastNameInput, faker.person.lastName());
        await page.type(this.emailInput, faker.internet.email());
        await page.type(this.passwordInput,'Test@1234');
        await page.type(this.confirmPasswordInput,'Test@1234');
        await page.click(this.submitButton);

	}
}