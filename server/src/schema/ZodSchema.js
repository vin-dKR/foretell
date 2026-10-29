import { z } from "zod"

const objectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid DB Id"
})
export const createUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(8, "Atleast 8 charaters allowed"),
}).strict()

export const signinSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z.string().min(8, "atleast 8 chars")
}).strict()

export const createMarketSchema = z.object({
    title: z.string().trim().min(1).max(200),
    desc: z.string().trim().max(2_000),
    expireAt: z.string().datetime(
        { message: "Invalide date format" }
    ).pipe(z.coerce.date()).refine((date) => date > new Date(), {
        message: "date must be in future"
    }),
    initialSeedAmount: z.number().finite().min(10, "need $ > 10")
}).strict()

export const createPutSchema = z.object({
    market: objectIdSchema,
    prediction: z.string().trim().transform((s) => s.toLowerCase()).pipe(z.enum(['yes', 'no'], {
        message: "just yes or no"
    })),
    amountSpent: z.number().finite().positive("wager amount > 0")
}).strict()

export const resolveMarketSchema = z.object({
    resolution: z.string().trim().transform(s => s.toLowerCase()).pipe(z.enum(["yes", "no", "canceled"], {
        message: "just yes, no, canceled"
    }))
}).strict()

export const depositSchema = z.object({
    amount: z.number().finite().positive("amount must be > 0")
}).strict()
