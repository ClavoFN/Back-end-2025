import  { Router } from "express"
import { getUsers, getUsersById } from "../controllers/users.controller.js"

const usersRouter = Router()

usersRouter.get("/", getUsers)
usersRouter.get("/:id", getUsersById)

export default usersRouter