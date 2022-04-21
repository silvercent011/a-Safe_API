import { configuration } from './config.js'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

//Express
const App = express()
//Cors
App.use(cors())
//url-encoded - body-parser
App.use(urlencoded({ extended: true }))
App.use(json())
//Helmet
App.use(helmet())

//Mongoose
const url = configuration.mongo_string
const database = configuration.mongo_database
mongoose.connect(url, { dbName: database }, () => console.log('MongoDB Connected'))

//JWT
import { authjson } from './utils/jwt_auth.js'

//Index
App.get('/', (req, res) => {
    res.json({ status: 'Server is running!' })
})
//Users
import { UsersRouter } from './routes/users.js'
App.use('/users', UsersRouter)

//Guards
import { GuardsRouter } from './routes/guards.js'
App.use('/guards', authjson, GuardsRouter)


//Server
const PORT = configuration.port || 1010;
App.listen(PORT, () => {
    console.log(`APP RUNNING ON PORT ${PORT}`)
})
