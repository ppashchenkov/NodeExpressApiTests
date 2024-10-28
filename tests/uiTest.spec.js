import {test, expect} from '@playwright/test'
import * as TEST_DATA from '../testData/testData.js'
import * as API_UTILS from '../utils/apiUtils'

test('Get Title', async ({page}) => {
    await page.goto('http://localhost:5000')

    const headerLocator = page.getByRole('heading', { name: 'Node Express API Server App' })
    const headerCssLocator = page.locator('#appName')
    
    await expect(page).toHaveTitle('Users app')
    await expect(page).toHaveURL('http://localhost:5000/')
    await expect(headerLocator).toBeVisible()
    await expect(headerCssLocator).toHaveText('Node Express API Server App')
})

test('Get Title Promise.all', async ({page}) => {
    await page.goto('http://localhost:5000')

    const headerLocator = page.getByRole('heading', { name: 'Node Express API Server App' })
    const headerCssLocator = page.locator('#appName')

    await Promise.all([
        expect(page).toHaveTitle('Users app'),
        expect(page).toHaveURL('http://localhost:5000/'),
        expect(headerLocator).toBeVisible(),
        expect(headerCssLocator).toHaveText('Node Express API Server App'),
    ])
})

test('Get Title Promise.allSettled', async ({page}) => {
    await page.goto('http://localhost:5000')

    const headerLocator = page.getByRole('heading', { name: 'Node Express API Server App' })
    const headerCssLocator = page.locator('#appName')

    const results = await Promise.allSettled([
        expect(page).toHaveTitle('Users app'),
        expect(page).toHaveURL('http://localhost:5000/'),
        expect(headerLocator).toBeVisible(),
        expect(headerCssLocator).toHaveText('Node Express API Server App'),
    ])
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(0)
})

test('Add user form, UI test', async ({page}) => {
    await page.goto('http://localhost:5000')

    const title = page.getByRole('heading'
        , {name: 'Node Express API Server App'})
    const topMenuAdd = page.getByText('Add').first()
    const topMenuSearch = page.getByText('Search')
    const topMenuEdit = page.getByText('Edit')
    const topMenuDelete = page.getByText('Delete')
    const formTitleAddUser = page.getByText('Add User')
    const firstNameTitle = page.getByLabel('First Name')
    const lastNameTitle = page.getByLabel('Last Name')
    const ageTitle = page.getByLabel('Age')
    const firstNameInputFiled = page.getByTestId('firstname')
    const lastNameInputFiled = page.getByTestId('lastname')
    const ageInputFiled = page.getByTestId('age')
    const addButton = page.getByRole('button',
        {name: "Add"})
    const usersListTitle = page.getByText('Users List')

    await expect(title).toBeVisible()
    await expect(topMenuAdd).toBeVisible()
    await expect(topMenuSearch).toBeVisible()
    await expect(topMenuEdit).toBeVisible()
    await expect(topMenuDelete).toBeVisible()
    await expect(formTitleAddUser).toBeVisible()
    await expect(firstNameTitle).toBeVisible()
    await expect(lastNameTitle).toBeVisible()
    await expect(ageTitle).toBeVisible()
    await expect(firstNameInputFiled).toBeEmpty()
    await expect(lastNameInputFiled).toBeEmpty()
    await expect(ageInputFiled).toBeEmpty()
    await expect(addButton).toBeVisible()
    await expect(usersListTitle).toBeVisible()
})

test('Add user positive test', async ({page}) => {
    await page.goto('http://localhost:5000')

    await page.getByLabel('First Name')
        .fill(TEST_DATA.userFirst.firstName)
    await page.getByLabel('Last Name')
        .fill(TEST_DATA.userFirst.lastName)
    await page.getByTestId('age')
        .fill(TEST_DATA.userFirst.age)
    await page.getByRole('button',
        {name: "Add"})
        .click()

    const usersList = await page.getByTestId('usersList')
        .locator('tr')
    const actualUserFirstName = await usersList.last()
        .locator('td').first()
    const actualUserLastName = await usersList.last()
        .locator('td').nth(1)
    const actualUserAge = await usersList.last()
        .locator('td').nth(2)
    const actualUserId = await usersList.last()
        .locator('td').nth(3).textContent()

    await expect(actualUserFirstName).toHaveText(TEST_DATA.userFirst.firstName)
    await expect(actualUserLastName).toHaveText(TEST_DATA.userFirst.lastName)
    await expect(actualUserAge).toHaveText(TEST_DATA.userFirst.age)

    // Подчищаем за собой:
    const apiRequest = await API_UTILS.createNewContext()
    await API_UTILS.deleteUser(apiRequest, actualUserId)
    await apiRequest.dispose()
})
