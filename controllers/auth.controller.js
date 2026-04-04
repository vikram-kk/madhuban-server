// imports
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from "../models/User.model.js";

//register controller 
export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        // check for all fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "enter all fields" })
        }

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password too short" });
        }
        //existing user check 
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "user already exist" })
        }
        //hashed password
        const hashedpass = await bcrypt.hash(password, 10)
        //creating the user
        const user = await User.create({
            name: name,
            phone: phone,
            password: hashedpass,
            email: email
        })
        // checking if user got created or not
        if (!user) {
            return res.status(500).json({ message: "failed registring the user" })
        }

        const userObj = user.toObject()
        const { password: _pw, ...resUser } = userObj;
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '24h' })
        return res.status(201).json({ message: "user created successfully", resUser, token })
    } catch (error) {
        res.status(500).json({ message: `Internal server error in register API: ${error.message}` })
    }


}


//login controller 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        //checking email and password
        if (!email || !password) {
            return res.status(401).json({ message: "please provide required information" })
        }

        // finding the user
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({ message: "enter valid email and password" })
        }

        // hashed password from the db
        const userPass = existingUser.password
        // checking the hashedpass and user password are same or not 
        const isMatch = await bcrypt.compare(password, userPass)
        if (!isMatch) {
            return res.status(401).json({ message: "enter valid email and password" })
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_TOKEN, { expiresIn: '24h' })
        const resUser = existingUser.toObject()
        delete resUser.password
        return res.status(200).json({
            message: "User found and logged In",
            token,
            user: resUser
        })
    } catch (error) {
        res.status(500).json({ message: `internal server error : ${error.message}` })
    }
}



//update profile controller 
export const updateProfile = async (req, res) => {
    // authnecticated user 
    try {
        // form here we found the data that we want to update or modify
        const { fieldToUpdate, newValue } = req.body
        // here we are finding the user 
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        //check whether user is demanding the right field to update 
        const restricted = ['password', 'role'];
        if (restricted.includes(fieldToUpdate)) {
            return res.status(403).json({ message: "Cannot update restricted fields here" });
        }
        // changing the field in the user object 
        user[fieldToUpdate] = newValue
        //saving the changes will finally store the change in the db
        await user.save()
        const updatedUser = user.toObject()
        delete updatedUser.password
        return res.status(200).json({
            message: "user updated successfully",
            user: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: `internal server error : ${error.message}`
        })
    }
}



//logout controller 
const logout = async (req, res) => {

}


//me controller 
export const findme = async (req, res) => {
    try {
        return res.status(200).json({
            message: "User found",
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });
    }
};