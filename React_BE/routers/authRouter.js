import express from "express";
import { register, login, refresh, logout, getList, getUserById } from '../controller/authController.js'
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router()

router.post('/login', login)

router.post('/register', register, login)

router.get('/refresh', refresh)

router.post('/logout', logout)


router.get('/list', verifyJWT, getList)

router.get('/user/:id', verifyJWT, getUserById)

export default router