import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    MRP: {
        type: Number
    },

    discount: {
        type: Number // %
    },

    images: [String],

    category: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    specifications: {
        type: Map,
        of: String
    },

    ratings: {
        type: Number,
        default: 0
    },

    numReviews: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema)
export default Product