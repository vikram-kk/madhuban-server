import Wishlist from "../models/Wishlist.model.js"


// add to wishlist 
export const addToWhislist = async (req, res) => {
    try {
        //   let alreadyAdded = false;
        const { productId } = req.body
        const userId = req.user._id

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let wishlist = await Wishlist.findOne({ user: userId })
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [product]

            })
            return res.status(201).json({
                message: "Wishlist created and product added",
                wishlist
            });
        }
        const exists = wishlist.products.some(
            item => item.toString() === productId.toString()
        );

        if (exists) {
            return res.status(200).json({
                message: "Item already in wishlist",
                wishlist
            });
        }
        wishlist.products.push(productId)
        await wishlist.save()
        res.status(200).json({
            message: `item added to wishlist`,
            wishlist
        })

    } catch (error) {
        res.status(500).json({
            message: `internal server error at addToWihslist : ${error.message}`
        })
    }

}

// get wihslist 
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products", "name price image stock")
        if (!wishlist) {
            return res.status(404).json({
                message: `wihslist not found`
            })
        }
        res.status(200).json({
            message: `wihslist found`,
            wishlist
        })
    } catch (error) {
        res.status(500).json({
            message: `internal server at getWishlist : ${error.message}`
        })
    }
}