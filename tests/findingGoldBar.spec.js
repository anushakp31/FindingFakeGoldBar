// @ts-check
const { test, expect } = require('@playwright/test');
const _ = require('lodash');
test('Algorithm', async ({ page }) => {
    const handleSuccessAlert = async () => {
        page.on('dialog', async dialog => {
            if (dialog.message() === "Yay! You find it!") {
                console.log("Success message received: Yay! You find it!");
                await dialog.accept();
            } else {
                console.error("Unexpected dialog message:", dialog.message());
                await expect(false).toBe(true);
            }
        });

    };
    //Clicks on Reset button and asserts the sign
    const resetAndAssert = async () => {
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(resultSign).toContainText('?')
    };

    //Clicks on Weigh button and returns a respective sign
    const clickWeighButtonAndGetSign = async (resultSign) => {
        await page.locator('id=weigh').click();
        await expect(resultSign).toContainText(/(<)|(>)|(=)/);
        const initialSign = await resultSign.innerText();
        return initialSign;
    };

    const fillBowls = async (leftValue, rightValue) => {
        await page.locator('id=left_0').fill(leftValue);
        await page.locator('id=right_0').fill(rightValue);
    };
    const resultSign = page.locator('button[id=reset][disabled]')
    const handleComparisons = async (bowl) => {
        console.log(`The fake bar is one among them! ${bowl}`);
        await resetAndAssert();
        fillBowls(bowl[0], bowl[1])
        const initialSign1 = await clickWeighButtonAndGetSign(resultSign);
        const olElement = await page.locator('ol');
        const secondLiElementText = await olElement.locator('li:nth-child(2)').innerText();
        console.log(secondLiElementText)
        if (initialSign1 === '=') {

            await handleSuccessAlert();
            await page.locator(`id=coin_${bowl[2]}`).click();
            console.log(`The fake bar is ${bowl[2]}`)

        }
        else if (initialSign1 === '<') {
            await handleSuccessAlert();
            await page.locator(`id=coin_${bowl[0]}`).click();
            console.log(`The fake bar is ${bowl[0]}`)
        }
        else {
            await handleSuccessAlert();
            await page.locator(`id=coin_${bowl[1]}`).click();
            console.log(`The fake bar is ${bowl[1]}`)
        }
    }

    await page.goto('http://sdetchallenge.fetch.com/');

    const buttons = await page.locator('button[id^="coin_"]').all();
    const texts = await Promise.all(buttons.map(async (button) => {
        return button.innerText();
    }));

    const chunkSize = Math.ceil(texts.length / 3);
    const [leftBowl, rightBowl, remainder] = [
        texts.slice(0, chunkSize),
        texts.slice(chunkSize, 2 * chunkSize),
        texts.slice(2 * chunkSize)
    ];

    console.log('Left Bowl:', leftBowl);
    console.log('Right Bowl:', rightBowl);
    console.log('Remainder:', remainder);


    await expect(page.getByText('Weighings')).toBeVisible();
    for (let i = 0; i < leftBowl.length; i++) {
        await page.locator(`id=left_${i}`).fill(leftBowl[i]);
    }
    // console.log("Filled Left")

    for (let i = 0; i < leftBowl.length; i++) {
        await page.locator(`id=right_${i}`).fill(rightBowl[i]);
    }


    // console.log("Filled Right")
    const initialSign = await clickWeighButtonAndGetSign(resultSign);
    const olElement = await page.locator('ol');
  const text = await olElement.innerText();
  console.log(text)
    if (initialSign === '=') {
        console.log("The left and the right bowls are equal!!")
        await handleComparisons(remainder);
    }
    else if (initialSign === '<') {

        console.log("The left bowl is lesser than the right bowl!!")
        await handleComparisons(leftBowl)
    }
    else if (initialSign === '>') {
        console.log("The right bowl is lesser than the left bowl!!")
        await handleComparisons(rightBowl)
    }

});
