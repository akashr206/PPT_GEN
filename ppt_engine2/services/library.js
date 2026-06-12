import { nanoid } from "nanoid";
import { supabase } from "../utils/getClient.js";
import path from "path"

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
    const fileId = nanoid();
    const { data: uploadData, error } = await supabase.storage.from("library").upload(`${folder}/${fileId}${path.extname(file.originalname)}`, file.buffer, {
        contentType: file.mimetype, 
        upsert: false,
        cacheControl: 'max-age=31536000, public',
    });
    if (error) throw error;
    const { data } = supabase.storage.from("library").getPublicUrl(`${folder}/${fileId}${path.extname(file.originalname)}`);
    return data.publicUrl;
}