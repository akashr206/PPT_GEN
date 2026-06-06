import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserController, addUserController } from "../controllers/user.js";
import authSecretVerification from "../middleware/authSecretVerification.js";
import { sendError, sendSuccess } from "../utils/response.js";
import jwt from "jsonwebtoken"
const router = Router();

router.get("/", authMiddleware, getUserController)
router.post("/", authSecretVerification, addUserController)

router.post("/dev-login", (req, res, next) => {
    if (process.env.NODE_ENV !== "development") {
        return sendError(res, "Not allowed in production");
    }
    next();
},
    (req, res) => {
        const { id, email } = req.body;
        const token = jwt.sign({ userId: id, email }, process.env.AUTH_SECRET, { expiresIn: "7d" });
        sendSuccess(res, { token }, "Token generated successfully");
    }
)

export default router