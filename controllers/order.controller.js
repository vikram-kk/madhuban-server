import Cart from "../models/Cart.model"
import Order from "../models/Order.model"


// create order
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body
        const userId = req.user._id
        const cart = await Cart.findOne({ user: userId }).populate('items.product')
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({
                message: `cart is empty`,
                success: false,
            })
        }



        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images?.[0] || ""
        }))

        const totalPrice = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        });


        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: `internal server error : ${error.message}`
        })
    }
}


//get my order controller 

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id
        const orders = await Order.find({ user: userId }).populate("items.product")
        if (!orders) {
            return res.status(404).json({
                message: `you have not placed any order yet`,
                success: false
            })
        }
        res.status(200).json({
            message: `oders found`,
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            message: `internal server error : ${error.message}`,
            success: false
        })
    }

}

//get specific order 
export const getOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Order found",
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            message: `Internal server error: ${error.message}`
        });
    }
};