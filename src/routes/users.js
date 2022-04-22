import { Router } from 'express'
import { Contractor } from "../models/Contractor.js";
import { Guard } from "../models/Guard.js";
import { compare, hash } from "bcrypt";
import jsonwebtoken from 'jsonwebtoken';
import { decodeToken } from '../utils/decode_token.js';
const { sign } = jsonwebtoken

export const UsersRouter = Router()

UsersRouter.post('/contractor/', async (req, res) => {
    const { storeName, cnpj, name, surname, email, password, birthdate, phone, latitude, longitude } = req.body
    if (!storeName, !cnpj, !name, !surname, !email, !password) return res.status(400).send({ error: 'Dados Insuficientes' })
    // Verifica se usuário existe
    const guardData = (await Guard.findOne({ email: email }).select("+password"))
    const contractorData = (await Contractor.findOne({ email: email }).select("+password"))
    try {
        if (guardData || contractorData) return res.status(400).send({ error: 'E-mail já existe na base' })
        if (await Contractor.findOne({ cnpj: cnpj })) return res.status(400).send({ error: 'CNPJ já existe na base' })
        const data = { storeName, cnpj, name, surname, email, password, birthdate, phone }
        data.password = await hash(data.password, 10);
        const contractor = await Contractor.create(data)
        contractor.password = undefined
        await Contractor.findOneAndUpdate({ _id: contractor._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
        return res.status(201).send(contractor)
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar contratante...', mongo: error })

    }
})

UsersRouter.post('/guard/', async (req, res) => {
    const { cpf, name, surname, email, password, birthdate, phone, latitude, longitude } = req.body
    if (!cpf, !name, !surname, !email, !password) return res.status(400).send({ error: 'Dados Insuficientes' })
    // Verifica se usuário existe
    const guardData = (await Guard.findOne({ email: email }).select("+password"))
    const contractorData = (await Contractor.findOne({ email: email }).select("+password"))
    try {
        if (guardData || contractorData) return res.status(400).send({ error: 'E-mail já existe na base' })
        if (await Guard.findOne({ cpf: cpf })) return res.status(400).send({ error: 'CPF já existe na base' })
        const data = { cpf, name, surname, email, password, birthdate, phone }
        data.password = await hash(data.password, 10);
        const guard = await Guard.create(data)
        guard.password = undefined
        await Guard.findOneAndUpdate({ _id: guard._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
        return res.status(201).send(guard)
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar guarda...', mongo: error })
    }
})

UsersRouter.post('/auth', async (req, res) => {
    const { email, password, longitude, latitude } = req.body;
    if (!email || !password) return res.status(400).send({ error: "Dados insuficientes" })
    // Verifica se usuário existe
    const guardData = (await Guard.findOne({ email: email }).select("+password"))
    const contractorData = (await Contractor.findOne({ email: email }).select("+password"))
    try {
        //Verifica Usuário não encontrado
        if (!guardData && !contractorData) return res.status(400).send({ error: "Usuário não encontrado" })
        //Define usuário
        const userData = guardData ? guardData : contractorData
        //Checa se senha está correta
        const passwordCheck = await compare(password, userData.password);
        if (!passwordCheck) return res.status(400).send({ error: "Senha incorreta" })

        let update = undefined
        if (guardData) {
            update = await Guard.findOneAndUpdate({ _id: userData._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
        } else {
            update = await Contractor.findOneAndUpdate({ _id: userData._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
        }


        //Adiciona token
        const addictParams = {
            token: sign({ email: email, id: update._id.toString() }, process.env.JWT_SECRET, { expiresIn: "6h" })
        }
        //Zera senha da resposta
        update.password = undefined;
        //Retorna
        return res.status(200).send({ ...update.toObject(), ...addictParams })

    } catch (error) {
        return res.status(400).send({ error: "Não foi possível logar" })
    }
})
UsersRouter.patch('/me', async (req, res) => {
    const token = req.headers.access_token
    const { email, id } = await decodeToken(token)
    const { longitude, latitude } = req.body;
    if (!email) return res.status(400).send({ error: "Dados insuficientes" })
    // Verifica se usuário existe
    const guardData = (await Guard.findOne({ _id: id }).select("+password"))
    const contractorData = (await Contractor.findOne({ _id: id }).select("+password"))
    try {
        //Verifica Usuário não encontrado
        if (!guardData && !contractorData) return res.status(400).send({ error: "Usuário não encontrado" })
        //Define usuário
        const userData = guardData ? guardData : contractorData
        let update = undefined
        if (guardData) {
            update = await Guard.findOneAndUpdate({ _id: userData._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
            update = await Guard.findOneAndUpdate({ _id: userData._id.toString() }, req.body)
        } else {
            update = await Contractor.findOneAndUpdate({ _id: userData._id.toString() }, req.body)
        }


        //Adiciona token
        const addictParams = {
            token: sign({ email: email, id: update._id.toString() }, process.env.JWT_SECRET, { expiresIn: "6h" })
        }
        //Zera senha da resposta
        update.password = undefined;
        //Retorna
        return res.status(200).send({ ...update.toObject(), ...addictParams })

    } catch (error) {
        return res.status(400).send({ error: "Não foi possível logar" })
    }
})


UsersRouter.post('/me', async (req, res) => {
    const token = req.headers.access_token
    const { email, id } = await decodeToken(token)
    const { latitude, longitude } = req.body
    // Verifica se usuário existe
    const guardData = (await Guard.findOne({ _id: id }))
    const contractorData = (await Contractor.findOne({ _id: id }))
    try {

        //Verifica Usuário não encontrado
        if (!guardData && !contractorData) return res.status(400).send({ error: "Usuário não encontrado" })

        const userData = guardData ? guardData : contractorData

        let update = undefined
        if (guardData) {
            update = await Guard.findOneAndUpdate({ _id: userData._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
        } else {
            update = await Contractor.findOneAndUpdate({ _id: userData._id.toString() }, { lastLocation: { type: "Point", coordinates: [longitude, latitude] } })
        }

        //Adiciona token
        const addictParams = {
            token: sign({ email: email, id: update._id.toString() }, process.env.JWT_SECRET, { expiresIn: "6h" })
        }
        //Zera senha da resposta
        update.password = undefined;
        //Retorna
        return res.status(200).send({ ...update.toObject(), ...addictParams })

    } catch (error) {
        return res.status(400).send({ error: "Erro ao obter dados" })
    }

})