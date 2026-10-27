import bcrypt from "bcrypt"
import { User } from "../models/Models.js"
import { createUserSchema, signinSchema } from "../schema/ZodSchema.js"

export const signup = async (req, res) => {
    try {
        const { name, email, password } = createUserSchema.safeParse(req.body)

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).json({
                error: "email already register"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const user = User.create({
            name,
            email,
            password: hashedPass,
            balance: 0
        })

        return res.status(201).json({
            id: user._id
        })
    } catch (err) {
        console.log(err)
    }

}

export const signin = async (req, res) => {
    try {
        const { email, password } = signinSchema.safeParse(req.body)

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                error: "user not found"
            })
        }

        const validPassword = bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).json({
                error: "password did no match"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

        return res.json({ token })
    } catch (err) {
        conosole.log(er)
    }
}

