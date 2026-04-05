import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";


//add to cart controller 
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "product not found/available"
            })
        }
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            const cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: quantity }]
            })
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save()
        }
        res.status(200).json({
            message: `product added to cart`,
            cart
        })
    } catch (error) {
        res.status(500).json({
            message: `internal server error`
        })
    }

}

