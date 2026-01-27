import { test, expect } from '@playwright/test';
import loginPage from '../pages/loginPage';

const loginpage = new loginPage();

test('Login', async ({ page }) => {
  await loginpage.load(page);
await loginpage.login(page);

  // Validate that a success message or specific element is visible
  await expect(page).toHaveTitle('QAcart Todo App23 - Todos page');
});