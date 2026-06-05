import Address from "../models/Address.model"

export const userAddresses = async (req, res) => {
    try {
        let locations = []
        const userId = req.user._id
        locations = await Address.find({ user: userId })
        if (locations.length == 0) {
            return res.status(404).json({
                message: "No address saved",
                success: false
            })
        }
        res.status(200).json({
            message: 'addresses found',
            success: true,
            locations
        }
        )

    } catch (error) {
        res.status(500).json({
            message: `error at ${error.message}`,
            success: false
        })
    }
}

export const createAddress = async (req, res) => {
    try {
        //getting address in address from object 
        const { addressForm } = req.body;
        const userId = req.user._id;
        // validating the address form 
        if (!addressForm) {
            return res.status(400).json({
                message: "Address data is required",
                success: false
            });
        }

        //validating all the feild in the adress form
        const {
            fullName,
            phone,
            street,
            city,
            state,
            pincode
        } = addressForm;

        if (
            !fullName ||
            !phone ||
            !street ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        // creating new address 
        const newAddress = await Address.create({
            user: userId,
            ...addressForm
        });

        return res.status(201).json({
            message: "Address saved successfully",
            success: true,
            address: newAddress
        });

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const userId = req.user._id;

        if (!addressId) {
            return res.status(400).json({
                message: "Choose a valid address",
                success: false
            });
        }

        const result = await Address.deleteOne({
            _id: addressId,
            user: userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Address not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Address removed successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: `Internal server error in delete address: ${error.message}`,
            success: false
        });
    }
};