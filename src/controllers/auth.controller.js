import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4} from "uuid"
import { generateJWT } from "../utils/generateJWT.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const userPath = path.join(__dirname, "../data/users.json")

const getUsersData = () => JSON.parse(fs.readFileSync(userPath, "utf8"))
const saveUsersData = (data) => {
    fs.writeFileSync(userPath, JSON.stringify(data, null, 2))
}


export const register = async (req, res) => {
    const { name, email, password} = req.body

    if (!name || !email || !password) {
        return res.status(404).json({ok: false, msg: "Faltan campos"})
    }

    const users = getUsersData();

    const exists = users.find(u => u.email === email)
    if (exists) {
        return res
            .status(404)
            .json({ok: false, msg: "El email ya está registrado"})
    }

    const newUser = {
        id: uuidv4(),
        name, 
        email,
        password
    }

    users.push(newUser);
    saveUsersData(users)

    const token = await generateJWT(newUser.id)

    res.json({
        ok: true,
        user: newUser,
        token
    })
}


export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ok: false, msg: "Credenciales invalidas"}
        )
    }

     const users = getUsersData();
     const user = users.find(u => u.email === email)

    if (!user) {
        return res.status(400).json({ok: false, msg: "Faltan datos"})
    }

    if (user.password !== password) {
        return res.status(400).json({ok: false, msg: "Credenciales invalidas"}
        )
    }

    const token = await generateJWT(user.id)

    res.json({
        ok: true, 
        msg: "Login correcto",
        token
    })
}
