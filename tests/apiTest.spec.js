import {test, expect} from '@playwright/test'
import * as TEST_DATA from '../testData/testData.js'
import * as API_UTILS from '../utils/apiUtils'

let apiRequest

test.beforeEach(async() => {
    apiRequest = await API_UTILS.createNewContext()
})

test.afterEach(async() => {
    await apiRequest.dispose()
})

test('GET /', async() => {
    const response = await  apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.ROOT_END_POINT)

    const statusCode = API_UTILS.getResponseStatus(response)
    const contentType = API_UTILS.getContentTypeHeaderValue(response)
    const responseText = await API_UTILS.getResponseBodyText(response)

    //Assert response
    expect(response).toBeOK()
    expect(statusCode).toBe(200)
    expect(contentType).toEqual(TEST_DATA.CONTENT_TYPE_TEXT)
    expect(responseText).toEqual(TEST_DATA.RESPONSE_API_SERVER)
})

test('GET list of the users', async() => {
    const response = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT)

    const statusCode = API_UTILS.getResponseStatus(response)

    expect(statusCode).toBe(200)
    expect(response.ok()).toBeTruthy();
})

test('Create users', async () => {
    // const apiRequest = await request.newContext()
    let userId = ''

    const response = await apiRequest.post(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT,{
        data: TEST_DATA.userFirst
    })

    userId = await response.json().then((entries) => entries[0].UserID)
    const lengthUserId = API_UTILS.getLengthUserId(userId)
    const statusCode = API_UTILS.getResponseStatus(response)
    const contentType = API_UTILS.getContentTypeHeaderValue(response)

    expect(response.ok()).toBeTruthy();
    expect(statusCode).toBe(TEST_DATA.expectedStatusCodes._200)
    expect(contentType).toEqual(TEST_DATA.CONTENT_TYPE_JSON)
    expect(lengthUserId).toBe(TEST_DATA.expected.idLength)

    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('GET user by id', async() => {
    // const apiRequest = await request.newContext()
    let userId = ''

    // Создаём нового пользователя:
    userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)

    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.expected.idLength)

    // Делаем запрос пользователя по id:
    const response = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)

    const currentFirstName = await response.json().then((entrie) => entrie.firstName)

    expect(response.ok()).toBeTruthy();
    expect(currentFirstName).toEqual(TEST_DATA.userFirst.firstName)

    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('PATCH user', async()  => {
    // const apiRequest = await request.newContext()
    let userId = ''
    // Создаём нового пользователя:
    userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)

    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.expected.idLength)

    // Редактируем данные пользователя:
    const response = await apiRequest.patch(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId,{
        data: TEST_DATA.userSecond
    })

    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toEqual("User was updated successfully.")

    // Запрос отредактированного пользователя:
    const edited = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)

    const currentFirstName = await edited.json().then((entrie) => entrie.firstName)

    expect(currentFirstName).toEqual(TEST_DATA.userSecond.firstName)

    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('Delete users', async() => {
    // const apiRequest = await request.newContext()
    let userId = ''
    // Создаём нового пользователя:
    userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)

    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.expected.idLength)

    // Запрос на удаление созданного пользователя:
    const response = await apiRequest.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)

    expect(await response.text()).toEqual("User was deleted successfully.")
    expect(response.ok()).toBeTruthy();

    // Проверяем что пользователь удален:
    const isExist = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)

    expect(await isExist.text()).toEqual("User not found.")
})