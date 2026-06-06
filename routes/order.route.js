import express from 'express'
import { authMid } from '../middlewares/auth.middleware.js'
import { createOrder, getMyOrder, updateOrderStatus } from '../controllers/order.controller.js';
import { roleMid } from '../middlewares/role.middleware.js';
const router = express.Router()


router.post("/place", authMid, createOrder);
router.get("/my", authMid, getMyOrder);
router.patch("/:orderId", authMid, roleMid("admin"), updateOrderStatus);

export default router