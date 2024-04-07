// @ts-check
const { test, expect } = require('@playwright/test');

test('Algorithm', async ({ page }) => {
    const result1=page.getByText('[0,1,2] = [3,4,5]')
    const result2=page.getByText('[6] = [8]')
    const result3=page.getByText('[6] < [8]')
    const resultSign=page.locator('button[id=reset][disabled]')
    const buttonText=resultSign.innerText();
  await page.goto('http://sdetchallenge.fetch.com/');

  // Expect a title "to contain" a substring.
  await expect(page.getByText('Weighings')).toBeVisible();
  await page.locator('id=left_0').fill('0'); 
  await page.locator('id=left_1').fill('1'); 
  await page.locator('id=left_2').fill('2'); 
  console.log("Filled Left")


  await page.locator('id=right_0').fill('3'); 
  await page.locator('id=right_1').fill('4'); 
  await page.locator('id=right_2').fill('5'); 

  console.log("Filled Right")

  await page.locator('id=weigh').click();
await expect(resultSign).toContainText('=')

  if(await result1.isVisible()){
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(resultSign).toContainText('?')
   await page.locator('id=left_0').fill('6'); 
   await page.locator('id=right_0').fill('8'); 
   await page.waitForTimeout(2000);
   await page.locator('id=weigh').click();
   await expect(resultSign).toContainText('=')

   if (await result2.isVisible()){
    console.log("Fount it!!")
    await page.locator('id=coin_7').click();
    page.on("dialog", async (alert) => {
        const text = alert.message();
        console.log(text);
        await alert.accept();
    })

   }


    else if (await result3.isVisible()){
        await page.locator('id=coin_6').click();
        page.on("dialog", async (alert) => {
            const text = alert.message();
            console.log(text);
            await alert.accept();
        })
        
    }
    else{
        await page.locator('id=coin_8').click();
        page.on("dialog", async (alert) => {
            const text = alert.message();
            console.log(text);
            await alert.accept();
        })
    }



  }
  
  
});
  