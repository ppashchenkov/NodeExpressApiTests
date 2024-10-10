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

    await expect(response).toBeOK()
    expect(statusCode).toBe(TEST_DATA.EXPECTED_STATUS_CODES._200)
    expect(contentType).toEqual(TEST_DATA.CONTENT_TYPE_TEXT)
    expect(responseText).toEqual(TEST_DATA.RESPONSE_API_SERVER)
})

test('GET list if no users', async() => {
    const response = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT)
    const statusCode = API_UTILS.getResponseStatus(response)

    expect(statusCode).toBe(TEST_DATA.EXPECTED_STATUS_CODES._200)
    expect(response.ok()).toBeTruthy();

    const contentType = API_UTILS.getContentTypeHeaderValue(response)

    if (contentType === TEST_DATA.CONTENT_TYPE_TEXT) {
        const responseText = await API_UTILS.getResponseBodyText(response)
        console.log("================================================")
        console.log("=================NO USERS FOUND=================")
        console.log("================================================")

        expect(responseText).toEqual(TEST_DATA.RESPONSE_API_SERVER_NO_USERS)
    }
})

test('Create users', async () => {
    const response = await apiRequest.post(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT,{
        data: TEST_DATA.userFirst
    })
    const userId = await API_UTILS.getUserId(response, 'id')
    const lengthUserId = API_UTILS.getLengthUserId(userId)
    const statusCode = API_UTILS.getResponseStatus(response)
    const contentType = API_UTILS.getContentTypeHeaderValue(response)

    expect(response.ok()).toBeTruthy();
    expect(statusCode).toBe(TEST_DATA.EXPECTED_STATUS_CODES._200)
    expect(contentType).toEqual(TEST_DATA.CONTENT_TYPE_JSON)
    expect(lengthUserId).toBe(TEST_DATA.EXPECTED.idLength)
    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('GET list of the existing users', async() => {
    // Создаём нового пользователя:
    const userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)
    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.EXPECTED.idLength)

    const response = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT)
    const statusCode = API_UTILS.getResponseStatus(response)

    expect(statusCode).toBe(TEST_DATA.EXPECTED_STATUS_CODES._200)
    expect(response.ok()).toBeTruthy();

    const contentType = API_UTILS.getContentTypeHeaderValue(response)
    const isArray = API_UTILS.isResponseIsArray(response)

    expect(contentType).toBe(TEST_DATA.CONTENT_TYPE_JSON)
    expect(isArray)
    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('GET user by id', async() => {
    // Создаём нового пользователя:
    const userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)
    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.EXPECTED.idLength)

    // Делаем запрос пользователя по id:
    const response = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)
    const currentFirstName = await API_UTILS.getJsonValueByKey(response, 'firstName')
    const currentLastName = await API_UTILS.getJsonValueByKey(response, 'lastName')
    const currentAge = await API_UTILS.getJsonValueByKey(response, 'age')
    const currentUserId = await API_UTILS.getJsonValueByKey(response, 'id')

    expect(response.ok()).toBeTruthy();
    expect(currentFirstName).toEqual(TEST_DATA.userFirst.firstName)
    expect(currentLastName).toEqual(TEST_DATA.userFirst.lastName)
    expect(currentAge).toEqual(TEST_DATA.userFirst.age)
    expect(currentUserId).toEqual(userId)
    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('PATCH user', async()  => {
    // Создаём нового пользователя:
    const userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)
    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.EXPECTED.idLength)

    // Редактируем данные пользователя:
    const response = await apiRequest.patch(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId,{
        data: TEST_DATA.userSecond
    })

    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toEqual(TEST_DATA.RESPONSE_API_SERVER_USER_UPDATED)

    // Запрос отредактированного пользователя:
    const edited = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)
    const currentFirstName = await API_UTILS.getJsonValueByKey(edited, 'firstName')
    const currentLastName = await API_UTILS.getJsonValueByKey(edited, 'lastName')
    const currentAge = await API_UTILS.getJsonValueByKey(edited, 'age')
    const currentUserId = await API_UTILS.getJsonValueByKey(edited, 'id')

    expect(currentFirstName).toEqual(TEST_DATA.userSecond.firstName)
    expect(currentLastName).toEqual(TEST_DATA.userSecond.lastName)
    expect(currentAge).toEqual(TEST_DATA.userSecond.age)
    expect(currentUserId).toEqual(userId)
    // Подчищаем за собой:
    await API_UTILS.deleteUser(apiRequest, userId)
})

test('Delete users', async() => {
    // Создаём нового пользователя:
    const userId = await API_UTILS.createUser(apiRequest, TEST_DATA.userFirst)
    const lengthUserId = API_UTILS.getLengthUserId(userId)

    expect(lengthUserId).toBe(TEST_DATA.EXPECTED.idLength)

    // Запрос на удаление созданного пользователя:
    const response = await apiRequest.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)

    expect(await response.text()).toEqual(TEST_DATA.RESPONSE_API_SERVER_DELETE)
    expect(response.ok()).toBeTruthy();

    // Проверяем что пользователь удален:
    const isExist = await apiRequest.get(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)

    expect(await isExist.text()).toEqual(TEST_DATA.RESPONSE_API_SERVER_USER_NOT_FOUND)
})