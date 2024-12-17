import {test, expect}  from "@playwright/test"

const HOME_PAGE_URL = 'http://localhost:5000/';
[
    {tabName: 'Add', header: 'Add User', buttonName: 'Add', count: 3, expected: [ "First Name", "Last Name", "Age" ], expectedClass: 'nav-link active', expectedURL: HOME_PAGE_URL + 'add', expectedTitle: 'Users app'},
    {tabName: 'Search', header: 'Search user', buttonName: 'Search', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedClass: 'nav-link active', expectedURL: HOME_PAGE_URL + 'search', expectedTitle: 'Search user'},
    {tabName: 'Edit', header: 'Edit user', buttonName: 'Edit', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedClass: 'nav-link active', expectedURL: HOME_PAGE_URL + 'edit', expectedTitle: 'Edit user'},
    {tabName: 'Delete', header: 'Delete user', buttonName: 'Delete', count: 4, expected: [ 'User ID', 'First Name', 'Last Name', 'Age' ], expectedClass: 'nav-link active', expectedURL: HOME_PAGE_URL + 'delete', expectedTitle: 'Delete user'},
].forEach(({tabName, header, buttonName, count, expected, expectedClass, expectedURL, expectedTitle}) => {
    test.describe('Navigation tabs functionality', async () => {

        test.beforeEach('navigate to home page', async({ page }) => {
            await page.goto('http://localhost:5000')
            test.setTimeout(15000)
        })

        test( `Test Case 2: Verify ${tabName} tab functionality and Test Case 3: Verify Active Tab Highlight`
            , async ({ page}) => {

            const tab = await page.getByRole('link',
                {name: `${tabName}`, exact: true})
            await tab.click()
            const tabClassAttribute = await tab.getAttribute('class')
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
            await expect(tabClassAttribute).toStrictEqual(`${expectedClass}`)
        })

        test(`Test Case 4: Verify ${expectedURL} URL change to ${tabName}`, async ({ page}) => {
            const tab = await page.getByRole('link',
                {name: `${tabName}`, exact: true})
            await tab.click()
            const actualUrl = page.url()
            const actualTitle = await page.title()

            await expect(actualUrl).toEqual(expectedURL)
            await expect(actualTitle).toEqual(expectedTitle)
        })

        test(`Test Case 5: Verify ${tabName} Tab Persistence on Page Refresh`, async ({ page }) => {
            const tab = await page.getByRole('link',
                {name: `${tabName}`, exact: true})
            await tab.click()
            await page.reload({timeout: 500})
            const tabClassAttribute = await tab.getAttribute('class')

            await expect(tabClassAttribute).toStrictEqual(`${expectedClass}`)
        })
    })
})