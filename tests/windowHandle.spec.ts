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

