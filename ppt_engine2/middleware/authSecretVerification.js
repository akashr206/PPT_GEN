import { sendError } from "../utils/response.js"

const authSecretVerification = (req, res, next) => {
    const authSecret = req.headers["x-internal-secret"];
    console.log(authSecret);
    if (!authSecret || authSecret !== process.env.AUTH_SECRET) {
        return sendError(res, "Unauthorized", null, 401);
    }
    next();
}

export default authSecretVerification;