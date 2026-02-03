import { test, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';



test('GET test cases page', async ({ request }) => {
  const response = await request.get(
    'https://practice.expandtesting.com/test-cases',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.text();

  // HTML validations
  expect(body).toContain('<!doctype html>');
  expect(body).toContain('Test Cases');
});



const BASE_URL = 'https://qacart-todo.herokuapp.com';

test('POST /users/register - register a new user', async ({ request }) => {
  const email = faker.internet.email();
  const password = 'Test@1234';
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  console.log('Registering user with email:', email, firstName, lastName);

  const payload = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
  };

  const response = await request.post(`${BASE_URL}/api/v1/users/register`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: JSON.stringify(payload), // <-- use data, not json
  });

  const responseBody = await response.text();
  console.log('Response body:', responseBody);
  
  expect(response.status()).toBe(201);

  const body = JSON.parse(responseBody);
  expect(body).toHaveProperty('access_token');
  expect(typeof body.access_token).toBe('string');
  expect(body.access_token.length).toBeGreaterThan(0);

  console.log('User registered successfully!');
  console.log('Email:', email);
  console.log('Access token:', body.access_token);
});
