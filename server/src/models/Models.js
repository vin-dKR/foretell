import mongoose from "mongoose";

const { Schema } = mongoose

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    balance: Number
})

const User = mongoose.model('User', userSchema)

const marketSchema = new Schema({
    title: { type: String, required: true },
    desc: String,
    pool: {
        yes: { type: Number, default: 0 },
        no: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'resolved'],
        default: 'open',
        lowercase: true
    },
    resolution: {
        type: String,
        enum: ["yes", "no", "canceled"],
        default: null,
        lowercase: true
    },
    expiresAt: { type: Date, required: true },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    initialSeedAmount: { type: Number }
}, { timestamps: true })
marketSchema.index({ staus: 1, expiresAt: 1 })

const Market = mongoose.model('Market', marketSchema)

const putSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    market: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
        required: true
    },
    prediction: {
        type: String,
        enum: ["yes", "no"],
        required: true,
        lowercase: true
    },
    amountSpent: {
        type: Number,
        required: true
    }
}, { timestamps: true })
putSchema.index({ user: 1, market: 1 })

const Put = mongoose.model('Put', putSchema)

export { User, Market, Put }
