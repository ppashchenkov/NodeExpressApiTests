import {test, expect, request}  from "@playwright/test"
import  { users } from "../testData/usersTestData"
import { HOME_PAGE_URL } from "../testData/baseTestData"
import {deleteAllUsers} from "../utils/apiUtils";

test.describe('End to End Test', async () => {
    let apiRequest
    // const usersDB = [users.user1, users.user2, users.user3, users.user4]
    test.beforeEach('Land on Home Page', async ({page}) => {
        apiRequest = await request.newContext()
        await deleteAllUsers(apiRequest)
        await page.goto(HOME_PAGE_URL)
    })

    test(`end2EndTest`, async ({page}) => {
        const h1Header = await page.getByRole("heading", {level: 1})
        const h2Header = await page.getByRole("heading", {level: 2})

        await expect(h1Header).toHaveText("Node Express API Server App")
        await expect(h2Header.first()).toHaveText("Add User")

        let firstNameField = await page.getByPlaceholder('Enter first name')
        let lastNameField = await page.getByPlaceholder('Enter last name')
        let ageField = await page.getByPlaceholder('Enter age ( 1 - 150 )')
        const addButton = await page.getByRole('button', {name: 'Add'})

        await firstNameField.fill(users.user1.firstName)
        await lastNameField.fill(users.user1.lastName)
        await ageField.fill(users.user1.age)
        await addButton.click()
        await page.waitForLoadState('networkidle')

        const addedUserLocators = await page.locator('tbody>tr>td').all()
        const actualUserFirstname = await addedUserLocators[0].innerText()
        const actualUserLastname = await addedUserLocators[1].innerText()
        const actualUserAge = await addedUserLocators[2].innerText()
        const actualUserId = await addedUserLocators[3].innerText()

        await expect(actualUserFirstname).toEqual(users.user1.firstName)
        await expect(actualUserLastname).toEqual(users.user1.lastName)
        await expect(actualUserAge).toEqual(users.user1.age)
        await expect(actualUserId.length).toEqual(36)

        const usersLocator = page.locator('tbody > tr')
        const editIcon = await usersLocator.locator('td>i>a.bi-pen')
        await editIcon.click()
        await page.waitForLoadState('networkidle')
        let inputs = await page.locator('#form-edit input').all()

        await expect(h2Header.first()).toHaveText("Edit user")
        await expect(await inputs[0].isDisabled()).toBe(true)
        await expect(await inputs[0].isEditable()).toBe(false)

        firstNameField = await page.getByLabel('First Name')
        lastNameField = await page.getByLabel('Last Name')
        ageField = await page.getByLabel('Age')
        const editButton = await page.getByRole('button', {name: 'Edit'})

        await firstNameField.fill(users.user2.firstName)
        await lastNameField.fill(users.user2.lastName)
        await ageField.fill(users.user2.age)
        await editButton.click()
        await page.waitForLoadState('networkidle')

        const editedUserLocators = await page.locator('tbody>tr>td').all()
        const actualEditedUserFirstname = await editedUserLocators[0].innerText()
        const actualEditedUserLastname = await editedUserLocators[1].innerText()
        const actualEditedUserAge = await editedUserLocators[2].innerText()
        const actualEditedUserId = await editedUserLocators[3].innerText()

        await expect(actualEditedUserFirstname).toEqual(users.user2.firstName)
        await expect(actualEditedUserLastname).toEqual(users.user2.lastName)
        await expect(actualEditedUserAge).toEqual(users.user2.age)
        await expect(actualEditedUserId.length).toEqual(actualUserId.length)

        const deleteIcon = await usersLocator.locator('td>i>a.bi-trash')
        await deleteIcon.click()
        await page.waitForLoadState('networkidle')
        inputs = await page.locator('#form-delete input').all()

        await expect(h2Header.first()).toHaveText("Delete user")
        for(let i = 0; i < inputs.length; i++){
            await expect(await inputs[i].isDisabled()).toBe(true)
            await expect(await inputs[i].isEditable()).toBe(false)
        }

        const deleteButton = await page.getByRole('button', {name: 'Delete'})
        await deleteButton.click()
        await page.waitForLoadState('networkidle')
        const actualListUsers = await page.locator('tbody>tr').all()
        const actualCountUsers = actualListUsers.length

        await expect(actualCountUsers).toEqual(0)
    })

    test.afterEach('Close API request context', async ({page}) => {
        await apiRequest.dispose()
    })
})