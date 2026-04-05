import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";


//add to cart controller 
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            })
        }
        const userId = req.user._id;
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "product not found/available"
            })
        }
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock available"
            })
        }
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = await Cart.create({
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

//get cart 
export const getCart = async (req, res) => {
    try {
        let total = 0;
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({
                message: `cart not found`
            })
        }
        cart.items.forEach(item => {
            total += item.product.price * item.quantity;
        });
        res.status(200).json({
            message: 'cart found',
            cart,
            total
        })
    } catch (error) {
        res.status(500).json({
            message: `internal server error : ${error.message}`
        })
    }
}


// update quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            })
        }
        const product = await Product.findById(productId)
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Exceeds available stock"
            })
        }
        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({
                message: `not found`
            })
        }

        const item = cart.items.find(
            items => items.product.toString() === productId
        )

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        item.quantity = quantity;

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: `internal server error : ${error.message}`
        })
    }
}

//remove item 

export const removeItem = async (req, res) => {
    try {
        const { productId } = req.body
        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({
                message: `cart not found`
            })
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId)
        await cart.save()
        res.status(200).json({
            message: `item removed `,
            cart
        })

    } catch (error) {
        res.status(500).json({
            message: `internal server at remove item : ${error.message}`
        })
    }
}