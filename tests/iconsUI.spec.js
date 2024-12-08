import {test, expect, request}  from "@playwright/test"
import  { users } from "../testData/usersTestData"
import { data } from "../testData/searchFuncTestData"
import { HOME_PAGE_URL } from "../testData/baseTestData"
import {sleep} from "../utils/uiUtils";
import {deleteAllUsers} from "../utils/apiUtils";

test.describe('Icons created when users created', async() => {
    let apiRequest
    test.beforeEach('Clear DB, open Home_URL', async({ page }) => {
        apiRequest = await request.newContext()
        await deleteAllUsers(apiRequest)
        await page.goto(HOME_PAGE_URL)
    })

    test('TC-IconsUI-1', async({ page }) => {
        const firstNameField = await page.getByPlaceholder('Enter first name')
        const lastNameField = await page.getByPlaceholder('Enter last name')
        const ageField = await page.getByPlaceholder('Enter age ( 1 - 150 )')
        const addButton = await page.getByRole('button', {name: 'Add'})
        const tableRow = await page.getByRole('row')

        await expect(tableRow).toHaveCount(1)

        await firstNameField.fill(users.user1.firstName)
        await lastNameField.fill(users.user1.lastName)
        await ageField.fill(users.user1.age)
        await addButton.click()

        const userRow = await page.locator('table>tbody>tr')
            // .getByRole('row')
        const userCells = await userRow.getByRole('cell')
        const editIconInUserRow = await userRow
            .getByRole('cell').nth(4)
            .locator('i>a>svg.bi-pen')
        const deleteIconInUserRow = await userRow
            .getByRole('cell').nth(5)
            .locator('i>a>svg.bi-trash')

        await expect(userRow).toHaveCount(1)
        await expect(userCells).toHaveCount(6)
        await expect(editIconInUserRow).toBeVisible()
        await expect(editIconInUserRow).toHaveCount(1)
        await expect(deleteIconInUserRow).toBeVisible()
        await expect(deleteIconInUserRow).toHaveCount(1)
        await expect(editIconInUserRow).toHaveCSS("color", "rgb(0, 0, 0)")
        await expect(deleteIconInUserRow).toHaveCSS("color", "rgb(0, 0, 0)")

        await editIconInUserRow.hover({force: true}).then(() => {
            expect(editIconInUserRow).toHaveCSS("color", "rgb(0, 128, 0)")
        })
        await deleteIconInUserRow.hover({force: true}).then(() => {
            expect(deleteIconInUserRow).toHaveCSS("color", "rgb(255, 0, 0)")
        })
    })

    test.afterEach('Dispose request', async({ page }) => {
        await apiRequest.dispose()
    })
})