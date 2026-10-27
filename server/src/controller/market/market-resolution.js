import { Market, Put, User } from "../../models/Models";
import { resolveMarketSchema } from "../../schema/ZodSchema"

export async function resolveMarket(req, res) {
    const { marketId } = req.params
    try {
        const validation = resolveMarketSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { resolution } = validation.data;

        const market = await Market.findById(marketId);
        if (!market) {
            return res.status(404).json({ error: "Market not found" });
        }
        if (market.status === "resolved") {
            return res.status(400).json({ error: "Market is already resolved" });
        }

        const totalPoolAmount = market.pool.yes + market.pool.no

        if (resolution == "canceled") {
            const allPuts = await Put.find({ market: marketId })
            const refundPromise = allPuts.map(put =>
                User.findByIdAndUpdate(put.user, {
                    $inc: { balance: put.amountSpent }
                })
            )
            await Promise.all(refundPromise)

            market.status = "resolved"
            market.resolution = "canceled"
            await market.save()

            return res.status(200).json({
                message: "Market canceled. All funds refunded."
            });
        }

        const winningPuts = await Put.find({
            market: marketId,
            prediction: resolution,
        })

        const totalWinning = winningPuts.reduce((sum, currPut) => sum + currPut.amountSpent, 0)

        if (totalPoll == 0) {
            market.status = "resolved"
            market.resolution = resolution
            await market.save()

            return res.status(200).json({
                message: `Market resolve to ${resolution}. No wiiner`
            });
        }

        const payoutPromises = winningPuts.map(async (put) => {

            const shareRatio = put.amountSpent / totalWinning
            const userPayout = shareRatio * totalWinning

            await User.findByIdAndUpdate(put.user, {
                $inc: { balance: Number(userPayout.toFixed(2)) }
            })
        })

        await Promise.all(payoutPromises)

        market.status = "resolved"
        market.resolution = resolution
        await market.save()

        return res.status(200).json({
            message: `Market successfully resolved to ${resolution.toUpperCase()}. Winnings distributed.`,
            totalDistributed: totalPoolAmount
        });

    } catch (err) {
        console.log(err)
    }
}
