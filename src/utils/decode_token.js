import { verify } from 'jsonwebtoken';

export async function decodeToken(token) {
    const tokenFromHeader = await token
    const secret = await process.env.JWT_SECRET
    const decoded = await verify(tokenFromHeader, secret, (err, decoded) => decoded)
    return decoded
}