import {
    fetchUserImages,
    createImage,
    deleteImage,
    fetchImageById,
    uploadToStorage,
    fetchUserIcons,
    createIcon,
    deleteIcon,
    fetchIconById,
    deleteFromStorage,
    calculateUserStorageUsed
} from "../services/library.js"
import { sendSuccess, sendError } from "../utils/response.js";

const mapIconResponse = (icon) => {
    if (!icon) return null;
    return {
        id: icon.id,
        name: icon.name,
        iconType: icon.icon_type,
        iconContent: icon.icon_content,
        createdAt: icon.created_at,
    };
};

export const getImages = async (req, res) => {
    try {
        const { userId } = req.user;
        const images = await fetchUserImages({ user_id: userId });
        sendSuccess(res, { images })
    } catch (error) {
        sendError(res, "Error fetching images", error);
    }
}

export const uploadImage = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." })
        }
        
        const size = req.file.size;
        
        // Capacity check (100 MB storage limit)
        const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024;
        const totalUsed = await calculateUserStorageUsed({ user_id: userId });
        if (totalUsed + size > STORAGE_LIMIT_BYTES) {
            return res.status(400).json({ 
                error: `Upload limit exceeded. You have used ${(totalUsed / (1024 * 1024)).toFixed(2)} MB of your 100 MB storage capacity limit.` 
            });
        }
        
        const name = req.file.originalname;
        const url = await uploadToStorage("images", req.file);
        await createImage({ user_id: userId, name, url, size });
        sendSuccess(res, { url })
    } catch (error) {
        console.log("Error : ", error);
        
        sendError(res, "Error uploading image", error);
    }
}

export const removeImage = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const imageExists = await fetchImageById({ id, user_id: userId });
        if (!imageExists) return sendError(res, "Image not found");
        
        if (imageExists.url) {
            await deleteFromStorage(imageExists.url);
        }
        
        const image = await deleteImage({ id });
        sendSuccess(res, { image })
    } catch (error) {
        sendError(res, "Error deleting image", error);
    }
}

export const getIcons = async (req, res) => {
    try {
        const { userId } = req.user;
        const icons = await fetchUserIcons({ user_id: userId });
        const formattedIcons = icons.map(mapIconResponse);
        sendSuccess(res, formattedIcons);
    } catch (error) {
        sendError(res, "Error fetching icons", error);
    }
}

export const uploadIcon = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." })
        }
        const name = req.body.name || req.file.originalname;
        const iconType = (req.file.mimetype === "image/svg+xml" || req.file.originalname.toLowerCase().endsWith(".svg")) ? "svg" : "image";
        
        // Capacity check (100 MB storage limit) for binary icon uploads
        if (iconType !== "svg") {
            const size = req.file.size;
            const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024;
            const totalUsed = await calculateUserStorageUsed({ user_id: userId });
            if (totalUsed + size > STORAGE_LIMIT_BYTES) {
                return res.status(400).json({ 
                    error: `Upload limit exceeded. You have used ${(totalUsed / (1024 * 1024)).toFixed(2)} MB of your 100 MB storage capacity limit.` 
                });
            }
        }
        
        let iconContent = "";
        if (iconType === "svg") {
            iconContent = req.file.buffer.toString("utf-8");
        } else {
            iconContent = await uploadToStorage("icons", req.file);
        }
        
        const icon = await createIcon({ user_id: userId, name, icon_type: iconType, icon_content: iconContent });
        if (!icon) {
            return sendError(res, "Failed to save icon");
        }
        sendSuccess(res, mapIconResponse(icon), "Icon uploaded successfully", 201);
    } catch (error) {
        sendError(res, "Error uploading icon", error);
    }
}

export const removeIcon = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const iconExists = await fetchIconById({ id, user_id: userId });
        if (!iconExists) return sendError(res, "Icon not found");
        
        if (iconExists.icon_type === "image" && iconExists.icon_content) {
            await deleteFromStorage(iconExists.icon_content);
        }
        
        const icon = await deleteIcon({ id });
        sendSuccess(res, mapIconResponse(icon), "Icon deleted successfully");
    } catch (error) {
        sendError(res, "Error deleting icon", error);
    }
}