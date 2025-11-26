import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { v4 as uuidv4 } from "uuid"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const userPath = path.join(__dirname, "../data/users.json")

const getUsersData = () => {
    const userData = JSON.parse(fs.readFileSync(userPath, "utf8"))
    return userData
}

const saveUsersData = (data) => {
    fs.writeFileSync(userPath, JSON.stringify(data, null, 2))
}


//GET ALL
export const getUsers = (req, res) => {
    const users = getUsersData();
    res.send(users)
}


//GET ONE 
export const getUsersById = (req, res) => {
    const users = getUsersData();
    const user = users.find(u => u.id == req.params.id)

    user 
        ? res.json(user)
        : res.status(404).json({message: "Usuario no encontrado"})
}


//CREATE
export const createUser = (req, res) => {
    const users = getUsersData();
    const newUser = req.body 

    newUser.id = uuidv4();

    users.push(newUser)
    saveUsersData(users)

    res.status(201).json(newUser)
}


//UPDATE
export const updateUser = (req, res) => {
    const users = getUsersData();
    const { id } = req.params
    const index = users.findIndex(u => u.id === id)

    if (index === -1) {
        return res.status(404).json({message: "Usuario no encontrado"})
    }

    users[index] = {...users[index], ...req.body}
    saveUsersData(users)

    res.json({
        message: "Usuario actualizado",
        data: users[index]
    })
}

//DELETE
export const deleteUser = (req, res) => {
    const users = getUsersData();
    const { id } = req.params
    const index = users.findIndex(u => u.id === id)

    if (index === -1) {
        return res.status(404).json({message: "Usuario no encontrado"}
        )
    }

    users.splice(index, 1)
    saveUsersData(users)

    res.json({message: "Usuario eliminado"})
}
