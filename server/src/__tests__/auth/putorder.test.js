import axios from "axios"
import { test, expect } from "bun:test"

const BACKEND_URL = "http://localhost:3001/api"

test("create an order with valid inputs", async () => {
    const email = `order-cretor-${Date.now()}@gmail.com`
    const password = "password1234"

    const { status: userCreationStausOnOrderPuts } = await axios.post(`${BACKEND_URL}/auth/signup`, {
        name: "Order Creation User",
        email,
        password
    })

    const { status: userLoginStatusOnOderPuts, data: loginData } = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email,
        password
    })

    const headers = {
        Authorization: `Bearer ${loginData.token}`
    }

    const { status: addBalanceStatus, data: updatedUserBalance } = await axios.post(`${BACKEND_URL}/user/add-balance`, {
        amount: 100
    }, { headers })
    // wip make a merket first then add the id here 
    const marketId = ""


    const { status: createPutStatus, data: createPutData } = await axios.post(`${BACKEND_URL}/user/put-order`, {
        market: marketId,
        prediction: "yes",
        amountSpent: 10
    }, { headers })

    expect(userCreationStausOnOrderPuts).toBe(201)
    expect(userLoginStatusOnOderPuts).toBe(200)
    expect(addBalanceStatus).toBe(200)
    expect(createPutStatus).toBe(201)

    expect(updatedUserBalance.balance).toBe(100)
    expect(createPutData.data.amountSpent).toBe(10)
})
