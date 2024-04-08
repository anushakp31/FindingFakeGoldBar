// @ts-check
const { test, expect } = require('@playwright/test');
const _ = require('lodash');


test('Algorithm', async ({ page }) => {

    const handleSuccessAlert = async () => {
        page.on('dialog', async dialog => {
            if (dialog.message() === "Yay! You find it!") {
                console.log("Success message received: Yay! You find it!");
                await dialog.accept(); // Accept the dialog
            } else {
                console.error("Unexpected dialog message:", dialog.message());
              await expect(false).toBe(true); // Fails the test
            }
        });
        
    };
    const resetAndAssert = async () => {
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(resultSign).toContainText('?')
    };

    const clickWeighButton = async () => {
        await page.locator('id=weigh').click();
    };

    const fillBowls = async (leftValue, rightValue) => {
        await page.locator('id=left_0').fill(leftValue);
        await page.locator('id=right_0').fill(rightValue);
    };
    const isResultSignEqualTo = async (expectedSign) => {
        const resultSignText = await page.locator('button[id=reset][disabled]').innerText();
        return resultSignText === expectedSign;
    };
    const resultSign = page.locator('button[id=reset][disabled]')
    

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
    console.log("Filled Left")

    for (let i = 0; i < leftBowl.length; i++) {
        await page.locator(`id=right_${i}`).fill(rightBowl[i]);
    }

    console.log("Filled Right")

    clickWeighButton();
    await expect(resultSign).toHaveText(/(<)|(>)|(=)/);
    const initialSign=await resultSign.innerText();

    if (initialSign==='=') {
        console.log("The left and the right bowls are equal!!")
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(resultSign).toContainText('?')
       fillBowls(remainder[0],remainder[1])
        clickWeighButton();
        await expect(resultSign).toHaveText(/(<)|(>)|(=)/);
        const initialSign1=await resultSign.innerText();

        if (initialSign1==='=') {

            handleSuccessAlert();
            await page.locator(`id=coin_${remainder[2]}`).click();
            console.log(`The fake bar is ${remainder[2]}`)

        }
        else if (initialSign1==='<') {
            handleSuccessAlert();
            await page.locator(`id=coin_${remainder[0]}`).click();
           
            console.log(`The fake bar is ${remainder[0]}`)
        }
        else {
            handleSuccessAlert();
            await page.locator(`id=coin_${remainder[1]}`).click();
            
            console.log(`The fake bar is ${remainder[1]}`)
        }
    }
    else if(initialSign==='<'){
            
            console.log("The left bowl is lesser than the right bowl!!")
            await page.getByRole('button', { name: 'Reset' }).click();
            await expect(resultSign).toContainText('?')
            fillBowls(leftBowl[0],leftBowl[1])
            clickWeighButton();
            await expect(resultSign).toHaveText(/(<)|(>)|(=)/);
            const initialSign1=await resultSign.innerText();
    
            if (initialSign1==='=') {
                
                handleSuccessAlert();
                await page.locator(`id=coin_${leftBowl[2]}`).click();
               
                console.log(`The fake bar is ${leftBowl[2]}`)

            }
            else if (initialSign1==='<') {
                handleSuccessAlert();
                await page.locator(`id=coin_${leftBowl[0]}`).click();
                
                console.log(`The fake bar is ${leftBowl[0]}`)
            }
            else {
                handleSuccessAlert();
                await page.locator(`id=coin_${leftBowl[1]}`).click();
                
                console.log(`The fake bar is ${leftBowl[1]}`)
            }
        }
        else if(initialSign==='>'){
            console.log("The right bowl is lesser than the left bowl!!")
            await page.getByRole('button', { name: 'Reset' }).click();
            await expect(resultSign).toContainText('?')
            fillBowls(rightBowl[0],rightBowl[1])
            clickWeighButton();
            await expect(resultSign).toHaveText(/(<)|(>)|(=)/);
            const initialSign1=await resultSign.innerText();
            if (initialSign1==='=') {
                await page.locator(`id=coin_${rightBowl[2]}`).click();
                handleSuccessAlert();
                console.log(`The fake bar is ${rightBowl[2]}`)

            }
            else if (initialSign1==='<') {
                handleSuccessAlert()
                await page.locator(`id=coin_${rightBowl[0]}`).click();
                ;
                console.log(`The fake bar is ${rightBowl[0]}`)
            }
            else {
                handleSuccessAlert();
                await page.locator(`id=coin_${rightBowl[1]}`).click();
               
                console.log(`The fake bar is ${rightBowl[1]}`)
            }

        }
    
});
