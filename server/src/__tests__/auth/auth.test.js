import axios from "axios"
import { expect, test } from "bun:test";

const BACKEND_URL = "http://localhost:3001/api"

test("valid signup", async () => {
    const email = `elon-${Date.now()}@tesla.com`

    const { status, data } = await axios.post(`${BACKEND_URL}/auth/signup`, {
        name: "Elon",
        email,
        password: "lets-Go@marks1234"
    })

    expect(status).toBe(201)
    expect(data.id).toBeDefined()
})

test("signup rejects an invalid email", async () => {
    const { status } = await axios.post(`${BACKEND_URL}/auth/signup`, {
        name: "Sam",
        email: "invalid-email",
        password: "password123"
    }, {
        validateStatus: () => true
    })

    expect(status).toBe(400);
});

test("existing user", async () => {
    const { status } = await axios.post(`${BACKEND_URL}/auth/signup`, {
        name: "Elon",
        email: "elonmusk@tesla.com",
        password: "lets-Go@marks1234"
    }, {
        validateStatus: () => true
    })

    expect(status).toBe(409)
})


// *********************
// *********************
// test for sign in ****


// valid email and password
test("check valid email and password when signin", async () => {
    const { status } = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email: "elonmusk@tesla.com",
        password: "lets-Go@marks1234"
    }, {
        validateStatus: () => true
    })

    expect(status).toBe(200)
})


// Wrong password
test("wrong password", async () => {
    const { status } = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email: "elonmusk@tesla.com",
        password: "dodge-coins-are-the-best"
    })

    expect(status).toBe(401)
})
