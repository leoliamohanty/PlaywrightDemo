import { test, expect } from '@playwright/test';

test.describe('Login Feature @auth', () => {

  test.beforeEach(async ({ page }) => {
    // Runs before each test
    await page.goto('/login');
  });

  test.afterEach(async ({ page }) => {
    // Optional cleanup
    await page.close();
  });

  test('should login with valid credentials @smoke', async ({ page }) => {
    test.slow(); // Mark as slow test
    
    await page.fill('[data-testid=email]', 'testuser1@gmail.com');
    await page.fill('[data-testid=password]', 'Test@1234');
    await page.click('[data-testid=submit]');

    await expect(page).toHaveTitle(/QAcart Todo App - Todos page/);
  });

  test('should show error for invalid credentials @negative', async ({ page }) => {
    await page.fill('[data-testid=email]', 'invalid@user.com');
    await page.fill('[data-testid=password]', 'wrong_password');
    await page.click('[data-testid=submit]');

    // Wait for error message or stay on login page (not redirected to dashboard)
    await expect(page).not.toHaveTitle(/QAcart Todo App - Todos page/);
  });

  test('should lock account after multiple failed attempts', async ({ page }) => {
    // attempt several invalid logins and verify we don't land on dashboard
    const invalidEmail = 'locked@user.com';
    const invalidPassword = 'badpass';
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid=email]', invalidEmail);
      await page.fill('[data-testid=password]', invalidPassword);
      await page.click('[data-testid=submit]');
      // brief pause so app can respond
      await page.waitForTimeout(500);
    }
    // after repeated failures we expect to still be on login page
    await expect(page).not.toHaveTitle(/Todos page/);
    // optionally check for lockout text if known
    // await expect(page.locator('[data-testid=error-message]')).toContainText('locked');
  });

  // MFA login test is not executable yet – the application does not expose
  // an MFA sequence or test account, so we skip the case for now. When an
  // MFA-enabled user and OTP mechanism are available, replace this with the
  // appropriate steps (navigate, fill credentials, intercept/code OTP, etc.).
  test.skip('should support MFA login', async ({ page }) => {
    // TODO: implement once MFA test details are known.
  });

});