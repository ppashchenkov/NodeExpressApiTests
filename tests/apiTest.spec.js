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
let userId = ''

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
    await expect(await response.text()).toEqual("Node Express API Server")
    await expect(statusCode).toBe(200)
    await expect(response).toBeOK()
})

test('GET list of the users', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users`)

    await expect(response.status()).toBe(200)
    await expect(await response.text()).toEqual("There are no users.")
})

test('Create users', async () => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.post(`${BASE_URL}/users`,{
        data: userFirst
    })

    await expect(response.status()).toBe(200)
    await expect(await response.text()).toEqual("User created successfully.")
})

test('Get users id', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users`)

    const responseJson = await response.json()
    const currentFirstName = await responseJson[0].firstName
    userId = await responseJson[0].id
    // console.log("id = " + userId)

    await expect(response.status()).toBe(200)
    await expect(currentFirstName).toEqual(userFirst.firstName)
})

// test('PATCH user', async()  => {
//     const apiRequest = await request.newContext()
//
//     const response = await apiRequest.patch(`${BASE_URL}/users/${userId}`,{
//         data: userSecond
//     })
//
//     const receivedText = await response.text()
//     console.log(receivedText)
//
//     await expect(response.status()).toBe(200)
//     await expect(await response.text()).toEqual("User was updated successfully.")
// })

test('GET user by id', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users/${userId}`)

    const responseJson = await response.json()
    const currentFirstName = await responseJson[0].firstName
    // const currentUserId = await responseJson[0].id
    // console.log("firstName = " + currentFirstName)
    // console.log("id = " + currentUserId)

    await expect(response.status()).toBe(200)
    await expect(currentFirstName).toEqual(userFirst.firstName)
    // await expect(currentUserId).toEqual(userId)
})

test('Delete users', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.delete(`${BASE_URL}/users/${userId}`)

    await expect(response.status()).toBe(200)
    await expect(await response.text()).toEqual("User was deleted successfully.")
})