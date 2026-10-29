import axios from "axios"
import { expect, test } from "bun:test"

const BACKEND_URL = `http://localhost:3001/api`

test("create markte", async () => {
    const email = `market-creator-${Date.now()}-@mail.com`
    const password = "MarketCreator@123"

    const { status: createUserStaus } = await axios.post(`${BACKEND_URL}/auth/signup`, {
        name: "Market Cretor",
        email,
        password
    })

    const { status: signedUserStatus, data: signedUserData } = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email,
        password
    })

    const headers = {
        Authorization: `Bearer ${signedUserData.token}`
    }

    const { status: addBalanceStatus, data: addBalanceData } = await axios.post(`${BACKEND_URL}/user/add-balance`, {
        amount: 100
    }, { headers })


    const { status: createMarketStatus, data: marketData } = await axios.post(`${BACKEND_URL}/market/create`, {
        title: "Test Market",
        desc: "Tets market this is just a test",
        expireAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        initialSeedAmount: 10,
    }, { headers })


    expect(createUserStaus).toBe(201)
    expect(signedUserStatus).toBe(200)
    expect(addBalanceStatus).toBe(200)
    expect(createMarketStatus).toBe(201)

    expect(addBalanceData.balance).toBe(100)
    expect(marketData.market.initialSeedAmount).toBe(10)
    expect(marketData.market.pool.yes).toBe(5)
})
