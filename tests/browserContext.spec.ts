import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';

test('BrowserContext shares localStorage between pages', async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: true });

  // Create a new browser context
  const context: BrowserContext = await browser.newContext();

  // First page in the context
  const page1: Page = await context.newPage();
  await page1.goto('https://playwright.dev');

  // Set localStorage value
  await page1.evaluate(() => {
    localStorage.setItem('userRole', 'admin');
  });

  // Second page in the SAME context
  const page2: Page = await context.newPage();
  await page2.goto('https://playwright.dev');

  // Read localStorage from second page
  const userRole = await page2.evaluate(() => {
    return localStorage.getItem('userRole');
  });

  // Assertion
  expect(userRole).toBe('admin');

  // Cleanup
  await context.close();
  await browser.close();
});
