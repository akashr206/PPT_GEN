import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getThemes, postTheme, removeTheme, patchTheme } from "../controllers/theme.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getThemes);
router.post("/", postTheme);
router.patch("/:id", patchTheme);
router.delete("/:id", removeTheme);

export default router;
