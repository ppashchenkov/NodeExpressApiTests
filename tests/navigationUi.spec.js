import {test, expect}  from "@playwright/test"

[
    {tabName: 'Add', expected: 'nav-link active'},
    {tabName: 'Search', expected: 'nav-link'},
    {tabName: 'Edit', expected: 'nav-link'},
    {tabName: 'Delete', expected: 'nav-link'},
].forEach(({tabName, expected}) => {
    test.describe('Navigation tab are available', async () => {

        test.beforeEach('navigate to home page', async({ page }) => {
            await page.goto('http://localhost:5000')
            test.setTimeout(5000)
        })

        test( `${tabName} tab should be available`, async ({ page}) => {
            const tab = await page.getByRole('link',
                {name: `${tabName}`, exact: true})
            const tabClassAttribute = await tab.getAttribute('class')

            await expect(tab).toBeAttached()
            await expect(tab).toHaveCount(1)
            await expect(tab).toBeVisible()
            await expect(tab).toBeEnabled()
            await expect(tabClassAttribute).toStrictEqual(`${expected}`)
        })
    })
})


