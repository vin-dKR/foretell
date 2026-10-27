import { Market, Put, User } from "../../models/Models";
import { createPutSchema } from "../../schema/ZodSchema"

export async function orderPut(req, res) {
    let fundsDeducted = false;
    let poolIncremented = false;
    const userId = req.userId

    let validatedAmount = 0;
    let validatedPrediction = ""
    let validatedMarketId = ""

    try {
        if (!userId) {
            return res.json("Unauthoried")
        }

        const validation = createPutSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                error: validation.error
            })
        }

        const { market: marketId, prediction, amountSpent } = validation.data

        validatedAmount = amountSpent
        validatedPrediction = prediction
        validatedMarketId = marketId

        const market = await Market.findOne({ marketId })
        if (!market) {
            return res.status(400).json({
                error: "Market not found"
            })
        }

        if (market.status != open || new Date() > new Date(market.expiresAt)) {
            return res.status(400).json({
                error: "this market has closed or expired"
            })
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, balance: { $gte: amountSpent } },
            { $inc: { balance: amountSpent } },
            { new: true }
        )
        if (!user) {
            return res.status(400).json({
                error: "Insufficant fund"
            })
        }

        fundsDeducted = true

        await Market.findByIdAndUpdate(marketId, {
            $inc: { [`pool.${prediction}`]: amountSpent }
        })

        poolIncremented = true

        const newPut = await Put.create({
            user: userId,
            market: marketId,
            prediction,
            amountSpent,
        })


        return res.status(201).json({
            message: "successfully created",
            data: newPut
        })

    } catch (err) {
        console.log(err)
        // if (!newPut) {
        //     return res.status(400).json({
        //         error: "somehting went wrong when ordering"
        //     })
        // }
        //
        if (poolIncremented) {
            try {
                await Market.findByIdAndUpdate(userId, {
                    $inc: { [`pool.${validatedPrediction}`]: -validatedAmount }
                })
                console.log("amount restored")
            } catch (err) {
                console.log(err)
            }
        }

        if (fundsDeducted) {
            try {
                await User.findByIdAndUpdate(userId, {
                    $inc: { balance: validatedAmount }
                })
                console.log("funds refunde")
            } catch (err) {
                console.log(err)
            }
        }
    }
}
