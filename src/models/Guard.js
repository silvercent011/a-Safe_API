import mongoose from "mongoose";
const { model } = mongoose
import { extendSchema } from "../utils/extend_schema.js";
import { userSchema } from "./User.js";


const guardSchema = extendSchema(userSchema, {
    cpf: { type: String, required: true },
    type: { type: String, default: "GUARD" }
})

export const Guard = model('Guard', guardSchema, 'guards')