import Wishlist from "../models/Wishlist.model.js"
import Product from "../models/Product.model.js"


// add to wishlist 
export const addToWishlist = async (req, res) => {
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
                products: [productId]

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
            message: `internal server error at addTowishlist : ${error.message}`
        })
    }

}

// get wishlist 
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products", "name price image stock")
        if (!wishlist) {
            return res.status(404).json({
                message: `wishlist not found`
            })
        }
        res.status(200).json({
            message: `wishlist found`,
            wishlist
        })
    } catch (error) {
        res.status(500).json({
            message: `internal server at getWishlist : ${error.message}`
        })
    }
}

// //remove from wishlist 
// export const removeWishlist = async (req, res) => {
//     try {
//         const userId = req.user._id
//         const { productId } = req.params
//         const product = await Product.findById(productId)
//         if (!product) {
//             return res.status(404).json({
//                 message: `product not found`,
//                 success: false
//             })
//         }
//         const wishlist = await Wishlist.findOne({ user: userId })
//         if (!wishlist) {
//             return res.status(404).json({
//                 message: ` wishlist not found`,
//                 success: false
//             })
//         }
//         wishlist.products = wishlist.products.filter(items => items.toString() !== productId.toString())
//         await wishlist.save();

//         res.json({
//             message: "Item removed",
//             wishlist
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// }


export const removeWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Use findOneAndUpdate with $pull to remove the item directly
        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $pull: { products: productId } }, // This removes the ID from the array
            { new: true } // Returns the updated document
        );

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item removed from wishlist",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
}