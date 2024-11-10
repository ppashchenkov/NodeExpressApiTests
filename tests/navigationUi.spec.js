import {test, expect}  from "@playwright/test"

[
    {tabName: 'Add', classAttributeName: 'nav-link active'},
    {tabName: 'Search', classAttributeName: 'nav-link'},
    {tabName: 'Edit', classAttributeName: 'nav-link'},
    {tabName: 'Delete', classAttributeName: 'nav-link'},
].forEach(({tabName, classAttributeName}) => {
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
            await expect(tabClassAttribute).toStrictEqual(`${classAttributeName}`)
        })
    })
})


