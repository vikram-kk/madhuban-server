import express from 'express'
import { findme, login, register, updateProfile } from '../controllers/auth.controller.js'
import { authMid } from '../middlewares/auth.middleware.js'
const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.put('/update', authMid, updateProfile)
router.get('/user', authMid, findme)


export default router