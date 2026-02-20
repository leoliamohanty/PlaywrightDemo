import { test, expect } from '@playwright/test';

// content string reused by the parallel user API tests
// use an absolute URL so the route matcher ('**/api/users') will always fire
const userPageContent = `
<html>
  <body>
    <ul id="users"></ul>
    <script>
      fetch('https://example.com/api/users')
        .then(r => r.json())
        .then(users => {
          const list = document.getElementById('users');
          users.forEach(u => {
            const li = document.createElement('li');
            li.textContent = u.name;
            list.appendChild(li);
          });
        });
    <\/script>
  </body>
</html>
`;

// simple login page used by the mock login API test
const loginPageContent = `
<html>
  <body>
    <form id="login">
      <input id="username" />
      <input id="password" type="password" />
      <button type="submit">Login</button>
    </form>
    <script>
      document.getElementById('login').addEventListener('submit', e => {
        e.preventDefault();
        const data = {
          username: document.getElementById('username').value,
          password: document.getElementById('password').value,
        };
        fetch('https://example.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(result => {
            if (result.token) {
              document.body.innerHTML += '<div>Dashboard</div>';
            } else {
              document.body.innerHTML += '<div>Login failed</div>';
            }
          });
      });
    <\/script>
  </body>
</html>
`;

test('should display mocked users from API', async ({ page }) => {
  // Mock API response for any request containing `/api/users`
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ])
    });
  });

  // Create a minimal page that will fetch the users and render them
  await page.setContent(`
    <html>
      <body>
        <ul id="users"></ul>
        <script>
          // Use an absolute URL so the route pattern will match reliably
          fetch('https://example.com/api/users')
            .then(res => res.json())
            .then(users => {
              const list = document.getElementById('users');
              users.forEach(u => {
                const li = document.createElement('li');
                li.textContent = u.name;
                list.appendChild(li);
              });
            });
        <\/script>
      </body>
    </html>
  `);

  // Assertions – the names should now be rendered in the DOM
  await expect(page.getByText('John Doe')).toBeVisible();
  await expect(page.getByText('Jane Smith')).toBeVisible();
});


// Run tests inside this file in parallel
test.describe.configure({ mode: 'parallel' });

test('User API test - Thread 1', async ({ page }) => {
  // intercept the users endpoint and return a single user
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Alice' }]),
    });
  });

  // render a minimal page that fetches the list and displays it
  await page.setContent(userPageContent);
  await expect(page.getByText('Alice')).toBeVisible();
});

test('User API test - Thread 2', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 2, name: 'Bob' }]),
    });
  });

  await page.setContent(userPageContent);
  await expect(page.getByText('Bob')).toBeVisible();
});

test('User API test - Thread 3', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 3, name: 'Charlie' }]),
    });
  });

  await page.setContent(userPageContent);
  await expect(page.getByText('Charlie')).toBeVisible();
});


test('should mock login API', async ({ page }) => {
  await page.route('**/api/login', async (route, request) => {
    const requestBody = request.postDataJSON();

    if (requestBody.username === 'admin') {
      await route.fulfill({
        status: 200,
        json: { token: 'fake-jwt-token' }
      });
    } else {
      await route.fulfill({
        status: 401,
        json: { message: 'Invalid credentials' }
      });
    }
  });

  // load our reusable login page content (uses absolute URL for the fetch)
  await page.setContent(loginPageContent);

  await page.fill('#username', 'admin');
  await page.fill('#password', '1234');
  await page.click('button[type="submit"]');

  await expect(page.getByText('Dashboard')).toBeVisible();
});
