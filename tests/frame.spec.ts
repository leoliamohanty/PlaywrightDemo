import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Handle iframe on DemoQA', () => {

  test('verify text inside iframe', async ({ page }) => {

    // Get absolute path to test HTML file with iframe
    const testFilePath = path.resolve(__dirname, '../testdata/frame-test.html');
    const testFileUrl = `file://${testFilePath}`;

    // Navigate to test page
    await page.goto(testFileUrl, {
      waitUntil: 'domcontentloaded'
    });

    // Wait for iframe to load
    await page.waitForSelector('iframe#frame1');

    // Handle first iframe
    const frame = page.frameLocator('#frame1');

    // Wait for content inside iframe to be available
    await frame.locator('#sampleHeading').waitFor({ state: 'visible', timeout: 10000 });

    // Verify text inside iframe
    await expect(frame.locator('#sampleHeading'))
      .toHaveText('This is a sample page');

  });

});

