import jwt from "jsonwebtoken"
import User from "../models/User.model"

// auth middleware 
export const authMid = async (req, res, next) => {
    try {
        //get token from headers
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "user not authenticated" })
        }
        //decode the token
        const decoded = await jwt.verify(token, process.env.JSW_TOKEN)
        // check whether the decoded user is i db or not 
        const user = await User.findById(decoded.id).select("-password");
        // check if user found or not 
        if (!user) {
            return res.status(401).json({
                message: "user not authenticated"
            })
        }
        //attaching the user for next req block
        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({
            message: `Invalid or expired token :${error.message}`
        })
    }
}