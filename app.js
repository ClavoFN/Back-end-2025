import express from "express";
import cors from "cors";
import usersRouter from "./src/routes/users.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import dotenv from "dotenv"  


dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter)
app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
    res.send("✔ Auth API working ✔")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})