// @ts-check
const { test, expect } = require('@playwright/test');
const _ = require('lodash');


test('Algorithm', async ({ page }) => {

    // Create an array from 0 to 8
    const originalArray = Array.from({ length: 9 }, (_, index) => index);

    // Split the array into three arrays
    const chunkSize = Math.ceil(originalArray.length / 3);
    const [leftBowl, rightBowl, ...remainder] = [
        ...Array.from({ length: 2 }, (_, i) => originalArray.slice(i * chunkSize, (i + 1) * chunkSize)),
        ...originalArray.slice(2 * chunkSize) // Spread the remainder array directly
    ];


    console.log('Left Bowl:', leftBowl);
    console.log('Right Bowl:', rightBowl);
    console.log('Remainder:', remainder);




    const resultText = `[${leftBowl.join(',')}] = [${rightBowl.join(',')}]`;
    const result1 = page.getByText(resultText);


    const resultSign = page.locator('button[id=reset][disabled]')
    const resultButton = resultSign.innerText();
    await page.goto('http://sdetchallenge.fetch.com/');

    // Expect a title "to contain" a substring.
    await expect(page.getByText('Weighings')).toBeVisible();
    for (let i = 0; i < leftBowl.length; i++) {
        await page.locator(`id=left_${i}`).fill(leftBowl[i].toString());
    }
    console.log("Filled Left")

    for (let i = 0; i < leftBowl.length; i++) {
        await page.locator(`id=right_${i}`).fill(rightBowl[i].toString());
    }

    console.log("Filled Right")

    await page.locator('id=weigh').click();
    // await page.waitForTimeout(10000);
    // console.log((await resultButton).toString())
    try {
        await expect(resultSign).toHaveText('=');
        // await expect(resultSign).toContainText('=');
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(resultSign).toContainText('?')
        await page.locator('id=left_0').fill(remainder[0].toString());
        await page.locator('id=right_0').fill(remainder[1].toString());
        await page.waitForTimeout(2000);
        await page.locator('id=weigh').click();

        const result2 = page.getByText(`[${remainder[0]}] = [${remainder[1]}]`);
        const result3 = page.getByText(`[${remainder[0]}] < [${remainder[1]}]`);


        if (await result2.isVisible()) {
            console.log("Fount it!!")
            await page.locator(`id=coin_${remainder[2]}`).click();
            page.on("dialog", async (alert) => {
                const text = alert.message();
                console.log(text);
                await alert.accept();
            })

        }


        else if (await result3.isVisible()) {
            await page.locator(`id=coin_${remainder[0]}`).click();


            page.on("dialog", async (alert) => {
                const text = alert.message();
                console.log(text);
                await alert.accept();
            })

        }
        else {
            await page.locator(`id=coin_${remainder[1]}`).click();
            page.on("dialog", async (alert) => {
                const text = alert.message();
                console.log(text);
                await alert.accept();
            })
        }
    }


    catch (error) {

        try {
            await expect(resultSign).toHaveText('<');
            await expect(resultSign).toContainText('<');
            await page.getByRole('button', { name: 'Reset' }).click();
            await expect(resultSign).toContainText('?')
            await page.locator('id=left_0').fill(leftBowl[0].toString());
            await page.locator('id=right_0').fill(leftBowl[1].toString());
            await page.waitForTimeout(2000);
            await page.locator('id=weigh').click();

            const result2 = page.getByText(`[${leftBowl[0]}] = [${leftBowl[1]}]`);
            const result3 = page.getByText(`[${leftBowl[0]}] < [${leftBowl[1]}]`);


            if (await result2.isVisible()) {
                console.log("Fount it!!")
                await page.locator(`id=coin_${leftBowl[2]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })

            }


            else if (await result3.isVisible()) {
                await page.locator(`id=coin_${leftBowl[0]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })

            }
            else {
                await page.locator(`id=coin_${leftBowl[1]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })
            }




        }
        catch {
            await expect(resultSign).toContainText('>');
            await page.getByRole('button', { name: 'Reset' }).click();
            await expect(resultSign).toContainText('?')
            await page.locator('id=left_0').fill(rightBowl[0].toString());
            await page.locator('id=right_0').fill(rightBowl[1].toString());
            await page.waitForTimeout(2000);
            await page.locator('id=weigh').click();

            const result2 = page.getByText(`[${rightBowl[0]}] = [${rightBowl[1]}]`);
            const result3 = page.getByText(`[${rightBowl[0]}] < [${rightBowl[1]}]`);


            if (await result2.isVisible()) {
                console.log("Fount it!!")
                await page.locator(`id=coin_${rightBowl[2]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })

            }


            else if (await result3.isVisible()) {
                await page.locator(`id=coin_${rightBowl[0]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })

            }
            else {
                await page.locator(`id=coin_${rightBowl[1]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })
            }

        }
    }



});
