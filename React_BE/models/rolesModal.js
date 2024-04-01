import mongoose from "mongoose";


const rolesModal = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 10,
        lowercase: true,
    },
    projects: {
        type: Boolean,
        required: true,
        default: false
    },
    tasks: {
        type: Boolean,
        required: true,
        default: false
    },
    timesheet: {
        type: Boolean,
        required: true,
        default: false
    },
    leaders: {
        type: Boolean,
        required: true,
        default: false
    },
    our_clients: {
        type: Boolean,
        required: true,
        default: false
    },
    clients: {
        type: Boolean,
        required: true,
        default: false
    },
    client_profile: {
        type: Boolean,
        required: true,
        default: false
    },
    employees: {
        type: Boolean,
        required: true,
        default: false
    },
    members: {
        type: Boolean,
        required: true,
        default: false
    },
    holidays: {
        type: Boolean,
        required: true,
        default: false
    },
    attendance: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

export default new mongoose.model('roles', rolesModal)
