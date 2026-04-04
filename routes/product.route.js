import express from 'express'
import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/product.controller.js'
import { authMid } from '../middlewares/auth.middleware.js'
import { roleMid } from '../middlewares/role.middleware.js'

const router = express.Router()


router.get("/", getProducts)
router.get("/:productId", getProductById)
router.post("/createProduct", authMid, roleMid('admin'), createProduct)
router.patch("/update/:id", authMid, roleMid('admin'), updateProduct)
router.delete("/delete/:id", authMid, roleMid('admin'), getProductById)


export default router