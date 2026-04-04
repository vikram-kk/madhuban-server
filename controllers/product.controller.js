import mongoose from 'mongoose'


import Product from '../models/Product.model.js'

// get product from query
export const getProducts = async (req, res) => {
    try {

        const { keyword, maxPrice, minPrice } = req.query
        let query = {}
        // adding keyword in query 
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }
        // adding price filter/range in query

        if (maxPrice && minPrice) {
            query.price = {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            }
        }
        // finding products
        const products = await Product.find(query);
        res.status(200).json({
            message: "products list",
            products
        })
    } catch (error) {
        res.status(404).json({
            message: `not found : ${error.message}`
        })
    }

}

// create product 
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        if (!product) {
            return res.status(400).json({
                message: "product field invalid"
            })
        }
        res.status(201).json({
            message: "product created",
            product
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//get single product 
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }
        res.status(200).json({
            message: "product found",
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: `error at product controller : ${error.message}`
        })
    }
}

// update product 
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true }
        )
        res.status(201).json({
            message: 'product updated',
            product
        })

    } catch (error) {
        return res.status(500).json({
            message: `error at updateproduct : ${error.message}`
        })
    }
}


//delete product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};