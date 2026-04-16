import express from 'express'
import { authMid } from '../middlewares/auth.middleware.js'
import { createOrder, getMyOrder } from '../controllers/order.controller.js';
const router = express.Router()


router.post("/place", AuthMid, createOrder);
router.get("/my", authMiddleware, getMyOrder);

export default router