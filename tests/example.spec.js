
const { test, expect } = require('@playwright/test');
const _ = require('lodash');

test('Algorithm1', async ({ page }) => {
  await page.goto('http://sdetchallenge.fetch.com/');
  page.on('dialog', async dialog => {
    if (dialog.message() === "Yay! You find it!") {
        console.log("Success message received: Yay! You find it!");
        await dialog.accept(); // Accept the dialog
    } else {
        console.error("Unexpected dialog message:", dialog.message());
        // Optionally, you can fail the test here
        // For example, using Playwright's built-in expect/assert mechanism
        await expect(false).toBe(true); // Fails the test
    }
});

  await page.locator('button[id="coin_1"]').click();
  
});

