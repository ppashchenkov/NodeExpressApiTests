import {test, expect}  from "@playwright/test"

const HOME_PAGE_URL = 'http://localhost:5000/';
[
    {tabName: 'Add', header: 'Add User', buttonName: 'Add', count: 3, expected: [ "First Name", "Last Name", "Age" ], expectedURL: HOME_PAGE_URL + ''},
    {tabName: 'Search', header: 'Search user', buttonName: 'Search', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedURL: HOME_PAGE_URL + 'search.html'},
    {tabName: 'Edit', header: 'Edit user', buttonName: 'Edit', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedURL: HOME_PAGE_URL + 'edit'},
    {tabName: 'Delete', header: 'Delete user', buttonName: 'Delete', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedURL: HOME_PAGE_URL + 'delete'},
].forEach(({tabName, header, buttonName, count, expected, expectedURL}) => {
    test.describe('Navigation tabs functionality', async () => {

        test.beforeEach('navigate to home page', async({ page }) => {
            await page.goto('http://localhost:5000')
            test.setTimeout(5000)
        })

        test( `${tabName} tab functionality`, async ({ page}) => {
            const tab = await page.getByRole('link',
                {name: `${tabName}`, exact: true})
            await tab.click()
            const h2Header = await page.getByRole('heading',
                {name: `${header}`, exact: true})
            const button = await page.getByRole('button',
                {name: `${buttonName}`, exact: true})
            const formFields = await page.locator('.form-group')
            const labelsTexts = await formFields.locator('label')
                .allInnerTexts()

            await expect(h2Header).toBeVisible()
            await expect(button).toBeVisible()
            await expect(button).toBeEnabled({enabled: false})
            await expect(formFields).toHaveCount(count)
            await expect(labelsTexts).toEqual(expected)
        })

        test(`Verify ${expectedURL} URL change to ${tabName}`, async ({ page}) => {
            const tab = await page.getByRole('link',
                {name: `${tabName}`, exact: true})
            await tab.click()
            const actualUrl = await page.url()
            // const actualTitle = page.title()

            await expect(actualUrl).toEqual(expectedURL)
        })
    })
})


