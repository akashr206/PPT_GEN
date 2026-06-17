import { nanoid } from "nanoid";
import { supabase } from "../utils/getClient.js";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fetchUserImages = async ({ user_id }) => {
    try {
        const { data, error } = await supabase.from("library_images").select("*").eq("user_id", user_id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching user images:", error);
        return [];
    }
}

export const createImage = async ({ user_id, name, url, size }) => {
    try {
        const { data, error } = await supabase.from("library_images").insert({
            user_id,
            name: name,
            url: url,
            size,
        })
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating image:", error);
        return null;
    }
}

export const deleteImage = async ({ id }) => {
    try {
        const { data, error } = await supabase.from("library_images").delete().eq("id", id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error deleting image:", error);
        return null;
    }
}

export const fetchImageById = async ({ id, user_id }) => {
    try {
        const { data, error } = await supabase.from("library_images").select("*").eq("id", id).eq("user_id", user_id).single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching image by ID:", error);
        return null;
    }
}

export const fetchUserIcons = async ({ user_id }) => {
    try {
        const { data, error } = await supabase.from("library_icons").select("*").eq("user_id", user_id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching user icons:", error);
        return [];
    }
}

export const createIcon = async ({ user_id, name, icon_type, icon_content }) => {
    try {
        const { data, error } = await supabase.from("library_icons").insert({
            user_id,
            name,
            icon_type,
            icon_content,
        }).select().single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating icon:", error);
        return null;
    }
}

export const fetchIconById = async ({ id, user_id }) => {
    try {
        const { data, error } = await supabase.from("library_icons").select("*").eq("id", id).eq("user_id", user_id).single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching icon by ID:", error);
        return null;
    }
}

export const deleteIcon = async ({ id }) => {
    try {
        const { data, error } = await supabase.from("library_icons").delete().eq("id", id).select().single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error deleting icon:", error);
        return null;
    }
}

export const uploadToStorage = async (folder, file) => {
    return new Promise((resolve, reject) => {
        const fileId = nanoid();
        const folderPath = `broadside/${folder}`;
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderPath,
                public_id: fileId,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(file.buffer);
    });
}

export const getPublicIdFromUrl = (url) => {
    try {
        if (!url) return null;
        // Example: https://res.cloudinary.com/cloud-name/image/upload/v1612345678/library/images/file_id.jpg
        const splitUrl = url.split('/upload/');
        if (splitUrl.length < 2) return null;
        
        let pathWithExtension = splitUrl[1];
        // Remove version prefix (e.g., v12345678/) if it exists
        if (pathWithExtension.startsWith('v')) {
            const index = pathWithExtension.indexOf('/');
            if (index !== -1) {
                pathWithExtension = pathWithExtension.substring(index + 1);
            }
        }
        
        // Remove file extension
        const lastDot = pathWithExtension.lastIndexOf('.');
        if (lastDot !== -1) {
            return pathWithExtension.substring(0, lastDot);
        }
        return pathWithExtension;
    } catch (error) {
        console.error("Error parsing Cloudinary public ID:", error);
        return null;
    }
}

export const deleteFromStorage = async (url) => {
    try {
        const publicId = getPublicIdFromUrl(url);
        if (!publicId) return false;
        
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary deletion result for ${publicId}:`, result);
        return result.result === 'ok';
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        return false;
    }
}

export const calculateUserStorageUsed = async ({ user_id }) => {
    try {
        const images = await fetchUserImages({ user_id });
        const totalSize = images.reduce((acc, img) => acc + (img.size || 0), 0);
        return totalSize;
    } catch (error) {
        console.error("Error calculating user storage used:", error);
        return 0;
    }
}