import {test, request, expect} from '@playwright/test'

const BASE_URL = 'http://localhost:5000'

let user = {
    "firstName": "Joe",
    "lastName": "Buffalo",
    "age": 43,
}
let userId = '5f7abd01-4047-4b0a-8b79-d82037dd02c9'

// test('Delete users', async() => {
//     const apiRequest = await request.newContext()
//
//     const response = await apiRequest.delete(`${BASE_URL}/users/${userId}`)
//
//     await expect(response.status()).toBe(200)
// })

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
        data: user
    })

    await expect(response.status()).toBe(200)
    await expect(await response.text()).toEqual("User created successfully.")
})

test('Get users id', async() => {
    const apiRequest = await request.newContext()

    const response = await apiRequest.get(`${BASE_URL}/users`)

    // console.log("userId = " + response.json().id)

    const headersArray = response.headersArray()
    const contentType = headersArray
        .find((header) => header.name === 'Content-Type')
        .value

    console.log("contentType = " + contentType)

    // const createdUser = await response.body()
    userId = await response.body()
    console.log("id = " + userId[0])

})
