import { test, expect } from '@playwright/test';

test.describe('Isolated with explicit context config', () => {

  test.use({
    storageState: undefined, // ensures no shared auth state
  });

  test('fresh session test', async ({ page }) => {
    await page.goto('/');

    const cookies = await page.context().cookies();
    expect(cookies.length).toBe(0);
  });

});


test('manual isolated browser context', async ({ browser }) => {
  const context = await browser.newContext(); // isolated context
  const page = await context.newPage();

  await page.goto('/');

  await expect(page).toHaveTitle(/QAcart/);

  await context.close(); // cleanup
});


test.describe('User Dashboard - Isolated Tests', () => {

  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email"]', 'testuser1@gmail.com');
    await page.fill('[data-testid="password"]', 'Test@1234');
    await page.click('[data-testid="submit"]');

    await expect(page).toHaveTitle('QAcart Todo App - Todos page');
  });

  test('should not share session with other tests', async ({ page }) => {
    // Create an explicit isolated context to ensure no session is shared
    const context = await page.context().browser().newContext();
    const isolatedPage = await context.newPage();

    await isolatedPage.goto('/dashboard');

    // Because this is an isolated context, it should not contain auth cookies
    const cookies = await context.cookies();
    expect(cookies.length).toBe(0);

    // Also assert localStorage does not contain auth tokens
    const localKeys = await isolatedPage.evaluate(() => Object.keys(localStorage));
    expect(localKeys.length).toBe(0);

    await context.close();
  });

});
