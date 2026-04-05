import express from 'express'

import { authMid } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.get("/", authMid, getCart);
router.post("/add", authMid, addToCart);
router.patch("/update", authMid, updateCartItem);
router.delete("/remove", authMid, removeItem);

export default router