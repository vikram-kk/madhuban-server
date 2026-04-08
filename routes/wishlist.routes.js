import express from 'express'
import { authMid } from '../middlewares/auth.middleware.js';
import { addToWishlist, getWishlist, removeWishlist } from '../controllers/wishlist.controller.js';
const router = express.Router()


router.post("/", authMid, addToWishlist);
router.get("/", authMid, getWishlist);
router.delete("/:productId", authMid, removeWishlist);

export default router