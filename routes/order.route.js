import express from 'express'
import { authMid } from '../middlewares/auth.middleware.js'
import { createOrder, getMyOrder } from '../controllers/order.controller.js';
const router = express.Router()


router.post("/place", authMid, createOrder);
router.get("/my", authMid, getMyOrder);

export default router