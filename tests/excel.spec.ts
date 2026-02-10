
import { test, expect } from '@playwright/test';
import { readExcel, writeExcel, readExcelsheet } from './excelUtils';

test('Read and write Excel using Playwright', async ({ page }) => {
  // Read input Excel
  const testData: any[] = readExcel(
    'test-data/input.xlsx',
    'Sheet1'
  );

  const results: any[] = [];

  for (const row of testData) {
    await page.goto('https://example.com');

    const title = await page.title();

    results.push({
      TestCase: row.TestCase,
      ExpectedTitle: row.ExpectedTitle,
      ActualTitle: title,
      Status: title === row.ExpectedTitle ? 'PASS' : 'FAIL'
    });

    expect(title).toBe(row.ExpectedTitle);
  }

  // Write results to Excel
  writeExcel(
    'output/result.xlsx',
    'Results',
    results
  );
});

import path from 'path';

const excelPath = path.join(__dirname, '../testdata/testdata.xlsx');
const sheetName = 'Sheet1';

const testData = readExcelsheet(excelPath, sheetName);

testData.forEach((data, index) => {

  test(`Login test using Excel row ${index + 1}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.fill('#user-name', data.username);
    await page.fill('#password', data.password);
    await page.click('#login-button');

    // Wait for either an error message or successful navigation to inventory
    const errorLocator = page.locator('.error-message-container, [data-test="error"]');
    if (await errorLocator.first().isVisible()) {
      await expect(errorLocator.first()).toContainText(/locked out|Epic sadface|Sorry|error/i);
    } else {
      await expect(page).toHaveURL(/inventory/);
    }
  });
});

