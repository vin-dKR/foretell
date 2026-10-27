import { depositSchema } from "../../schema/ZodSchema"

export async function addBalance(req, res) {
    try {
        const validation = depositSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({
                error: validation.error
            })
        }

        const { amount } = validation.data
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({
                error: "Unautorized"
            })
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { balance: amount } },
            { new: true }
        )

        if (!updateUser) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        return res.status(200).json({
            message: "Blance updated successfully",
            balance: updateUser.balance
        })
    } catch (err) {
        console.log(err)
    }
}
