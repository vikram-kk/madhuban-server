import express from 'express'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/product.controller.js'
import { authMid } from '../middlewares/auth.middleware.js'
import { roleMid } from '../middlewares/role.middleware.js'
import upload from '../utils/multer.utlis.js'

const router = express.Router()


router.get("/", getProducts)
router.get("/:productId", getProductById)
router.post("/create", authMid, roleMid('admin'), upload.single('image'), createProduct)
router.put("/update/:id", authMid, roleMid('admin'), upload.single('image'), updateProduct)
router.delete("/:id", authMid, roleMid('admin'), deleteProduct)


export default router