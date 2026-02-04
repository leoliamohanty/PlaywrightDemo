import { test, expect } from '@playwright/test';

import { faker } from '@faker-js/faker';

test('new todo test', async ({ page }) => {
  await page.goto('https://qacart-todo.herokuapp.com/');
  await page.getByRole('link', { name: 'Signup' }).click();
  await page.getByTestId('first-name').click();
  await page.getByTestId('first-name').fill(faker.person.firstName());
  await page.getByTestId('last-name').click();
  await page.getByTestId('last-name').fill(faker.person.lastName());
  await page.getByTestId('email').click();
  await page.getByTestId('email').fill(faker.internet.email());
  await page.getByTestId('password').click();
  await page.getByTestId('password').fill('test@1234');
  await page.getByTestId('confirm-password').click();
  await page.getByTestId('confirm-password').fill('test@1234');
  await page.getByTestId('submit').click();
  await page.getByRole('button', { name: 'delete' }).click();
  await page.getByTestId('new-todo').click();
  await page.getByTestId('new-todo').fill('check codegen');
  await page.getByTestId('submit-newTask').click();
  await page.getByTestId('complete-task').click;
  await page.getByTestId('delete').click();
  await page.getByRole('button', { name: 'Logout' }).click();
});