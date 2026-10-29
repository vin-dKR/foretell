import assert from "node:assert/strict";
import { test } from "node:test";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { createApp } from "../app.js";
import { signup, signin } from "../controller/auth.js";
import { createMarket } from "../controller/market/create-market.js";
import { resolveMarket } from "../controller/market/market-resolution.js";
import { addBalance } from "../controller/user/add-balance.js";
import { orderPut } from "../controller/user/order-put.js";
import { auth } from "../middleware/middleware.js";
import { Market, Put, User } from "../models/Models.js";
import { createPutSchema } from "../schema/ZodSchema.js";

function responseStub() {
    return {
        statusCode: 200,
        body: undefined,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

function restoreEnvironment(name, value) {
    if (value === undefined) {
        delete process.env[name];
    } else {
        process.env[name] = value;
    }
}

test("createPutSchema normalizes uppercase predictions", () => {
    const result = createPutSchema.safeParse({
        market: "507f1f77bcf86cd799439011",
        prediction: "YES",
        amountSpent: 25
    });

    assert.equal(result.success, true);
    assert.deepEqual(result.data, {
        market: "507f1f77bcf86cd799439011",
        prediction: "yes",
        amountSpent: 25
    });
});

test("auth rejects an invalid bearer token instead of leaving the request open", () => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret";
    const res = responseStub();
    let nextCalled = false;

    auth(
        { headers: { authorization: "Bearer malformed-token" } },
        res,
        () => {
            nextCalled = true;
        }
    );

    restoreEnvironment("JWT_SECRET", originalSecret);
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: "Invalid or expired token" });
});

test("signup validates input, creates the user, and returns its id", async () => {
    const originalFindOne = User.findOne;
    const originalCreate = User.create;
    const res = responseStub();
    let createdUser;

    User.findOne = async () => null;
    User.create = async (user) => {
        createdUser = user;
        return { _id: "507f1f77bcf86cd799439011" };
    };

    try {
        await signup(
            {
                body: {
                    name: "Sam",
                    email: "sam@example.com",
                    password: "password123"
                }
            },
            res
        );
    } finally {
        User.findOne = originalFindOne;
        User.create = originalCreate;
    }

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, { id: "507f1f77bcf86cd799439011" });
    assert.equal(createdUser.email, "sam@example.com");
    assert.equal(await bcrypt.compare("password123", createdUser.password), true);
});

test("signin verifies the password before issuing a token", async () => {
    const originalFindOne = User.findOne;
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "test-secret";
    const res = responseStub();
    const password = "password123";

    User.findOne = async () => ({
        _id: "507f1f77bcf86cd799439011",
        password: await bcrypt.hash(password, 4)
    });

    try {
        await signin({ body: { email: "sam@example.com", password } }, res);
    } finally {
        User.findOne = originalFindOne;
        restoreEnvironment("JWT_SECRET", originalSecret);
    }

    assert.equal(res.statusCode, 200);
    assert.equal(typeof res.body.token, "string");
});

test("addBalance credits the authenticated user", async () => {
    const originalFindByIdAndUpdate = User.findByIdAndUpdate;
    const res = responseStub();

    User.findByIdAndUpdate = async (id, update) => {
        assert.equal(id, "507f1f77bcf86cd799439011");
        assert.deepEqual(update, { $inc: { balance: 25 } });
        return { balance: 125 };
    };

    try {
        await addBalance(
            {
                userId: "507f1f77bcf86cd799439011",
                body: { amount: 25 }
            },
            res
        );
    } finally {
        User.findByIdAndUpdate = originalFindByIdAndUpdate;
    }

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.balance, 125);
});

test("createMarket stores expiresAt and deducts the seed within its transaction", async () => {
    const originalStartSession = mongoose.startSession;
    const originalFindOneAndUpdate = User.findOneAndUpdate;
    const originalCreate = Market.create;
    const res = responseStub();
    const calls = [];
    const session = {
        async withTransaction(work) {
            await work();
        },
        async endSession() {}
    };

    mongoose.startSession = async () => session;
    User.findOneAndUpdate = async (...args) => {
        calls.push(["user", args]);
        return { _id: "507f1f77bcf86cd799439011" };
    };
    Market.create = async ([market], options) => {
        calls.push(["market", [market, options]]);
        return [{ ...market, _id: "507f191e810c19729de860ea" }];
    };

    try {
        await createMarket(
            {
                userId: "507f1f77bcf86cd799439011",
                body: {
                    title: "Will it rain?",
                    desc: "A weather market",
                    expireAt: "2030-01-01T00:00:00.000Z",
                    initialSeedAmount: 50
                }
            },
            res
        );
    } finally {
        mongoose.startSession = originalStartSession;
        User.findOneAndUpdate = originalFindOneAndUpdate;
        Market.create = originalCreate;
    }

    assert.equal(res.statusCode, 201);
    assert.deepEqual(calls[0][1][1], { $inc: { balance: -50 } });
    assert.deepEqual(calls[1][1][0].pool, { yes: 25, no: 25 });
    assert.equal(calls[1][1][0].title, "Will it rain?");
    assert.equal(calls[1][1][0].initialSeedAmount, 50);
    assert.equal(calls[1][1][0].expiresAt instanceof Date, true);
    assert.equal(calls[1][1][0].expireAt, undefined);
});

test("orderPut atomically debits the wager and creates a position", async () => {
    const originalStartSession = mongoose.startSession;
    const originalFindOne = Market.findOne;
    const originalFindOneAndUpdate = Market.findOneAndUpdate;
    const originalUserUpdate = User.findOneAndUpdate;
    const originalPutCreate = Put.create;
    const res = responseStub();
    const calls = [];
    const session = {
        async withTransaction(work) {
            await work();
        },
        async endSession() {}
    };
    const marketId = "507f191e810c19729de860ea";
    const userId = "507f1f77bcf86cd799439011";

    mongoose.startSession = async () => session;
    Market.findOne = async () => ({ _id: marketId, status: "open", expiresAt: new Date("2030-01-01") });
    Market.findOneAndUpdate = async (...args) => {
        calls.push(["market", args]);
        return { _id: marketId };
    };
    User.findOneAndUpdate = async (...args) => {
        calls.push(["user", args]);
        return { _id: userId };
    };
    Put.create = async ([put], options) => {
        calls.push(["put", [put, options]]);
        return [{ ...put, _id: "507f1f77bcf86cd799439012" }];
    };

    try {
        await orderPut(
            { userId, body: { market: marketId, prediction: "YES", amountSpent: 30 } },
            res
        );
    } finally {
        mongoose.startSession = originalStartSession;
        Market.findOne = originalFindOne;
        Market.findOneAndUpdate = originalFindOneAndUpdate;
        User.findOneAndUpdate = originalUserUpdate;
        Put.create = originalPutCreate;
    }

    assert.equal(res.statusCode, 201);
    assert.equal(calls[0][0], "market");
    assert.equal(calls[1][0], "user");
    assert.deepEqual(calls[1][1][1], { $inc: { balance: -30 } });
    assert.deepEqual(calls[2][1][0], {
        market: marketId,
        user: userId,
        prediction: "yes",
        amountSpent: 30
    });
});

test("resolveMarket pays the entire pool to winning positions", async () => {
    const originalStartSession = mongoose.startSession;
    const originalFindById = Market.findById;
    const originalFindOne = Market.findOne;
    const originalFind = Put.find;
    const originalUserUpdate = User.findByIdAndUpdate;
    const res = responseStub();
    const userId = "507f1f77bcf86cd799439011";
    const marketId = "507f191e810c19729de860ea";
    const winnerId = "507f1f77bcf86cd799439012";
    const updates = [];
    const session = {
        async withTransaction(work) {
            await work();
        },
        async endSession() {}
    };
    const market = {
        _id: marketId,
        creator: userId,
        status: "open",
        pool: { yes: 60, no: 40 },
        async save() {}
    };

    mongoose.startSession = async () => session;
    Market.findById = async () => market;
    Market.findOne = async () => market;
    Put.find = async () => [{ user: winnerId, amountSpent: 20 }];
    User.findByIdAndUpdate = async (...args) => {
        updates.push(args);
    };

    try {
        await resolveMarket({ userId, params: { marketId }, body: { resolution: "YES" } }, res);
    } finally {
        mongoose.startSession = originalStartSession;
        Market.findById = originalFindById;
        Market.findOne = originalFindOne;
        Put.find = originalFind;
        User.findByIdAndUpdate = originalUserUpdate;
    }

    assert.equal(res.statusCode, 200);
    assert.equal(updates.length, 1);
    assert.equal(updates[0][0], winnerId);
    assert.deepEqual(updates[0][1], { $inc: { balance: 100 } });
    assert.equal(market.status, "resolved");
    assert.equal(market.resolution, "yes");
});

test("resolveMarket only allows the creator to resolve a market", async () => {
    const originalStartSession = mongoose.startSession;
    const originalFindById = Market.findById;
    const res = responseStub();
    const session = {
        async withTransaction(work) {
            await work();
        },
        async endSession() {}
    };

    mongoose.startSession = async () => session;
    Market.findById = async () => ({
        creator: "507f1f77bcf86cd799439011",
        status: "open",
        pool: { yes: 50, no: 50 }
    });

    try {
        await resolveMarket({
            userId: "507f1f77bcf86cd799439012",
            params: { marketId: "507f191e810c19729de860ea" },
            body: { resolution: "yes" }
        }, res);
    } finally {
        mongoose.startSession = originalStartSession;
        Market.findById = originalFindById;
    }

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: "Only the market creator can resolve it" });
});

test("canceling a market refunds wagers and the creator's seed", async () => {
    const originalStartSession = mongoose.startSession;
    const originalFindById = Market.findById;
    const originalFind = Put.find;
    const originalUserUpdate = User.findByIdAndUpdate;
    const res = responseStub();
    const userId = "507f1f77bcf86cd799439011";
    const updates = [];
    const session = {
        async withTransaction(work) {
            await work();
        },
        async endSession() {}
    };
    const market = {
        creator: userId,
        status: "open",
        initialSeedAmount: 50,
        pool: { yes: 60, no: 20 },
        async save() {}
    };

    mongoose.startSession = async () => session;
    Market.findById = async () => market;
    Put.find = async () => [
        { user: "507f1f77bcf86cd799439012", amountSpent: 10 },
        { user: "507f1f77bcf86cd799439013", amountSpent: 20 }
    ];
    User.findByIdAndUpdate = async (...args) => {
        updates.push(args);
    };

    try {
        await resolveMarket({
            userId,
            params: { marketId: "507f191e810c19729de860ea" },
            body: { resolution: "canceled" }
        }, res);
    } finally {
        mongoose.startSession = originalStartSession;
        Market.findById = originalFindById;
        Put.find = originalFind;
        User.findByIdAndUpdate = originalUserUpdate;
    }

    assert.equal(res.statusCode, 200);
    assert.deepEqual(updates.map(([id, update]) => [id, update]), [
        ["507f1f77bcf86cd799439012", { $inc: { balance: 10 } }],
        ["507f1f77bcf86cd799439013", { $inc: { balance: 20 } }],
        [userId, { $inc: { balance: 50 } }]
    ]);
    assert.equal(res.body.totalDistributed, 80);
    assert.equal(market.resolution, "canceled");
});

test("the market expiry index uses the status field", () => {
    assert.equal(Market.schema.indexes().some(([keys]) => (
        keys.status === 1 && keys.expiresAt === 1
    )), true);
});

test("the app mounts every protected route behind auth middleware", () => {
    const app = createApp();
    const routers = app.router.stack
        .filter((layer) => layer.name === "router")
        .map((layer) => layer.handle.stack);
    const protectedRoutes = routers.slice(1).flatMap((router) => router.map((layer) => ({
        path: layer.route.path,
        handlers: layer.route.stack.map((handler) => handler.name)
    })));

    assert.deepEqual(protectedRoutes, [
        { path: "/create", handlers: ["auth", "createMarket"] },
        { path: "/:marketId/resolve", handlers: ["auth", "resolveMarket"] },
        { path: "/add-balance", handlers: ["auth", "addBalance"] },
        { path: "/put-order", handlers: ["auth", "orderPut"] }
    ]);
});
