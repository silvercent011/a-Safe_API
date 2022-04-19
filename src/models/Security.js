import { model } from "mongoose";
import { extendSchema } from "../utils/extend_schema";
import { userSchema } from "./User";


const securitySchema = extendSchema(userSchema, {
    cpf: { type: String, required: true },
})

export const Security = model('Security', securitySchema, 'securities')