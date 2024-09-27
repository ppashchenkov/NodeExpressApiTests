import {test, request, expect} from '@playwright/test'

const BASE_URL = 'http://localhost:5000'

const userFirst = {
    "firstName": "Joe",
    "lastName": "Buffalo",
    "age": 43,
}
const userSecond = {
    "firstName": "Sergey",
    "lastName": "Ivanov",
    "age": 25
}

test('GET /', async() => {
    const apiRequest = await request.newContext()

    const response = await  apiRequest.get(`${BASE_URL}/`)

    const statusCode = response.status()
    const headersArray = response.headersArray()
    const contentType = headersArray
        .find((header) => header.name === 'Content-Type')
        .value

    console.log(response)
    console.log("------------------------")
    console.log(await response.text())
    console.log(statusCode)
    console.log(headersArray)
    console.log("contentType = " + contentType)

    //Assert response
    expect(await response.text()).toEqual("Node Express API Server")
    expect(statusCode).toBe(200)
    expect(response).toBeOK()
})

test('GET list of the users', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users`)

    expect(response.ok()).toBeTruthy();
})

test('Create users', async () => {
    const apiRequest = await request.newContext()
    let userId = ''

    const response = await apiRequest.post(`${BASE_URL}/users`,{
        data: userFirst
    })

    userId = await response.json().then((entries) => entries[0].UserID)

    expect(response.ok()).toBeTruthy();

    // Подчищаем за собой:
    await apiRequest.delete(`${BASE_URL}/users/${userId}`)
})

test('GET user by id', async() => {
    const apiRequest = await request.newContext()
    let userId = ''
    let currentFirstName = ''
    // Создаём нового пользователя:
    const created = await apiRequest.post(`${BASE_URL}/users`,{
        data: userFirst
    })

    userId = await created.json().then((entries) => entries[0].UserID)

    expect(userId.length > 0)

    // Делаем запрос пользователя по id:
    const response = await apiRequest.get(`${BASE_URL}/users/${userId}`)

    currentFirstName = await response.json().then((entrie) => entrie.firstName)

    expect(response.ok()).toBeTruthy();
    expect(currentFirstName).toEqual(userFirst.firstName)

    // Подчищаем за собой:
    await apiRequest.delete(`${BASE_URL}/users/${userId}`)
})

test('PATCH user', async()  => {
    const apiRequest = await request.newContext()
    let userId = ''
    let currentFirstName = ''
    // Создаём нового пользователя:
    const created = await apiRequest.post(`${BASE_URL}/users`,{
        data: userFirst
    })

    userId = await created.json().then((entries) => entries[0].UserID)

    expect(userId.length > 0)

    // Редактируем данные пользователя:
    const response = await apiRequest.patch(`${BASE_URL}/users/${userId}`,{
        data: userSecond
    })

    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toEqual("User was updated successfully.")

    // Запрос отредактированного пользователя:
    const edited = await apiRequest.get(`${BASE_URL}/users/${userId}`)

    currentFirstName = await edited.json().then((entrie) => entrie.firstName)

    expect(currentFirstName).toEqual(userSecond.firstName)

    // Подчищаем за собой:
    await apiRequest.delete(`${BASE_URL}/users/${userId}`)
})

test('Delete users', async() => {
    const apiRequest = await request.newContext()
    let userId = ''
    // Создаём нового пользователя:
    const created = await apiRequest.post(`${BASE_URL}/users`,{
        data: userFirst
    })

    userId = await created.json().then((entries) => entries[0].UserID)

    expect(userId.length > 0)

    // Запрос на удаление созданного пользователя:
    const response = await apiRequest.delete(`${BASE_URL}/users/${userId}`)

    expect(await response.text()).toEqual("User was deleted successfully.")
    expect(response.ok()).toBeTruthy();

    // Проверяем что пользователь удален:
    const isexist = await apiRequest.get(`${BASE_URL}/users/${userId}`)

    expect(await isexist.text()).toEqual("User not found.")
})