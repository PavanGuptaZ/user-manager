import jwt from "jsonwebtoken";
import UserModal from '../models/userModal.js'

const verifyJWT = async (req, res, next) => {
    try {
        const authHeaders = req.headers
        const authorizationHeader = authHeaders?.authorization || authHeaders?.Authorization;

        if (authorizationHeader || authorizationHeader?.startsWith('Bearer ')) {

            const ACCESS_TOKEN = typeof authorizationHeader == 'string' ? authorizationHeader.split(' ')[1] : "";

            jwt.verify(ACCESS_TOKEN, process.env.ACCESS_TOKEN, async (err, data) => {

                if (err) return res.status(401).json({ status: "error", message: "Token verification failed dd" });

                if (typeof data !== 'object' || typeof data === 'string' || data === undefined || !('email' in data)) {
                    return res.status(404).json({ status: "error", message: "Token verification failed" });
                }

                let { email } = data
                let isExist = await UserModal.findOne({ email }).lean()

                if (!isExist) {
                    return res.status(409).send({ status: 'error', message: email + " is not Register" })
                }
                req.user = isExist

                next()
            })

        } else {

            const refreshTokenCookie = req.cookies?.REFRESH_TOKEN

            if (!refreshTokenCookie) {
                return res.status(404).json({ status: 'error', message: "Please Login With credentials, Token is not Provided" })
            }

            jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN, async (err, data) => {
                if (err) return res.status(401).json({ status: "error", message: "Token verification failed" });

                if (typeof data !== 'object' || typeof data === 'string' || data === undefined || !('id' in data)) {
                    return res.status(404).json({ status: "error", message: "Token verification failed" });
                }

                let { email } = data
                let isExist = await UserModal.findOne({ email })

                if (isExist) {
                    return res.status(409).send({ status: 'error', message: email + " is not Register" })
                }
                req.user = isExist

                next()
            })
        }
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ message: error.message });
    }
}
export default verifyJWT