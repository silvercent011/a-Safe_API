import { config } from 'dotenv'
config()
export const configuration = {
    mongo_string: process.env.MONGO_STRING,
    mongo_database: process.env.MONGO_DATABASE,
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT,
}