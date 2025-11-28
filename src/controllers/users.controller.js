import { v4 as uuidv4 } from "uuid"
import { db } from "../database.js"

//GET ALL
export const getUsers = async (req, res) => {
    try {
        const users = await db.all("SELECT * FROM users")
        res.json(users)
    } catch {
        res.status(500).json({message: "Error al obtener usuarios", error: error.message})
    }
}


//GET BY ID 
export const getUsersById = async (req, res) => {
    try {
    const { id } = req.params

    const user = await db.get("SELECT * FROM users WHERE id = ?", id)

    if(!user) {
        return res.status(404).json({message: "Usuario no encontrado"})
    }
    res.json(user)

    } catch {
        res.status(500).json({message: "Error al buscar el usuario", error: error.message})
    }
}


//CREATE
export const createUser = async (req, res) => {
    try {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        return res.status(400).json({message: "Faltan datos obligatorios"})
    }

    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", email)

    if (existingUser) {
        return res.status(404).json({message: "El email ya se encuentra registrado"}
        )
    }
    const newUser = {
        id: uuidv4(),
        name, 
        email,
        password
    }

    await db.run(
        "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.password
    )

    res.status(201).json(newUser)

    } catch {
        res.status(500).json({message: "Error al crear usuario", error: error.message})
    }
}


//UPDATE
export const updateUser = async (req, res) => {
    try {
    const { id } = req.params
    const {name, email, password } = req.body

    const user = await db.get("SELECT * FROM users WHERE id = ?", id)

    if(!user) {
        return res.status(404).json({message: "Usuario no encontrado"})
    }

    await db.run(
        `
        UPDATE users
        SET name = ?, email = ?, password = ?
        WHERE id = ?
        `, 
        name ?? user.name, 
        email ?? user.email, 
        password ?? user.password,
        id
    )

    const updatedUser = await db.get("SELECT * FROM users WHERE id = ?", id)

    res.json({
        message: "Usuario actualizado",
        data: updatedUser
    })

    } catch {
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message})
    }
}

//DELETE
export const deleteUser = async (req, res) => {
    try {
    const { id } = req.params

    const user = await db.get("SELECT * FROM users WHERE id = ?", id)

    if (!user) {
        return res.status(404).json({message: "Usuario no encontrado"})
    }

    await db.run("DELETE FROM users WHERE id = ?", id)

    res.json({message: "Usuario eliminado"})

    } catch {
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message})
    }
}
