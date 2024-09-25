import {test, request, expect} from '@playwright/test'

const BASE_URL = 'http://82.142.152.107:5000'

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
let userId = ''
let currentFirstName = ''

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

    // await expect(await response.text()).toEqual("There are no users.")
    expect(response.ok()).toBeTruthy();
})

test('Create users', async () => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.post(`${BASE_URL}/users`,{
        data: userFirst
    })

    expect(response.ok()).toBeTruthy();
})

test('Get users id', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users`)

    while (userId.length === 0) {
        userId = (await response.json())[0].id
    }

    expect(response.ok()).toBeTruthy()
})

test('PATCH user', async()  => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.patch(`${BASE_URL}/users/${userId}`,{
        data: userSecond
    })

    // const receivedText = await response.text()
    // console.log(receivedText)

    expect(response.ok()).toBeTruthy()
    // expect(await response.text()).toEqual("User was updated successfully.")
})

test('GET user by id', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users/${userId}`)

    while (currentFirstName.length === 0) {
        const responseJson = await response.json()
        currentFirstName = await responseJson[0].firstName
    }

    expect(response.ok()).toBeTruthy();
    expect(currentFirstName).toEqual(userSecond.firstName)
})

test('Delete users', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.delete(`${BASE_URL}/users/${userId}`)

    expect(await response.text()).toEqual("User was deleted successfully.")
    expect(response.ok()).toBeTruthy();
})