import { Router } from "express";
import { register, login} from "../controllers/auth.controller.js"
import { authRequired } from "../middleware/auth.middleware.js"

const router = Router();

router.post("/register", register)

router.post("/login", login)

router.get("/profile", authRequired, (req, res) => {
    res.json({message: "Ruta protegida", user: req.user})
});

export default router