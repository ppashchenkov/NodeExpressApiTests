import { users } from "./usersTestData.js"
export const data = {
    _1: {
        tcName: "Unique First Name",
        searchCriteria: ['', users.user1.firstName, '', ''],
        expectedCount: 1,
        expectedUsers: [users.user1]
    },
    _2: {
        tcName: "Unique Last Name",
        searchCriteria: ['', '', users.user4.lastName, ''],
        expectedCount: 1,
        expectedUsers: [users.user4]
    },
    _3: {
        tcName: "Unique Age",
        searchCriteria: ['', '', '', users.user3.age],
        expectedCount: 1,
        expectedUsers: [users.user3]
    },
    _4: {
        tcName: "Non-Unique First Name",
        searchCriteria: ['', users.user2.firstName, '', ''],
        expectedCount: 2,
        expectedUsers: [users.user2, users.user4]
    },
    _5: {
        tcName: "Non-Unique Last Name",
        searchCriteria: ['', '', users.user3.lastName, ''],
        expectedCount: 3,
        expectedUsers: [users.user1, users.user2, users.user3]
    },
    _6: {
        tcName: "Non-Unique Age",
        searchCriteria: ['', '', '', users.user1.age],
        expectedCount: 2,
        expectedUsers: [users.user1, users.user4]
    }
}