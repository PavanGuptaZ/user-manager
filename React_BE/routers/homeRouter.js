import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router()

router.all('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

export default router