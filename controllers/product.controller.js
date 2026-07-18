import mongoose from 'mongoose'
import cloudinary from '../configurations/cloudinary.config.js'
import fs from "fs";
import Product from '../models/Product.model.js'

// 1. Get products list with basic filters
export const getProducts = async (req, res) => {
    try {
        const { keyword, maxPrice, minPrice } = req.query;
        let query = {};

        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        if (maxPrice && minPrice) {
            query.price = {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            };
        }

        const products = await Product.find(query);
        return res.status(200).json({
            message: "products list",
            products
        });
    } catch (error) {
        return res.status(404).json({
            message: `not found : ${error.message}`
        });
    }
};

// 2. Create product 
export const createProduct = async (req, res) => {
    try {
        const obj = { ...req.body };

        if (!req.file) {
            return res.status(400).json({
                message: `image not found`,
                success: false
            });
        }

        if (obj.specifications) {
            obj.specifications = { ...obj.specifications };
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        const imgUrl = result.secure_url;

        const product = await Product.create({ ...obj, images: [imgUrl] });


        fs.unlinkSync(req.file.path);

        if (!product) {
            return res.status(400).json({
                message: "product field invalid"
            });
        }

        return res.status(201).json({
            message: "product created",
            product
        });
    } catch (error) {
        // Clean up local file if Cloudinary/Database throws an error mid-flight
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            message: `error at create product : ${error.message}`
        });
    }
};

// 3. Get single product 
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            });
        }
        return res.status(200).json({
            message: "product found",
            product
        });
    } catch (error) {
        return res.status(500).json({
            message: `error at product controller : ${error.message}`
        });
    }
};

// 4. Advanced search endpoint (Fixed Crashes & Typos)
export const serachProduct = async (req, res) => {
    try {
        // FIXED: Destructured missing fields from req.query
        const { search, category, minPrice, maxPrice, sort } = req.query;

        const filter = {};
        const sortObj = {};

        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (category) {
            filter.category = category;
        }

        if (sort) {
            switch (sort) {
                case "price_asc":
                    sortObj.price = 1;
                    break;
                case "price_desc":
                    sortObj.price = -1;
                    break;
                case "newest":
                    sortObj.createdAt = -1;
                    break;
                case "rating":
                    sortObj.ratings = -1;
                    break;
                default:
                    sortObj.createdAt = -1;
            }
        } else {
            sortObj.createdAt = -1;
        }

        const product = await Product.find(filter).sort(sortObj);

        if (!product || product.length === 0) {
            return res.status(404).json({
                message: `product not found`,
                success: false
            });
        }

        return res.status(200).json({
            message: `Product found`,
            product,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: `internal error at search product : ${error.message}`
        });
    }
};

// 5. Update Product (Fixed File leak)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            if (req.file) fs.unlinkSync(req.file.path); // Clean leak if not found
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        Object.assign(product, req.body);

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.images = [result.secure_url];
            fs.unlinkSync(req.file.path);
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: `error at : ${error.message}`
        });
    }
};

// 6. Delete Product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        return res.json({ message: "Product deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};