import Router from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getImages,
    uploadImage,
    removeImage,
    getIcons,
    uploadIcon,
    removeIcon
} from "../controllers/library.js"
import { imageUpload, iconUpload } from "../utils/multerConfig.js";

const router = Router();

router.use(authMiddleware)

router.get("/images", authMiddleware, getImages);
router.post("/images/upload", authMiddleware, imageUpload.single("file"), uploadImage);
router.delete("/images/:id", authMiddleware, removeImage);

router.get("/icons", authMiddleware, getIcons);
router.post("/icons/upload", authMiddleware, iconUpload.single("file"), uploadIcon);
router.delete("/icons/:id", authMiddleware, removeIcon);

export default router;