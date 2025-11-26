import jwt from "jsonwebtoken"

const SECRET_KEY = "nicolas0502";

export const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload, 
            SECRET_KEY,
            {
                expiresIn: "1h"
            }, 
            (err, token) => {
                if (err) {
                    reject("No se pudo generar el token")
                } else {
                    resolve(token)
                }
            }
        )
    })
}