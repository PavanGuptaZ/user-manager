import bcrypt from 'bcrypt';
import UserModal from '../models/userModal.js'
import jwt from 'jsonwebtoken';

const register = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password } = req.body
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "all Fields are Required" })
        }

        const isExist = await UserModal.findOne({ email: email.toLowerCase() })
        if (isExist) {
            return res.status(409).send({ status: 'error', message: email + " is Already Exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModal({ firstname, lastname, email, password: hashPassword })
        const createdUser = await newUser.save()

        // res.status(201).json({ status: 'success', user: createdUser })
        if (createdUser) {
            next()
        } else {
            return res.status(409).send({ status: 'error', message: "Some Thing wrong on Server on server" })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "all Fields are Required" })
        }

        const isExist = await UserModal.findOne({ email: email.toLowerCase() }).lean()
        if (!isExist) {
            return res.status(409).send({ status: 'error', message: email + " is not Register" })
        }

        const passwordCheck = await bcrypt.compare(password, isExist.password)
        if (!passwordCheck) {
            return res.status(404).send({ status: 'error', message: "Check Your credentials, Password is Wrong" })
        }

        if (req.body?.stayLogin) {
            const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: '7d' })
            res.cookie(`REFRESH_TOKEN`, refreshToken, {
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            })
        }
        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })

        delete isExist.password
        res.json({ status: "success", user: { ...isExist, accessToken } })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: 'error', message: "Some Thing wrong on Server" })
    }
}

const refresh = async (req, res) => {
    try {
        const { REFRESH_TOKEN } = req.cookies

        jwt.verify(REFRESH_TOKEN, process.env.REFRESH_TOKEN, async (err, data) => {
            if (err) return res.status(403).send({ status: 'error', message: "Forbidden" })
            const user = await UserModal.findOne({ email: data.email }).lean().exec()
            if (!user) {
                return res.status(409).send({ status: 'error', message: "user is not Register" })
            }
            delete user.password
            const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })

            res.status(200).json({ status: 'success', user: { ...user, accessToken } })
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Some Thing wrong on Server" })
    }
}

const getList = async (req, res) => {
    try {
        const list = await UserModal.find().select({ firstname: 1, lastname: 1, email: 1, profileIcon: 1 }).lean()
        if (list.lenght < 1) return res.status(404).json({ status: "error", message: "no user are found" })

        res.status(200).json({ status: "success", count: list.length, usersList: list })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Some Thing wrong on Server" })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await UserModal.findOne({ _id: id }).select({ password: 0 }).lean()
        if (!user) return res.status(404).json({ status: "error", message: "no user are found with id - " + id })

        res.status(200).json({ status: "success", user })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Some Thing wrong on Server" })
    }
}
const logout = async (req, res) => {
    res.clearCookie(`REFRESH_TOKEN`, {
        sameSite: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ status: 'ok', message: "Logout Successfully" })

}
export { register, login, refresh, getList, getUserById, logout }