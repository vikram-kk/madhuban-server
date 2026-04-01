import mongoose from 'mongoose'
import User from './User.model'


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],


    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },


    paymentMethod: {
        type: String,
        enum: ["debitcard", "creditcard", "upi", "cod"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },


    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing"
    },


    totalPrice: {
        type: Number,
        required: true
    },

    deliveryCharges: {
        type: Number,
        default: 0
    },


    isPaid: {
        type: Boolean,
        default: false
    },

    paidAt: Date,

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema)
export default Order