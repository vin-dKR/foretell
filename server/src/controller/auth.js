import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/Models.js"
import { createUserSchema, signinSchema } from "../schema/ZodSchema.js"

export const signup = async (req, res) => {
    try {
        const validation = createUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.flatten() });
        }

        const { name, email, password } = validation.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                error: "email already register"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            balance: 0
        });

        return res.status(201).json({
            id: user._id
        });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ error: "email already registered" });
        }
        console.error("Unable to sign up", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signin = async (req, res) => {
    try {
        const validation = signinSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.flatten() });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "Authentication is not configured" });
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User not found!" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        return res.staus(200).json({ token });
    } catch (err) {
        console.error("Unable to sign in", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

