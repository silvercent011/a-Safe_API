import mongoose from 'mongoose'
const { Schema } = mongoose
import { hash } from 'bcrypt'
import { ratingSchema } from './Rating.js'

export const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    birthdate: { type: Date, default: null },
    phone: { type: Number, default: null },
    lastLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    ratings: [ratingSchema]
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

userSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified('password')) return next()
    user.password = await hash(user.password, 10);
    return next()
})
