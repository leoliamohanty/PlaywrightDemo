import { test as base, expect, Page } from '@playwright/test';
import loginPage from '../pages/loginPage';

// reuse the existing page object to keep selectors in one place
const login = new loginPage();

type TestFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<TestFixtures>({
  // Custom fixture: a page that has already logged in
  loggedInPage: async ({ page }, use) => {
    // navigate using baseURL from config
    await login.load(page);
    await login.login(page);
    // ensure we actually landed on the todos/dashboard page
    await expect(page).toHaveTitle('QAcart Todo App - Todos page');
    // the app currently redirects to "/todo" (singular) after login
    await expect(page).toHaveURL(/todo/);

    // hand the authenticated page to the test body
    await use(page);

    // teardown: clear cookies/storage so other tests stay isolated
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  },
});

export { expect };

test.describe('Dashboard Tests', () => {

  test('should display user dashboard after login', async ({ loggedInPage }) => {
    // after login the user is redirected to the todo list; verifying the
    // URL is sufficient to confirm the dashboard is shown.
    await expect(loggedInPage).toHaveURL(/todo/);
  });

});
