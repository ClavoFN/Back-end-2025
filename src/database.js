import sqlite3 from "sqlite3"
import { open } from "sqlite"
import dotenv from "dotenv"

dotenv.config()


export const db = await open({
    filename: process.env.DB_PATH,
    driver: sqlite3.Database
})

await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT, 
    email TEXT UNIQUE,
    password TEXT
    )
`)