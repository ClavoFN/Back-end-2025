import  { Router } from "express"
import { getUsers, getUsersById, createUser, updateUser, deleteUser } from "../controllers/users.controller.js"

const usersRouter = Router()

//GET todos los usuarios
usersRouter.get("/", getUsers)

//GET por id
usersRouter.get("/:id", getUsersById)

//CREATE usuario
usersRouter.post("/", createUser)

//UPDATE usuario
usersRouter.put("/:id", updateUser)

//DELETE usuario 
usersRouter.delete("/:id", deleteUser)

export default usersRouter