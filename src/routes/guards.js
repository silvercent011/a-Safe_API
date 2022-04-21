import { Router } from 'express'
import { Guard } from "../models/Guard.js";
import { decodeToken } from '../utils/decode_token.js';
export const GuardsRouter = Router()

GuardsRouter.get('/', async (req, res) => {
    const token = req.headers.access_token
    const { email, id } = await decodeToken(token)
    try {
        const guards = await Guard.find({})
        return res.status(200).send(guards)
    } catch (error) {
        return res.status(400).send({error:'Faha na busca'})
        
    }
})