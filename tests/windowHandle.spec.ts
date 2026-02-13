import { test, expect, ElementHandle } from '@playwright/test';

test.describe('Window Handling in Playwright', () => {

  test('handle new tab using popup event', async ({ page }) => {

    // Navigate to website
    await page.goto('https://the-internet.herokuapp.com/windows');

    // Wait for new tab to open when clicking link
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),   // Wait for new tab
      page.click('text=Click Here') // Action that opens new tab
    ]);

    // Wait for new page to load
    await newPage.waitForLoadState();

    // Verify content in new tab
    await expect(newPage.locator('h3')).toHaveText('New Window');

    // Close new tab
    await newPage.close();

    // Verify we are back on original page
    await expect(page.locator('h3')).toHaveText('Opening a new window');

  });

});

test.describe('Using ElementHandle in Playwright', () => {

  test('login using ElementHandle', async ({ page }) => {

    // Navigate to site
    await page.goto('https://the-internet.herokuapp.com/login');

    // Wait for username field and get ElementHandle
    const usernameHandle: ElementHandle<HTMLInputElement> | null =
      await page.waitForSelector('#username');

    if (!usernameHandle) throw new Error('Username field not found');

    await usernameHandle.fill('tomsmith');

    // Get password field using ElementHandle
    const passwordHandle =
      await page.$('#password');

    if (!passwordHandle) throw new Error('Password field not found');

    await passwordHandle.fill('SuperSecretPassword!');

    // Get login button
    const loginButton =
      await page.$('button[type="submit"]');

    if (!loginButton) throw new Error('Login button not found');

    await loginButton.click();

    // Validate successful login
    const messageHandle =
      await page.waitForSelector('.flash.success');

    const messageText = await messageHandle?.textContent();

    expect(messageText).toContain('You logged into a secure area!');

  });

});


test.describe('ElementHandle boundingBox example', () => {

  test('get position and size of an element', async ({ page }) => {

    // Navigate to demo page
    await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

    // Get ElementHandle for first box
    const boxA: ElementHandle<HTMLElement> | null = await page.$('#column-a');
    const boxB: ElementHandle<HTMLElement> | null = await page.$('#column-b');

    if (!boxA || !boxB) throw new Error('Boxes not found');

    // Get bounding box of boxA
    const boxABounds = await boxA.boundingBox();
    console.log('Box A bounds:', boxABounds);

    // Get bounding box of boxB
    const boxBBounds = await boxB.boundingBox();
    console.log('Box B bounds:', boxBBounds);

    // Example: Move mouse to center of Box A
    if (boxABounds) {
      await page.mouse.move(
        boxABounds.x + boxABounds.width / 2,
        boxABounds.y + boxABounds.height / 2
      );

      // Click and hold
      await page.mouse.down();

      // Drag to center of Box B
      if (boxBBounds) {
        await page.mouse.move(
          boxBBounds.x + boxBBounds.width / 2,
          boxBBounds.y + boxBBounds.height / 2
        );
      }

      await page.mouse.up();
    }

    // Optional: Verify text after drag-and-drop
    const boxAText = await boxA.textContent();
    console.log('Box A text after drag:', boxAText);

  });

});


test('should read href attribute using ElementHandle.getAttribute()', async ({ page }) => {
  // Navigate to a page
  await page.goto('https://example.com');

  // Get an ElementHandle for the first <a> element
  const elementHandle = await page.$('a');

  // Ensure element exists
  expect(elementHandle).not.toBeNull();

  if (elementHandle) {
    // Get the href attribute
    const hrefValue = await elementHandle.getAttribute('href');

    console.log('Href attribute:', hrefValue);

    // Assertion
    expect(hrefValue).toBe('https://iana.org/domains/example');
  }
});


test('should read innerText using ElementHandle.innerText()', async ({ page }) => {
  // Set simple HTML content
  await page.setContent(`
    <div>
      <h1 id="title">Welcome to Playwright</h1>
    </div>
  `);

  // Get ElementHandle
  const elementHandle = await page.$('#title');

  // Ensure element exists
  expect(elementHandle).not.toBeNull();

  if (elementHandle) {
    // Get innerText
    const text = await elementHandle.innerText();

    console.log('InnerText:', text);

    // Assertion
    expect(text).toBe('Welcome to Playwright');
  }
});


test('should read innerHTML using ElementHandle.innerHTML()', async ({ page }) => {
  // Set HTML content
  await page.setContent(`
    <div id="container">
      <span class="label">Hello</span>
      <strong>World</strong>
    </div>
  `);

  // Get ElementHandle
  const elementHandle = await page.$('#container');

  // Ensure element exists
  expect(elementHandle).not.toBeNull();

  if (elementHandle) {
    // Get innerHTML
    const html = await elementHandle.innerHTML();

    console.log('InnerHTML:', html);

    // Assertion
    expect(html).toContain('<span class="label">Hello</span>');
    expect(html).toContain('<strong>World</strong>');
  }
});


test('should read textContent using ElementHandle.textContent()', async ({ page }) => {
  await page.setContent(`
    <div id="container">
      <span>Hello</span>
      <strong>World</strong>
    </div>
  `);

  const elementHandle = await page.$('#container');
  expect(elementHandle).not.toBeNull();

  if (elementHandle) {
    const text = await elementHandle.textContent();
    expect(text?.replace(/\s+/g, '')).toBe('HelloWorld');
  }
});


test('should use JSHandle.evaluate() to read object property', async ({ page }) => {
  await page.goto('about:blank');

  // Create a JS object inside the browser context
  const jsHandle = await page.evaluateHandle(() => {
    return {
      name: 'Playwright',
      version: 1.0,
    };
  });

  // Use evaluate() on JSHandle
  const name = await jsHandle.evaluate((obj) => obj.name);

  expect(name).toBe('Playwright');
});
