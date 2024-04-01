import mongoose, { Schema } from "mongoose";


const userModal = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 30
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileIcon: {
        type: Number,
        default: 1
    },
    mobile: {
        type: Number,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    }
}, { timestamps: true })

export default new mongoose.model('user', userModal)
