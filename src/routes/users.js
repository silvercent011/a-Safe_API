import { Router } from 'express'
import { Contractor } from "../models/Contractor.js";
import { Guard } from "../models/Guard.js";
import { compare, hash } from "bcrypt";
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken
export const UsersRouter = Router()

UsersRouter.post('/contractor/', async (req, res) => {
    const { storeName, cnpj, name, surname, email, password, birthdate, phone } = req.body
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
        return res.status(201).send(contractor)
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar contratante...', mongo: error })

    }
})

UsersRouter.post('/guard/', async (req, res) => {
    const { cpf, name, surname, email, password, birthdate, phone } = req.body
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
        return res.status(201).send(guard)
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar guarda...', mongo: error })
    }
})

UsersRouter.post('/auth', async (req, res) => {
    const { email, password } = req.body;
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

        //Adiciona token
        const addictParams = {
            token: sign({ email: email, id: userData._id.toString() }, process.env.JWT_SECRET, { expiresIn: "6h" })
        }
        //Zera senha da resposta
        userData.password = undefined;
        //Retorna
        return res.status(200).send({ ...userData.toObject(), ...addictParams })

    } catch (error) {
        return res.status(400).send({ error: "Não foi possível logar" })
    }
})