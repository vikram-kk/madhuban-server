import express from 'express'
import { authMid } from '../middlewares/auth.middleware.js'
import { createOrder, getAllOrders, getMyOrder, updateOrderStatus } from '../controllers/order.controller.js';
import { roleMid } from '../middlewares/role.middleware.js';
import { deleteProduct } from '../controllers/product.controller.js';
const router = express.Router()


router.post("/place", authMid, createOrder);
router.get("/my", authMid, getMyOrder);
router.patch("/:orderId", authMid, roleMid("admin"), updateOrderStatus);
router.get("/all", authMid, roleMid("admin"), getAllOrders)


export default router