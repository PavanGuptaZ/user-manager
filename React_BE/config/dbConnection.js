import mongoose from "mongoose";
import dotEnv from 'dotenv';
dotEnv.config()

const connectDb = async () => {
    try {
        mongoose.connect(process.env.DATEBASE_URL)
    } catch (err) {
        console.log(err)
    }
}
export default connectDb