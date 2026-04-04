import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("db connected")
    } catch (error) {
        console.log("db connection failed")
    }

}
export default connectDb