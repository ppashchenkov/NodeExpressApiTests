import {request} from "@playwright/test";
import * as TEST_DATA from "../testData/testData";

export async function createNewContext() {
    return await request.newContext()
}

export async function createUser(request, user) {
    const created = await request.post(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT,{
        data: user
    })
    return await created.json().then((entries) => entries[0].UserID)
}

export async function deleteUser(request, userId) {
    await request.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)
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

export function getLengthUserId(userId) {
    return userId.length
}
