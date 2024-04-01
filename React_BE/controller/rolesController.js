import rolesModal from '../models/rolesModal.js';
import RoleModal from '../models/rolesModal.js';
import userModal from '../models/userModal.js';
import { isValidObjectId } from 'mongoose'

export const GetAllRoles = async (req, res) => {
    try {
        const rolesList = await RoleModal.find()

        if (rolesList.length < 1) return res.status(404).json({ status: "error", message: "no role are found" })


        res.status(200).json({ status: "success", count: rolesList.length, rolesList })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}

export const GetAllRolesNames = async (req, res) => {
    try {
        const roleNames = await RoleModal.find().select({ name: 1 }).lean()

        if (roleNames.length < 1) return res.status(404).json({ status: "error", message: "no role are found" })


        res.status(200).json({ status: "success", count: roleNames.length, rolesList: roleNames })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}

export const GetRolesById = async (req, res) => {
    try {

        const { id } = req.params;

        const existingRole = await RoleModal.findById(id)

        if (!existingRole) return res.status(404).json({ status: 'error', message: "Role not found" });

        res.status(200).json({ status: "success", roles: existingRole })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }

}

export const AddRoles = async (req, res) => {
    try {

        const { name } = req.body
        if (!name) return res.status(400).json({ status: 'error', message: "name Fields is Required" })


        let isExist = await RoleModal.find({ name }).lean()

        if (isExist.length > 0) {
            return res.status(409).send({ status: 'error', message: name + " is already Register" })
        }

        const role = new RoleModal({ name })
        let newRole = await role.save()

        res.status(200).json({ status: "success", newRole })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}

export const UpdateRoleById = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            projects,
            tasks,
            timesheet,
            leaders,
            our_clients,
            clients,
            client_profile,
            employees,
            members,
            holidays,
            attendance
        } = req.body

        if (typeof projects !== 'boolean' || typeof tasks !== 'boolean' || typeof timesheet !== 'boolean' ||
            typeof leaders !== 'boolean' || typeof our_clients !== 'boolean' || typeof clients !== 'boolean' ||
            typeof client_profile !== 'boolean' || typeof employees !== 'boolean' || typeof members !== 'boolean' ||
            typeof holidays !== 'boolean' || typeof attendance !== 'boolean') {
            return res.status(404).json({ status: 'error', message: "All Fields are Required" });
        }

        const existingRole = await RoleModal.findById(id)

        if (!existingRole) return res.status(404).json({ status: 'error', message: "Role not found" });


        const updatedRole = await RoleModal.findByIdAndUpdate(id, {
            projects,
            tasks,
            timesheet,
            leaders,
            our_clients,
            clients,
            client_profile,
            employees,
            members,
            holidays,
            attendance
        }, { new: true }).lean()

        res.status(200).json({ status: 'success', updatedRole });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}

export const ChangeRoleById = async (req, res) => {
    try {

        const { id, roleInput } = req.body;

        if (!id || !roleInput) return res.status(400).json({ status: 'error', message: "All field are required" });

        if (!isValidObjectId(id) || !isValidObjectId(roleInput)) {
            return res.status(400).json({ status: 'error', message: "Invalid ID format" });
        }
        const existingRole = await RoleModal.findById(roleInput)

        const existingUser = await userModal.findById(id)

        if (!existingRole) return res.status(404).json({ status: 'error', message: "Role not found" });
        if (!existingUser) return res.status(404).json({ status: 'error', message: "User not found" });


        const updatedUser = await userModal.findByIdAndUpdate(id, { role: roleInput }, { new: true }).lean()

        res.status(200).json({ status: 'success', updatedRole: updatedUser });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}
export const GetUserRoleById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) return res.status(400).json({ status: 'error', message: "All field are required" });

        if (!isValidObjectId(id)) {
            return res.status(400).json({ status: 'error', message: "Invalid ID format" });
        }

        const existingUser = await userModal.findById(id)

        if (!existingUser) return res.status(404).json({ status: 'error', message: "User not found" });

        if (!existingUser.role) return res.status(404).json({ status: 'error', message: "No role is assigned to this user" });

        if (!isValidObjectId(existingUser.role)) {
            return res.status(400).json({ status: 'error', message: "Invalid ID format" });
        }

        const role = await rolesModal.findById(existingUser.role).lean()

        if (!role) return res.status(404).json({ status: 'error', message: "Role not found" });


        res.status(200).json({ status: 'success', role });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}

export const DeleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const existingRole = await RoleModal.findById(id)

        if (!existingRole) return res.status(404).json({ status: 'error', message: "Role not found" });

        const deletedRole = await RoleModal.findOneAndDelete(id)

        res.status(200).json({ status: 'success', role: `role with name - ${deletedRole?.name} is deleted` });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })

    }
}