import { expect, test } from "bun:test";
import { signup } from "../../controller/auth.js";

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

test("signup rejects an invalid email", async () => {
    const res = responseStub();

    await signup(
        {
            body: {
                name: "Sam",
                email: "invalid-email",
                password: "password123"
            }
        },
        res
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
});
