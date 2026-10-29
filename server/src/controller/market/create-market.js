import mongoose from "mongoose";
import { Market, User } from "../../models/Models.js";
import { createMarketSchema } from "../../schema/ZodSchema.js";

function requestError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export async function createMarket(req, res) {
    const validation = createMarketSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }

    if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, desc, expireAt, initialSeedAmount } = validation.data;
    let session;

    try {
        session = await mongoose.startSession();
        let newMarket;

        await session.withTransaction(async () => {
            const user = await User.findOneAndUpdate(
                { _id: req.userId, balance: { $gte: initialSeedAmount } },
                { $inc: { balance: -initialSeedAmount } },
                { new: true, session }
            );

            if (!user) {
                throw requestError(400, "Insufficient balance");
            }

            const seedPerOutcome = initialSeedAmount / 2;
            [newMarket] = await Market.create([{
                title,
                desc,
                expiresAt: expireAt,
                creator: req.userId,
                initialSeedAmount,
                pool: {
                    yes: seedPerOutcome,
                    no: seedPerOutcome
                }
            }], { session });
        });

        return res.status(201).json({
            message: "Market created successfully",
            market: newMarket
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Unable to create market", error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
}
