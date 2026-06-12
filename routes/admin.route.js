import express from 'express'
import { authMid } from '../middlewares/auth.middleware.js'
import { roleMid } from '../middlewares/role.middleware.js'
import { allUsers, delUser } from '../controllers/admin.controller.js'
const router = express.Router()


router.get('/users', authMid, roleMid('admin'), allUsers)
router.delete('/users/:userId', authMid, roleMid('admin'), delUser)
export default router