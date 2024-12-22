import {test, expect, request}  from "@playwright/test"
import  { users } from "../testData/usersTestData"
import { data } from "../testData/searchFuncTestData"
import { HOME_PAGE_URL } from "../testData/baseTestData"
import {sleep} from "../utils/uiUtils";
import {deleteAllUsers} from "../utils/apiUtils";

// [
//     {tcName: data._1.tcName, searchCriteria: data._1.searchCriteria, expectedCount: data._1.expectedCount, expectedUsers: data._1.expectedUsers},
//     {tcName: data._2.tcName, searchCriteria: data._2.searchCriteria, expectedCount: data._2.expectedCount, expectedUsers: data._2.expectedUsers},
//     {tcName: data._3.tcName, searchCriteria: data._3.searchCriteria, expectedCount: data._3.expectedCount, expectedUsers: data._3.expectedUsers},
//     {tcName: data._4.tcName, searchCriteria: data._4.searchCriteria, expectedCount: data._4.expectedCount, expectedUsers: data._4.expectedUsers},
//     {tcName: data._5.tcName, searchCriteria: data._5.searchCriteria, expectedCount: data._5.expectedCount, expectedUsers: data._5.expectedUsers},
//     {tcName: data._6.tcName, searchCriteria: data._6.searchCriteria, expectedCount: data._6.expectedCount, expectedUsers: data._6.expectedUsers}
// ].forEach(({tcName, searchCriteria, expectedCount, expectedUsers}) => {
    test.describe('Edit and Delete users functionality', async() => {
        let apiRequest
        let randomUser
        const usersDB = [users.user1, users.user2, users.user3, users.user4]
        test.beforeEach('Land on Home Page, Create tested users', async({page}) => {
            apiRequest = await request.newContext()
            await deleteAllUsers(apiRequest)
            await page.goto(HOME_PAGE_URL)
            const firstNameField = await page.getByPlaceholder('Enter first name')
            const lastNameField = await page.getByPlaceholder('Enter last name')
            const ageField = await page.getByPlaceholder('Enter age ( 1 - 150 )')
            const addButton = await page.getByRole('button', {name: 'Add'})

            for (const user of usersDB) {
                await firstNameField.fill(user.firstName)
                await lastNameField.fill(user.lastName)
                await ageField.fill(user.age)

                await addButton.click()
                user.id = await page.locator('tbody>tr').last()
                    .locator('td').nth(3)
                    .innerText()
            }
            //2. User is on Home page
            await page.goto(HOME_PAGE_URL);

            const users = page.locator('tbody > tr');
            const usersAmount = await users.count();

            //3.Select random user
            await expect(usersAmount).toBeGreaterThanOrEqual(1);

            const randomUserIndex = Math.floor(Math.random() * usersAmount);
            randomUser = await users.nth(randomUserIndex);

            console.log(randomUser);

            sleep(500)
        })

        test(`TC-editUserFun-1: `, async ({page}) => {
            console.log("test")

            const editIcon = await randomUser.locator('td>i>a.bi-pen')
            await editIcon.click()

            await page.waitForLoadState('networkidle')

            let user = []

            const inputs = await page.locator('#form-edit input').all()
            for (const input of inputs) {
                user.push(await input.getAttribute('placeholder'))
            }



            // await page.locator('[href*="/search"]').click()
            // const firstNameField = await page.getByPlaceholder('Enter first name')
            // const lastNameField = await page.getByPlaceholder('Enter last name')
            // const ageField = await page.getByPlaceholder('Enter age ( 1 - 150 )')
            // const userIdField = await page.getByPlaceholder('Enter user ID...')
            // const searchButton = await page.getByRole('button', {name: 'Search'})
            //
            // await userIdField.fill(searchCriteria[0])
            // await firstNameField.fill(searchCriteria[1])
            // await lastNameField.fill(searchCriteria[2])
            // await ageField.fill(searchCriteria[3])
            // await searchButton.click()
            //
            // sleep(100)
            // const actualListSearchedUsers = await page.locator('tbody>tr').all()
            // const actualCountSearchedUsers = actualListSearchedUsers.length
            //
            // await expect(actualCountSearchedUsers).toEqual(expectedCount)
            //
            // for (let i = 0; i < actualCountSearchedUsers; i++) {
            //
            //     const actualUserId = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .nth(3).innerText()
            //     const actualFirstUserName = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .first().innerText()
            //     const actualLastUserName = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .nth(1).innerText()
            //     const actualAge = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .nth(2).innerText()
            //
            //     await expect(actualFirstUserName).toEqual(expectedUsers[i].firstName)
            //     await expect(actualLastUserName).toEqual(expectedUsers[i].lastName)
            //     await expect(actualAge).toEqual(expectedUsers[i].age)
            //     await expect(actualUserId).toEqual(expectedUsers[i].id)
            // }
        })

        test(`TC-deleteUserFun-1: `, async ({page}) => {
            console.log("test")
            // await page.locator('[href*="/search"]').click()
            // const firstNameField = await page.getByPlaceholder('Enter first name')
            // const lastNameField = await page.getByPlaceholder('Enter last name')
            // const ageField = await page.getByPlaceholder('Enter age ( 1 - 150 )')
            // const userIdField = await page.getByPlaceholder('Enter user ID...')
            // const searchButton = await page.getByRole('button', {name: 'Search'})
            //
            // await userIdField.fill(searchCriteria[0])
            // await firstNameField.fill(searchCriteria[1])
            // await lastNameField.fill(searchCriteria[2])
            // await ageField.fill(searchCriteria[3])
            // await searchButton.click()
            //
            // sleep(100)
            // const actualListSearchedUsers = await page.locator('tbody>tr').all()
            // const actualCountSearchedUsers = actualListSearchedUsers.length
            //
            // await expect(actualCountSearchedUsers).toEqual(expectedCount)
            //
            // for (let i = 0; i < actualCountSearchedUsers; i++) {
            //
            //     const actualUserId = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .nth(3).innerText()
            //     const actualFirstUserName = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .first().innerText()
            //     const actualLastUserName = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .nth(1).innerText()
            //     const actualAge = await page.locator('tbody>tr')
            //         .nth(i).locator('td')
            //         .nth(2).innerText()
            //
            //     await expect(actualFirstUserName).toEqual(expectedUsers[i].firstName)
            //     await expect(actualLastUserName).toEqual(expectedUsers[i].lastName)
            //     await expect(actualAge).toEqual(expectedUsers[i].age)
            //     await expect(actualUserId).toEqual(expectedUsers[i].id)
            // }
        })

        test.afterEach('Close API request context', async ({page}) => {
            await deleteAllUsers(apiRequest)
            await apiRequest.dispose()
        })
    })