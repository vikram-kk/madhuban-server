import express from "express";
import { authMid } from "../middlewares/auth.middleware.js";
import { createAddress, deleteAddress, userAddresses } from "../controllers/address.controller.js";

const router = express.Router()

router.get('/', authMid, userAddresses)
router.post('/', authMid, createAddress)
router.delete('/:addressId', authMid, deleteAddress)


export default router