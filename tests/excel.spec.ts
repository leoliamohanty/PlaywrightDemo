
import { test, expect } from '@playwright/test';
import { readExcel, writeExcel } from './excelUtils';

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
