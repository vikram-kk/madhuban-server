import mongoose from 'mongoose'
// import User from './User.model'


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },


    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
            quantity: { type: Number, required: true, min: 1 },
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
    deliveredAt: Date

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema)
export default Order