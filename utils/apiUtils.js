import {request} from "@playwright/test";
import * as TEST_DATA from "../testData/testData";
import {users} from "../testData/usersTestData";
import {BASE_URL, USERS_END_POINT} from "../testData/testData";
import {sleep} from "./uiUtils";

export async function createNewContext() {
    return await request.newContext()
}

export async function createUser(request, user) {
    const created = await request.post(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT,{
        data: user
    })
    return await getUserId(created, 'id')
    // return await created.json().then((entries) => entries[0].id)
}

export async function deleteUser(request, userId) {
    await request.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)
}

export async function deleteAllUsers(request) {
    await request.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT)
    await sleep(500)
}

export function getResponseStatus(response) {
    return response.status()
}

const headersArray = (response) => {
    return response
        .headersArray();
}

export function getContentTypeHeaderValue(response) {
    return headersArray(response)
        .find((header) => header.name === 'Content-Type')
        .value;
}

export async function getResponseBodyText(response) {
    return await response.text();
}

export async function getResponseBodyJson(response) {
    return await response.json();
}

export function isResponseIsArray(response) {
    return Array.isArray(getResponseBodyJson(response))
}

export function getLengthUserId(userId) {
    return userId.length
}

export async function getUserId(response, k) {
    return await response.json().then((entries) => entries[0][k])
}

export async function getJsonValueByKey(response, k) {
    return await response.json().then((entries) => entries[k])
}

export async function createUsers(request) {
    for (const [key, value] of Object.entries(users)) {
        await request.post(
            `${BASE_URL}${USERS_END_POINT}`,
            {data: value}
        )
    }
}
