import mongoose from "mongoose";
import { Market, Put, User } from "../../models/Models.js";
import { createPutSchema } from "../../schema/ZodSchema.js";

function requestError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export async function orderPut(req, res) {
    if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const validation = createPutSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }

    const { market: marketId, prediction, amountSpent } = validation.data;
    let session;

    try {
        session = await mongoose.startSession();
        let newPut;

        await session.withTransaction(async () => {
            const market = await Market.findOneAndUpdate(
                {
                    _id: marketId,
                    status: "open",
                    expiresAt: { $gt: new Date() }
                },
                { $inc: { [`pool.${prediction}`]: amountSpent } },
                { new: true, session }
            );

            if (!market) {
                throw requestError(400, "Market is closed, expired, or not found");
            }

            const user = await User.findOneAndUpdate(
                { _id: req.userId, balance: { $gte: amountSpent } },
                { $inc: { balance: -amountSpent } },
                { new: true, session }
            );

            if (!user) {
                throw requestError(400, "Insufficient balance");
            }

            [newPut] = await Put.create([{
                user: req.userId,
                market: marketId,
                prediction,
                amountSpent
            }], { session });
        });

        return res.status(201).json({
            message: "Order created successfully",
            data: newPut
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Unable to create order", error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
}
