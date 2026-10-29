import mongoose from "mongoose";
import { Market, Put, User } from "../../models/Models.js";
import { resolveMarketSchema } from "../../schema/ZodSchema.js";

function requestError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export async function resolveMarket(req, res) {
    const { marketId } = req.params;
    const validation = resolveMarketSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.flatten() });
    }

    if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!mongoose.isValidObjectId(marketId)) {
        return res.status(400).json({ error: "Invalid market id" });
    }

    const { resolution } = validation.data;
    let session;

    try {
        session = await mongoose.startSession();
        let totalDistributed = 0;
        let message;

        await session.withTransaction(async () => {
            const market = await Market.findById(marketId, null, { session });
            if (!market) {
                throw requestError(404, "Market not found");
            }

            if (String(market.creator) !== String(req.userId)) {
                throw requestError(403, "Only the market creator can resolve it");
            }

            if (market.status === "resolved") {
                throw requestError(400, "Market is already resolved");
            }

            const totalPoolAmount = Number(market.pool.yes) + Number(market.pool.no);

            if (resolution === "canceled") {
                const allPuts = await Put.find({ market: marketId }, null, { session });
                for (const put of allPuts) {
                    await User.findByIdAndUpdate(
                        put.user,
                        { $inc: { balance: put.amountSpent } },
                        { session }
                    );
                }

                const seedAmount = Number(market.initialSeedAmount) || 0;
                if (seedAmount > 0) {
                    await User.findByIdAndUpdate(
                        market.creator,
                        { $inc: { balance: seedAmount } },
                        { session }
                    );
                }

                totalDistributed = allPuts.reduce((total, put) => total + put.amountSpent, 0) + seedAmount;
                message = "Market canceled. All funds refunded.";
            } else {
                const winningPuts = await Put.find(
                    { market: marketId, prediction: resolution },
                    null,
                    { session }
                );
                const totalWinning = winningPuts.reduce(
                    (total, put) => total + put.amountSpent,
                    0
                );

                if (totalWinning === 0) {
                    message = `Market resolved to ${resolution.toUpperCase()}. No winning positions.`;
                } else {
                    let distributed = 0;
                    for (const [index, put] of winningPuts.entries()) {
                        const payout = index === winningPuts.length - 1
                            ? totalPoolAmount - distributed
                            : Number((totalPoolAmount * put.amountSpent / totalWinning).toFixed(2));
                        distributed += payout;

                        await User.findByIdAndUpdate(
                            put.user,
                            { $inc: { balance: payout } },
                            { session }
                        );
                    }

                    totalDistributed = distributed;
                    message = `Market successfully resolved to ${resolution.toUpperCase()}. Winnings distributed.`;
                }
            }

            market.status = "resolved";
            market.resolution = resolution;
            await market.save({ session });
        });

        return res.status(200).json({ message, totalDistributed });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Unable to resolve market", error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
}
