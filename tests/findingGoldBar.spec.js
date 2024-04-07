// @ts-check
const { test, expect } = require('@playwright/test');
const _ = require('lodash');


test('Algorithm', async ({ page }) => {



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



    const resultText = `[${leftBowl.join(',')}] = [${rightBowl.join(',')}]`;
    const result1 = page.getByText(resultText);


    const resultSign = page.locator('button[id=reset][disabled]')
    const resultButton = resultSign.innerText();

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
    try {
        await expect(resultSign).toHaveText('=');
        console.log("The left and the right bowls are equal!!")
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(resultSign).toContainText('?')
        await page.locator('id=left_0').fill(remainder[0].toString());
        await page.locator('id=right_0').fill(remainder[1].toString());
        await page.locator('id=weigh').click();

        const result2 = page.getByText(`[${remainder[0]}] = [${remainder[1]}]`);
        const result3 = page.getByText(`[${remainder[0]}] < [${remainder[1]}]`);


        if (await result2.isVisible()) {
            
            await page.locator(`id=coin_${remainder[2]}`).click();
            page.on("dialog", async (alert) => {
                const text = alert.message();
                console.log(text);
                await alert.accept();
            })
            console.log(`Fount it!! The fake bar is ${remainder[2]}`)

        }


        else if (await result3.isVisible()) {
            await page.locator(`id=coin_${remainder[0]}`).click();


            page.on("dialog", async (alert) => {
                const text = alert.message();
                console.log(text);
                await alert.accept();
            })
            console.log(`Fount it!! The fake bar is ${remainder[0]}`)

        }
        else {
            await page.locator(`id=coin_${remainder[1]}`).click();
            page.on("dialog", async (alert) => {
                const text = alert.message();
                console.log(text);
                await alert.accept();
            })
            console.log(`Fount it!! The fake bar is ${remainder[1]}`)
        }
    }


    catch (error) {

        try {
            console.log("The left bowl is lesser than the right bowl!!")
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
                console.log(`Fount it!! The fake bar is ${leftBowl[2]}`)

            }


            else if (await result3.isVisible()) {
                await page.locator(`id=coin_${leftBowl[0]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })
                console.log(`Fount it!! The fake bar is ${leftBowl[0]}`)
            }
            else {
                await page.locator(`id=coin_${leftBowl[1]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })
                console.log(`Fount it!! The fake bar is ${leftBowl[1]}`)
            }




        }
        catch {
            console.log("The right bowl is lesser than the left bowl!!")
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
                console.log(`Fount it!! The fake bar is ${rightBowl[2]}`)

            }


            else if (await result3.isVisible()) {
                await page.locator(`id=coin_${rightBowl[0]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })
                console.log(`Fount it!! The fake bar is ${rightBowl[0]}`)

            }
            else {
                await page.locator(`id=coin_${rightBowl[1]}`).click();
                page.on("dialog", async (alert) => {
                    const text = alert.message();
                    console.log(text);
                    await alert.accept();
                })
                console.log(`Fount it!! The fake bar is ${rightBowl[1]}`)
            }

        }
    }



});
