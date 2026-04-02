// imports
import bcrypt from 'bcrypt'


import User from "../models/User.model";

//register controller 
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        // check for all fields
        if (!name || !email || !passowrd || !phone) {
            return res.status(400).json({ message: "enter all fields" })
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
            return res.status(402).json({ message: "failed registring the user" })
        }

        const userObj = user.toObject()
        const { password: _pw, ...resUser } = userObj;
        return res.status(200).json({ message: "user created successfully", resUser })
    } catch (error) {
        res.json({ message: "Internal server error in register API" })
    }


}


//login controller 
const login = async (req, res) => {
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
        return res.status(200).json({ message: "User found and logged In" })
    } catch (error) {
        res.status(500).json({ message: `internal server error : ${error.message}` })
    }
}