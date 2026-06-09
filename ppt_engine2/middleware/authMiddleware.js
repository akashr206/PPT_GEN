import jwt, { decode } from "jsonwebtoken";
import { sendError } from "../utils/response.js";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return sendError(res, "Unauthorized", null, 401);
    }
    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        return sendError(res, "Invalid token", error, 401);
    }
}

export default authMiddleware