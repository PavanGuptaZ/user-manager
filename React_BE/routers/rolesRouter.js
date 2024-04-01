import express from "express";
import { AddRoles, ChangeRoleById, DeleteRole, GetAllRoles, GetAllRolesNames, GetRolesById, UpdateRoleById, GetUserRoleById } from '../controller/rolesController.js'
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router()

router.get('/all', verifyJWT, GetAllRoles)

router.get('/allnames', verifyJWT, GetAllRolesNames)

router.get('/userRoles/:id', verifyJWT, GetUserRoleById)

router.get('/byid/:id', verifyJWT, GetRolesById)

router.post('/add', verifyJWT, AddRoles)

router.patch('/update/:id', verifyJWT, UpdateRoleById)

router.patch('/rolechange', verifyJWT, ChangeRoleById)

router.delete('/delete/:id', verifyJWT, DeleteRole)

export default router