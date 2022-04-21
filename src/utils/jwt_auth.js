import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken
export const authjson = async (req, res, next) => {
    const tokenFromHeader = req.headers.access_token
    const secret = process.env.JWT_SECRET
    if (!tokenFromHeader) return res.status(400).send({ error: "Autenticação recusada, token não enviado" })

    verify(tokenFromHeader, secret, (err, decoded) => {
        if (err) return res.status(400).send({ error: "Token inválido" })
        res.locals.auth_data = decoded
        return next()
    })
}