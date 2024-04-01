import mongoose from 'mongoose';
import path from 'path';
import connectDb from "./config/dbConnection.js";
import dotenv from 'dotenv';
import { logEvents } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { __dirname } from './utils/dirname.js'
import app from './app.js'

dotenv.config()

import HomeRouter from './routers/homeRouter.js'
import AuthRouter from './routers/authRouter.js'
import RolesRouter from './routers/rolesRouter.js'

const PORT = process.env.PORTENV || 3500;

app.use('/', HomeRouter)
app.use('/auth', AuthRouter)
app.use('/roles', RolesRouter)

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'views/404.html'))
    } else if (req.accepts('json')) {
        res.json({ status: "error", message: '404 Not Found' })
    } else {
        res.type('text').send('404 Not Found')
    }
})

app.use(errorHandler)

connectDb()

mongoose.connection.once('open', () => {
    console.log("DataBase Connected")

    app.listen(PORT, () => {
        console.log("Server Started on " + PORT)
    })

})

mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})