import mongoose from 'mongoose'
import cloudinary from '../configurations/cloudinary.config.js'

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
        const obj = req.body
        let imgUrl;
        if (!req.file) {
            return res.status(404).json({
                message: `image not found`,
                success: false
            })
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        imgUrl = result.secure_url;
        console.log(imgUrl);

        const product = await Product.create({ ...obj, images: [imgUrl] })
        if (!product) {
            return res.status(400).json({
                message: "product field invalid"
            })
        }
        return res.status(201).json({
            message: "product created",
            product
        })


    } catch (error) {
        res.status(500).json({
            message: `error at create product : ${error.message}`
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
            //name: string;
            // price: number;
            // description: string;
            // images: string[];
            // category: string;
            // stock: number;
            // ratings: number;
            // numReviews: number;
            // MRP?: number | null | undefined;
            // discount?: number | null | undefined;
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