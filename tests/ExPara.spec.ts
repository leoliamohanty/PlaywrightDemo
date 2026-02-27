import { test, expect } from '@playwright/test';

type LoginTestData = {
  username: string;
  password: string;
  expectedMessage: string;
};

const testData: LoginTestData[] = [
  {
    username: 'standard_user',
    password: 'secret_sauce',
    expectedMessage: 'Dashboard',
  },
  {
    username: 'invalid_user',
    password: 'wrong_password',
    expectedMessage: 'Invalid username or password',
  },
];

test.describe('Login Parameterized Tests', () => {
  for (const data of testData) {
    test(`Login test for user: ${data.username}`, async ({ page }) => {
      await page.goto('/login');

      await page.fill('[data-testid=email]', data.username === 'standard_user' ? 'testuser1@gmail.com' : data.username);
      await page.fill('[data-testid=password]', data.password === 'secret_sauce' ? 'Test@1234' : data.password);
      await page.click('[data-testid=submit]');

      if (data.username === 'standard_user') {
        await expect(page).toHaveTitle(/Todos page/);
      } else {
        // remain on login page
        await expect(page).not.toHaveTitle(/Todos page/);
      }
    });
  }
});


const validUsers = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'admin_user', password: 'secret_sauce' },
];

const invalidUsers = [
  { username: 'locked_user', password: 'secret_sauce' },
  { username: 'invalid_user', password: 'wrong_password' },
];

test.describe('Login Tests - Parameterized', () => {

  validUsers.forEach(({ username, password }) => {
    test(`Valid login: ${username}`, async ({ page }) => {
      await page.goto('/login');

      // map known accounts to real test credentials
      const email = username === 'standard_user' || username === 'admin_user'
        ? 'testuser1@gmail.com'
        : username;
      const pwd = password === 'secret_sauce' ? 'Test@1234' : password;

      await page.fill('[data-testid=email]', email);
      await page.fill('[data-testid=password]', pwd);
      await page.click('[data-testid=submit]');

      // dashboard should be reached for valid accounts
      await expect(page).toHaveTitle(/Todos page/);
    });
  });

  invalidUsers.forEach(({ username, password }) => {
    test(`Invalid login: ${username}`, async ({ page }) => {
      await page.goto('/login');

      // use same mapping logic for email/password
      const email = username === 'locked_user' ? 'locked@user.com' : username;
      const pwd = password === 'secret_sauce' ? 'Test@1234' : password;

      await page.fill('[data-testid=email]', email);
      await page.fill('[data-testid=password]', pwd);
      await page.click('[data-testid=submit]');

      // should remain on login page
      await expect(page).not.toHaveTitle(/Todos page/);
    });
  });

});