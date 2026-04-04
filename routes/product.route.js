import express from 'express'
import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/product.controller.js'
import { authMid } from '../middlewares/auth.middleware.js'
import { roleMid } from '../middlewares/role.middleware.js'

const router = express.Router()


router.post("/createProduct", authMid, roleMid('admin'), createProduct)
router.get("/products", getProducts)
router.get("/products/:id", getProductById)
router.get("/products/update/:id", authMid, roleMid('admin'), updateProduct)
router.delete("/products/delete/:id", authMid, roleMid('admin'), getProductById)


export default router