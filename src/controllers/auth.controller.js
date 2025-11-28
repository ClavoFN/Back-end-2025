import { v4 as uuidv4 } from "uuid"
import { generateJWT } from "../utils/generateJWT.js";
import { db } from "../database.js"
import bcrypt from "bcrypt"


export const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(404).json({ok: false, msg: "Faltan campos"})
    };
    
    try {
        const exists = await db.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    if (exists) {
        return res.status(400).json({ok: false, msg: "El email ya está registrado"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
        id: uuidv4(),
        name, 
        email,
        password: hashedPassword
    }

    await db.run(
        "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
        [newUser.id,
        newUser.name,
        newUser.email,
        newUser.password]
    )

    const token = await generateJWT(newUser.id)

    res.json({
        ok: true,
        user: {
            id: newUser.id, 
            name: newUser.name,
            email: newUser.email
        },
        token
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({ok: false, msg: "Error del servidor"})
    }
    
} 


export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ok: false, msg: "Credenciales invalidas"}
        )
    }
    
    try {
        const user = await db.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    if (!user) {
        return res.status(400).json({ok: false, msg: "Usuario no encontrado"})
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return res.status(400).json({ok: false, msg: "Credenciales invalidas"}
        )
    }

    const token = await generateJWT(user.id)

    res.json({
        ok: true, 
        msg: "Login correcto",
        token
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({ok: false, msg: "Erro en el servidor"})
    }
}
