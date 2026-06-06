import Cart from "../models/Cart.model.js"
import Order from "../models/Order.model.js"


// create order
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({
                message: "Shipping address and payment method required",
                success: false
            });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false
            });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images?.[0] || ""
        }));

        const totalPrice = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            orderStatus: "processing"
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
};

//get my order controller 

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id
        const orders = await Order.find({ user: userId }).populate("items.product")
        if (orders.length === 0) {
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

        if (!orders) {
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

// cancle order controller
export const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        if (["shipped", "delivered"].includes(order.orderStatus)) {
            return res.status(400).json({
                message: "Order cannot be cancelled now",
                success: false
            });
        }

        order.orderStatus = "cancelled";
        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
};
// get all orders for admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({
                message: "No orders found",
                success: false
            });
        }

        res.status(200).json({
            message: "Orders found",
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
};


//update order status
export const updateOrder = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const orderId = req.params.orderId;

        const statusFlow = {
            processing: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: []
        };
        const allowedStatus = ["processing", "shipped", "delivered", "cancelled"]

        if (!allowedStatus.includes(orderStatus)) {
            return res.status(400).json({
                message: `enter valid status`,
                success: false
            })
        }


        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({
                message: `order not found`,
                success: false
            })
        }
        if (order.orderStatus === orderStatus) {
            return res.status(400).json({
                message: "Order already has this status",
                success: false
            });
        }
        const currentStatus = order.orderStatus;

        if (!statusFlow[currentStatus].includes(orderStatus)) {
            return res.status(400).json({
                message: "Invalid status transition",
                success: false
            });
        }

        order.orderStatus = orderStatus
        await order.save()
        res.status(200).json({
            message: `order status updated`,
            success: true,
            order
        })
    } catch (error) {

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
}