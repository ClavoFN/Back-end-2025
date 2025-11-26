import jwt from "jsonwebtoken"

const SECRET_KEY = "nicolas0502"


export const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({error: "Token requerido"})
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({error: "Token invalido"})
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)

        req.user = decoded

        next();
    } catch (error) {
        return res.status(401).json({error: "Token invalido o expirado"})
    }
}