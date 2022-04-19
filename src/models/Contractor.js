import mongoose from "mongoose";
const { model } = mongoose
import { extendSchema } from "../utils/extend_schema.js";
import { userSchema } from "./User.js";


const contractorSchema = extendSchema(userSchema, {
    storeName: { type: String, required: true },
    cnpj: { type: String, required: true },
    type: { type: String, default: "CONTRACTOR" }
})

export const Contractor = model('Contractor', contractorSchema, 'contractors')