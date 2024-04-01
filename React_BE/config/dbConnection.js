import mongoose from "mongoose"


const connectDb = async () => {
    try {
        mongoose.connect(process.env.DATEBASE_URL)
    } catch (err) {
        console.log(err)
    }
}
export default connectDb