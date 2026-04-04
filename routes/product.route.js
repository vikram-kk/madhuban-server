import express from 'express'
import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/product.controller.js'
import { authMid } from '../middlewares/auth.middleware.js'
import { roleMid } from '../middlewares/role.middleware.js'

const router = express.Router()



export default router