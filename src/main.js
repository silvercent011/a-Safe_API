import { configuration } from './config.js'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'

//Express
const App = express()
App.use(urlencoded({ extended: true }))
App.use(json())
//Cors
App.use(cors())
//Helmet
App.use(helmet())

//Mongoose
const url = configuration.mongo_string
mongoose.connect(url, () => console.log('MongoDB Connected'))

//Index
App.get('/', (req, res) => {
    res.json({ status: 'Server is running!' })
})
//Server
const PORT = configuration.port || 1010;
App.listen(PORT, () => {
    console.log(`APP RUNNING ON PORT ${PORT}`)
})