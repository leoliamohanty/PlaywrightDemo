import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Upload and download a file', async ({ page }) => {
  /* -------------------- FILE UPLOAD -------------------- */

  await page.goto('https://the-internet.herokuapp.com/upload');

  // Path to the file you want to upload
  const filePath = path.resolve(__dirname, 'test-data/sample.txt');

  // Upload the file
  await page.setInputFiles('#file-upload', filePath);
  await page.click('#file-submit');

  // Validate upload success
  await expect(page.locator('#uploaded-files')).toHaveText('sample.txt');

  /* -------------------- FILE DOWNLOAD -------------------- */

  await page.goto('https://the-internet.herokuapp.com/download');

  // Wait for the download event
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('a[href="download/sample.txt"]')
  ]);

  // Save downloaded file
  const downloadPath = path.resolve(__dirname, 'downloads', 'sample.txt');
  await download.saveAs(downloadPath);

  // Verify file exists
  expect(fs.existsSync(downloadPath)).toBeTruthy();
});
