import mongoose from "mongoose"
import { Market, User } from "../../models/Models"
import { createMarketSchema } from "../../schema/ZodSchema"

export async function createMarket(req, res) {
    const session = mongoose.startSession()
    session.startTransaction()

    try {
        const validation = createMarketSchema.safeParse(req.body)
        if (!validation.success) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({
                error: validation.error
            })
        }

        const { title, desc, expireAt, initialSeedAmount } = validation.data
        const userId = req.userId

        if (!userId) {
            await session.abortTransaction()
            session.endSession()
            return res.status(404).json({
                error: "Unauthorized"
            })
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, balance: { $gte: initialSeedAmount } },
            { $inc: { balance: -initialSeedAmount } },
            { new: true }
        )

        if (!user) {
            await session.abortTransaction()
            session.endSession()
            res.status(400).json({ error: "Insufficient balance" })
        }

        const splitSeed = initialSeedAmount / 2
        const [newMarket] = await Market.create([{
            title,
            desc,
            expireAt,
            creator: userId,
            pool: {
                yes: splitSeed,
                no: splitSeed
            }
        }], { session })

        await session.commitTransaction()
        session.endSession()

        return res.status(201).json({
            message: "marget created successfully",
            market: newMarket
        })
    } catch (err) {
        conosle.log(err)

        await session.abortTransaction()
        session.endSession()

        return res.status(500).json({
            error: "Internal server error"
        })
    }
}
