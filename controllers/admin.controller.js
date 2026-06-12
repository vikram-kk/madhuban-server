import User from "../models/User.model.js"

export const allUsers = async (req, res) => {
    try {
        const users = await User.find({})
        if (users.length === 0) {
            return res.status(404).json({
                message: `no users found`,
                success: false
            })
        }
        res.status(200).json({
            message: `users found`,
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: `internal server error in getting all users : ${error.message}`,
            success: false
        })
    }
}

export const delUser = async (req, res) => {
    try {
        const userId = req.params.userId
        const del = await User.deleteOne({ _id: userId })
        if (del.deletedCount !== 1) {
            return res.status(404).json({
                message: `user not found`,
                success: false,
            })
        }

        res.status(200).json({
            message: `user revoked`,
            success: true,
        })

    } catch (error) {
        return res.status(500).json({
            message: `internal server error in deleting users : ${error.message}`,
            success: false
        })
    }
}