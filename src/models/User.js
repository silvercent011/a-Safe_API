import { Schema, model } from 'mongoose'
import { hash } from 'bcrypt'

const ratingSchema = new Schema({

})

const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    birthdate: { type: Date, default: null },
    ratings: [ratingSchema]
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

userSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified('password')) return next()
    user.password = await hash(user.password, 10);
    return next()
})

export const User = model('User', userSchema, 'users')

