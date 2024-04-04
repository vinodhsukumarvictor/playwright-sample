import { Page, expect, selectors } from '@playwright/test';
import test from "../lambdatest-setup";
import fs from 'fs';

test.describe.configure({ mode: 'parallel' });

// test.beforeEach(async ({ page }) => {
//   await page.goto('https://www.lambdatest.com/selenium-playground/');
// });

//Test Scenario 1
test('Test Scenario 1 : Simple Form Demo', async ({ page },testInfo) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/');
  // await page.getByText("Simple Form Demo").isVisible();
  await page.getByText("Simple Form Demo").click();
  let valuetoenterActual = 'Welcome to LambdaTest';
  await page.getByRole('button', { name: 'Get Checked Value' }).isVisible();
  await page.getByPlaceholder('Please enter your Message').fill(valuetoenterActual);
  await page.getByRole('button', { name: 'Get Checked Value' }).click();

  await testInfo.attach("success",{
    body: await page.screenshot({fullPage: true}),
    contentType: "image/png",
  });

  await page.locator('#message').isVisible();
  await expect(page.locator('#message')).toHaveText(valuetoenterActual);
  // let actualValue = await page.locator('#message').textContent();
  // await expect(page.locator('#message')).toHaveText('test') //used to test negative scenario
});

//Test Scenario 2
test('Test Scenario 2 : Drag & Drop Sliders', async ({ page },testInfo) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/');
  // await page.getByText("Drag & Drop Sliders").isVisible();
  await page.getByText("Drag & Drop Sliders").click();
  await page.locator('//*[@id="slider3"]/div/input').isVisible();
  await page.locator('//*[@id="rangeSuccess"]').isVisible();
  const slider = await page.locator('//*[@id="slider3"]/div/input');
  let slidervalueTarget = '95';
  let slidervalueObj = await page.locator('//*[@id="rangeSuccess"]');
  let slidervalue = await page.locator('//*[@id="rangeSuccess"]').textContent();
  console.log(slidervalue);

  const sliderWidth = await slider.evaluate(el => {
    return el.getBoundingClientRect().width
  })

  await slider.hover({ force: true, position: { x: 0, y: 0 } })
  await page.mouse.down()
  await slider.hover({ force: true, position: { x: sliderWidth * ((parseInt(slidervalueTarget)-2)/100)  , y: 0 } })
  await page.mouse.up()

  await testInfo.attach("success",{
    body: await page.screenshot({fullPage: false}),
    contentType: "image/png",
  });
  
  slidervalue = await page.locator('//*[@id="rangeSuccess"]').textContent();
  console.log("slider value after move : " + slidervalue);

  await expect(slidervalueObj).toHaveText(slidervalueTarget);


  });
   


//Test Scenario 3
test('Test Scenario 3 : Input Forms', async ({ page }, testInfo) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/');
  // await page.getByText("Input Form Submit").isVisible();
  await page.getByText("Input Form Submit").click();
  
  //Submit form with no details entered
  const expectederrorMessage = 'Please fill out this field.';
  await page.locator('//*[@id="name"]').isVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  //Error message when no data is entered and submit is clicked doesn't appear as per the exercise
  //Hence we are having to get the tool tip in run time and validate
  const actualerrorMessage = await page.locator('//*[@id="name"]').evaluate((element) => {
    const input = element as HTMLInputElement
    return input.validationMessage
  })

  console.log(actualerrorMessage);
  expect(actualerrorMessage ===expectederrorMessage).toBeTruthy();

  //Submit form with all details entered
  const expectedsuccessMessage = 'Thanks for contacting us, we will get back to you shortly.';
  await page.locator('//*[@id="name"]').isVisible();
  await page.locator('//*[@id="name"]').fill('Vinodh');
  await page.locator('//*[@id="inputEmail4"]').fill('abc@abc.com');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByPlaceholder('Company').fill('CTS');
  await page.getByPlaceholder('Website').fill('CTS@company.com');
  await page.locator('//*[@id="seleniumform"]/div[3]/div[1]/select').selectOption('GB');
  await page.getByPlaceholder('City').fill('London');
  await page.getByPlaceholder('Address 1').fill('1 Street');
  await page.getByPlaceholder('Address 2').fill('Lewisham');
  await page.getByPlaceholder('State').fill('UK');
  await page.getByPlaceholder('Zip code').fill('SE1 2EY');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('//*[@id="__next"]/div/section[2]/div/div/div/div/p').isVisible();

  await testInfo.attach("success",{
    body: await page.screenshot({fullPage: true}),
    contentType: "image/png",
  });

  const successMessageObj = await page.locator('//*[@id="__next"]/div/section[2]/div/div/div/div/p');
  const actualsuccessMessage = await successMessageObj.textContent();
  console.log(actualsuccessMessage);
  await expect(successMessageObj).toHaveText(expectedsuccessMessage);
  // await expect(successMessageObj).toHaveText('test negative scenario');
});