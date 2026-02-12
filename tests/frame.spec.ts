import { test, expect } from '@playwright/test';

test.describe('Handle iframe on DemoQA', () => {

  test('verify text inside iframe', async ({ page }) => {

    // Navigate to real website
    await page.goto('https://demoqa.com/frames', {
      waitUntil: 'domcontentloaded'
    });

    // Handle first iframe
    const frame = page.frameLocator('#frame1');

    // Verify text inside iframe
    await expect(frame.locator('#sampleHeading'))
      .toHaveText('This is a sample page');

  });

});

