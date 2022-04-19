import mongoose from 'mongoose'
export const ratingSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    contract_id: { type: String, required: true },
    rating: { type: Number, required: true },
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })