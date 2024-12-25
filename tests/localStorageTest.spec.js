import {test, expect, request} from "@playwright/test"
import {HOME_PAGE_URL} from "../testData/baseTestData"
import {createUsers, deleteAllUsers} from "../utils/apiUtils";

test.describe('Save and retrieve data to localStorage Functionality', async () => {
    let apiRequest

    test.beforeEach('Land on Home Page, Create tested users', async ({page}) => {
        apiRequest = await request.newContext()
        await deleteAllUsers(apiRequest)
        await createUsers(apiRequest)
        await page.goto(HOME_PAGE_URL)
    })

    test(`TC-LocalStorageFun-1: Data from random user should be saved in local storage by clicking on Edit icon`,
        async ({page, request}) => {

        const users = await page.locator('tbody>tr')

        expect(await users.count()).toBeGreaterThanOrEqual(1)

        const firstUser = await users.first();
        const firstUserText = (await firstUser.allInnerTexts())[0]
            .split('\t');
        let firstUserData = [];
        for (let i = 1; i <= 4; i++) {
            firstUserData[i - 1] = firstUserText[i];
        }

        const firstUserEditIcon = await firstUser.locator('td')
            .nth(4).locator('i>a');
        await firstUserEditIcon.hover().then(async () => {
            await firstUserEditIcon.click();
        });

        const lsId = await page.evaluate(() =>
            localStorage.getItem('idValue'))
        const lsFirstName = await page.evaluate(() =>
            localStorage.getItem('firstNameValue'))
        const lsLastName = await page.evaluate(() =>
            localStorage.getItem('lastNameValue'))
        const lsAge = await page.evaluate(() =>
            localStorage.getItem('ageValue'))

        expect(lsId).toEqual(firstUserData[3])
        expect(lsFirstName).toEqual(firstUserData[0])
        expect(lsLastName).toEqual(firstUserData[1])
        expect(lsAge).toEqual(firstUserData[2])
    })
    test(`TC-LocalStorageFun-2: Data from random user should be saved in local storage by clicking on Edit icon`,
        async ({page}) => {

        const users = await page.locator('tbody > tr');
        const usersAmount = await users.count();

        await expect(usersAmount).toBeGreaterThanOrEqual(1);

        let randomUserIndex = Math.floor(Math.random() * usersAmount);
        const randomUser = await users.nth(randomUserIndex);
        const randomUserText = (await randomUser.allInnerTexts())[0].split('\t');
        let randomUserData = [];

        for(let i = 1; i <= 4; i++) {
            randomUserData[i - 1] = randomUserText[i];
        }

        const randomUserEditIcon = await randomUser.locator('td').nth(4).locator('i>a');

        await randomUserEditIcon.hover().then(async() => {
            await randomUserEditIcon.click();
        });

        const lsId = await page.evaluate(() => localStorage.getItem('idValue'));
        const lsFirstName = await page.evaluate(() => localStorage.getItem('firstNameValue'));
        const lsLastName = await page.evaluate(() => localStorage.getItem('lastNameValue'));
        const lsAge = await page.evaluate(() => localStorage.getItem('ageValue'));

        await expect(lsId).toEqual(randomUserData[3]);
        await expect(lsFirstName).toEqual(randomUserData[0]);
        await expect(lsLastName).toEqual(randomUserData[1]);
        await expect(lsAge).toEqual(randomUserData[2]);
        });
        test.afterEach('Close API request context', async ({page}) => {

        await apiRequest.dispose()
    })
})