import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import SignupPage from '../pages/signUpPage';

const signupPage = new SignupPage();

test('has title', async ({ page }) => {
  await signupPage.load(page);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('QAcart Todo App - Signup page');
});

test('get started', async ({ page }) => {
  await signupPage.load(page);
await signupPage.signup(page);

  // Validate that a success message or specific element is visible
  await expect(page).toHaveTitle('QAcart Todo App - Todos page');
});
