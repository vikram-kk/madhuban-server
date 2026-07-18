import mongoose from 'mongoose'
import cloudinary from '../configurations/cloudinary.config.js'
import fs from "fs";


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
        const obj = { ...req.body }
        let imgUrl;
        if (!req.file) {
            return res.status(404).json({
                message: `image not found`,
                success: false
            })
        }


        if (obj.specifications) {
            obj.specifications = { ...obj.specifications };
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        imgUrl = result.secure_url;
        console.log(imgUrl);
        console.log(req.body);
        console.log(req.body.specifications);
        console.log(typeof req.body.specifications);

        const product = await Product.create({ ...obj, images: [imgUrl] })
        if (!product) {
            return res.status(400).json({
                message: "product field invalid"
            })
        }
        fs.unlinkSync(req.file.path);
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


export const serachProduct = async (req, res) => {
    try {
        const { search, category } = req.query
        // if (!search || !search.trim() || !category) {
        //     return res.status(400).json({
        //         message: "Search query is required",
        //         success: false
        //     });
        // }
        const filter = {}
        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            }
        }
        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice)
                filter.price.$gte = Number(minPrice);

            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }

        if (category) {
            filter.category = category;
        }
        const product = await Product.find(filter)
        if (!product || product.length == 0) {
            return res.status(404).json({
                message: `product not found `,
                success: false
            })
        }
        return res.status(200).json({
            message: `Product found `,
            product,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: `internal error at search product : ${error.message}`
        })
    }
}

export const updateProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        Object.assign(product, req.body);

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.images = [result.secure_url];
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `error at : ${error.message}`
        });
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