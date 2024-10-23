import {test, expect} from '@playwright/test'

test('Get Title', async ({page}) => {
    const p = await page.goto('http://localhost:5000')

    const headerLocator = page.getByRole('heading', { name: 'Node Express API Server App' })
    const headerCssLocator = page.locator('#appName')
    
    await expect(page).toHaveTitle('Users app')
    await expect(page).toHaveURL('http://localhost:5000/')
    await expect(headerLocator).toBeVisible()
    await expect(headerCssLocator).toHaveText('Node Express API Server App')
})

test('Get Title Promise.all', async ({page}) => {
    const p = await page.goto('http://localhost:5000')

    const headerLocator = page.getByRole('heading', { name: 'Node Express API Server App' })
    const headerCssLocator = page.locator('#appName')

    await Promise.all([
        expect(page).toHaveTitle('Users app'),
        expect(page).toHaveURL('http://localhost:5000/'),
        expect(headerLocator).toBeVisible(),
        expect(headerCssLocator).toHaveText('Node Express API Server App'),
    ])
})
