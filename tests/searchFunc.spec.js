import {test, expect, request}  from "@playwright/test"
import  { users } from "../testData/usersTestData"
import { data } from "../testData/searchFuncTestData"
import { HOME_PAGE_URL } from "../testData/baseTestData";

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
                // console.log(user.id)
            }
            console.log(usersDB)

        })

        test(`TC-searchFun-1: ${tcName}`, async ({page, request}) => {


            await expect(true).toBe(true)
        })

        test.afterEach('Close API request context', async () => {
            await apiRequest.dispose()
            // add cleaner users DB!!!
        })
    })
})