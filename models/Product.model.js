import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    details: {
        information: {
            Brand: String,
            Manufacturer: String,
            weight: String,
            Packer: String
        },
        style: {
            color: String,
            included: String
        }
    },
    price: {
        type: Number,

        required: true
    },
    MRP: {
        type: Number

    },
    discount: Number,
    images: [String],
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }

})