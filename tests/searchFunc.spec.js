import {test, expect, request}  from "@playwright/test"
import  { users } from "../testData/usersTestData"
import { data } from "../testData/searchFuncTestData"
import { HOME_PAGE_URL } from "../testData/baseTestData"
import {sleep} from "../utils/uiUtils";
import {deleteAllUsers} from "../utils/apiUtils";

[
    {tcName: data._1.tcName, searchCriteria: data._1.searchCriteria, expectedCount: data._1.expectedCount, expectedUsers: data._1.expectedUsers},
    {tcName: data._2.tcName, searchCriteria: data._2.searchCriteria, expectedCount: data._2.expectedCount, expectedUsers: data._2.expectedUsers},
    {tcName: data._3.tcName, searchCriteria: data._3.searchCriteria, expectedCount: data._3.expectedCount, expectedUsers: data._3.expectedUsers},
    {tcName: data._4.tcName, searchCriteria: data._4.searchCriteria, expectedCount: data._4.expectedCount, expectedUsers: data._4.expectedUsers},
    {tcName: data._5.tcName, searchCriteria: data._5.searchCriteria, expectedCount: data._5.expectedCount, expectedUsers: data._5.expectedUsers},
    {tcName: data._6.tcName, searchCriteria: data._6.searchCriteria, expectedCount: data._6.expectedCount, expectedUsers: data._6.expectedUsers}
].forEach(({tcName, searchCriteria, expectedCount, expectedUsers}) => {
    test.describe('Search user functionality', async() => {
        let apiRequest
        const usersDB = [users.user1, users.user2, users.user3, users.user4]
        test.beforeEach('Land on Home Page, Create tested users', async({page}) => {
            apiRequest = await request.newContext()
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
                user.id = await page.locator('tbody>tr>td').last().innerText()
            }
        })

        test(`TC-searchFun-1: ${tcName}`, async ({page, request}) => {
            await page.locator('[href*="/search"]').click()
            const firstNameField = await page.getByPlaceholder('Enter first name')
            const lastNameField = await page.getByPlaceholder('Enter last name')
            const ageField = await page.getByPlaceholder('Enter age ( 1 - 150 )')
            const userIdField = await page.getByPlaceholder('Enter user ID...')
            const searchButton = await page.getByRole('button', {name: 'Search'})

            await userIdField.fill(searchCriteria[0])
            await firstNameField.fill(searchCriteria[1])
            await lastNameField.fill(searchCriteria[2])
            await ageField.fill(searchCriteria[3])
            await searchButton.click()

            const actualListSearchedUsers = await page.locator('tbody')
                .locator('tr').all()
            sleep(300)
            const actualCountSearchedUsers = actualListSearchedUsers.length

            await expect(actualCountSearchedUsers).toEqual(expectedCount)

            for (let i = 0; i < actualCountSearchedUsers; i++) {

                const actualUserId = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .last().innerText()
                const actualFirstUserName = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .first().innerText()
                const actualLastUserName = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(1).innerText()
                const actualAge = await page.locator('tbody>tr')
                    .nth(i).locator('td')
                    .nth(2).innerText()

                await expect(actualFirstUserName).toEqual(expectedUsers[i].firstName)
                await expect(actualLastUserName).toEqual(expectedUsers[i].lastName)
                await expect(actualAge).toEqual(expectedUsers[i].age)
                await expect(actualUserId).toEqual(expectedUsers[i].id)
            }
        })

        test.afterEach('Close API request context', async ({page}) => {
            // await page.locator('[href*="/delete"]').click()
            // const userIdField = await page.getByPlaceholder('Enter user ID...')
            // const deleteButton = await page.getByRole('button', {name: 'Delete'})
            //
            // for (const user of usersDB) {
            //     if (user.id.length > 1 ) {
            //         let status = true
            //         let count = 1
            //         let contentTypeHeaderValue = ''
            //         while (status) {
            //             await userIdField.fill(user.id)
            //             await deleteButton.click()
            //             const response = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + user.id)
            //             const headersArray = await response.headersArray();
            //             const contentTypeHeader = headersArray.find(
            //                 (header) => header.name === 'Content-Type');
            //             contentTypeHeaderValue = contentTypeHeader.value;
            //             console.log("TYPE = ", contentTypeHeaderValue)
            //             sleep(1000)
            //             if (contentTypeHeaderValue === 'text/html; charset=utf-8') {
            //                 status = false
            //                 user.id = ''
            //             } else {
            //                 count++
            //             }
            //         }
            //         if (count > 1) {
            //             console.log("COUNT = ", count)
            //         }
            //     }
            // }
            // sleep(1000)
            await deleteAllUsers(apiRequest)
            sleep(500)
            await apiRequest.dispose()
        })
    })
})