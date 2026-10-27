import { z } from "zod"

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid DB Id"
})
export const createUserSchema = z.object({
    name: z.string().min(2, "Nmame must be at least 2 charater").max(50),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Atleast 8 charaters allowed"),
})

export const signinSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "atleast 8 chars")
})

export const createMarketSchema = z.object({
    title: z.string(),
    desc: z.string(),
    expireAt: z.string().datetime(
        { message: "Invalide date format" }
    ).pipe(z.coerce.date()).refine((date) => date > new Date(), {
        message: "date must be in future"
    }),
    initialSeedAmount: z.number().min(10, "need $ > 10")
})

export const createPutSchema = z.object({
    user: objectIdSchema,
    market: objectIdSchema,
    predicton: z.string().transform((s) => s.toLowerCase).pipe((z.enum(['yes', 'no'], {
        message: "just yes or no"
    }))),
    amountSpent: z.number().positive("wager amount > 0")
})

export const resolveMarketSchema = z.object({
    resolution: z.string().transform(s => s.toLowerCase).pipe(z.enum(["yes", "no", "canceled"], {
        message: "just yes, no, canceled"
    }))
})

export const depositSchema = z.object({
    amount: z.number().positive("amount must be > 0")
})
