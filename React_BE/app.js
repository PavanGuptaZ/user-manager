import express from "express";

const app = express()

import cors from 'cors';
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import { logger } from "./middleware/logger.js";


app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(logger)


export default app