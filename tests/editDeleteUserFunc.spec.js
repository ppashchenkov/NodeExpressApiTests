import {test, expect, request}  from "@playwright/test"
import  { users } from "../testData/usersTestData"
import { data } from "../testData/searchFuncTestData"
import { HOME_PAGE_URL } from "../testData/baseTestData"
import {sleep} from "../utils/uiUtils";
import {deleteAllUsers} from "../utils/apiUtils";

[
    {tcName: 'edit-01', editCriteria: [users.user5.firstName, '', '']},
    {tcName: 'edit-02', editCriteria: ['', users.user5.lastName, '']},
    {tcName: 'edit-03', editCriteria: ['', '', users.user5.age]},
    {tcName: 'edit-04', editCriteria: [users.user5.firstName, users.user5.lastName, '']},
    {tcName: 'edit-05', editCriteria: [users.user5.firstName, '', users.user5.age]},
    {tcName: 'edit-06', editCriteria: ['', users.user5.lastName, users.user5.age]},
    {tcName: 'edit-07', editCriteria: [users.user5.firstName, users.user5.lastName, users.user5.age]}
].forEach(({tcName, editCriteria}) => {
    test.describe('Edit and Delete users functionality', async () => {
        let apiRequest
        let randomUser
        const usersDB = [users.user1, users.user2, users.user3, users.user4]
        test.beforeEach('Land on Home Page, Create tested users', async ({page}) => {
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
            await page.goto(HOME_PAGE_URL);

            const usersLocator = page.locator('tbody > tr');
            const usersAmount = await usersLocator.count();

            //3.Select random user
            await expect(usersAmount).toBeGreaterThanOrEqual(1);

            const randomUserIndex = Math.floor(Math.random() * usersAmount);
            randomUser = await usersLocator.nth(randomUserIndex);
            // sleep(500)
        })

        test(`TC-editUserFun-${tcName}`, async ({page}) => {
            const editIcon = await randomUser.locator('td>i>a.bi-pen')
            await editIcon.click()
            await page.waitForLoadState('networkidle')

            let choicedUser = []
            let updatedUser = []

            const inputs = await page.locator('#form-edit input').all()
            for (const input of inputs) {
                choicedUser.push(await input.getAttribute('placeholder'))
            }

            await expect(await inputs[0].isDisabled()).toBe(true)
            await expect(await inputs[0].isEditable()).toBe(false)

            const firstNameField = await page.getByLabel('First Name')
            const lastNameField = await page.getByLabel('Last Name')
            const ageField = await page.getByLabel('Age')
            const editButton = await page.getByRole('button', {name: 'Edit'})

            await firstNameField.fill(editCriteria[0])
            await lastNameField.fill(editCriteria[1])
            await ageField.fill(editCriteria[2])
            await editButton.click()
            await page.waitForLoadState('networkidle')

            updatedUser.push(await randomUser.locator('td').nth(3).innerText())

            await expect(updatedUser[0]).toEqual(choicedUser[0])

            for(let i = 0; i <=2; i++) {
                updatedUser.push(await randomUser.locator('td').nth(i).innerText())
                if(editCriteria[i]) {

                    await expect(updatedUser[i + 1]).toEqual(editCriteria[i])
                } else {

                    await expect(updatedUser[i + 1]).toEqual(choicedUser[i + 1])
                }
            }
            // console.log('CHOICED_USER', choicedUser)
            // console.log('UPDATED_USER = ', updatedUser)
        })

        test(`TC-deleteUserFun-${tcName}`, async ({page}) => {
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
})