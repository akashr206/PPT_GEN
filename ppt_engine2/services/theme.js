import { supabase } from "../utils/getClient.js";

export const fetchUserThemes = async ({ user_id }) => {
    try {
        const { data, error } = await supabase
            .from("custom_themes")
            .select("*")
            .eq("user_id", user_id);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching user themes:", error);
        throw error;
    }
};

export const createTheme = async ({
    user_id,
    name,
    bg,
    bg_alt,
    fg,
    fg_muted,
    primary_color,
    secondary,
    accent,
    card_bg,
    card_border,
    bullet,
    font_heading,
    font_body
}) => {
    try {
        const { data, error } = await supabase
            .from("custom_themes")
            .insert([
                {
                    user_id,
                    name,
                    bg,
                    bg_alt,
                    fg,
                    fg_muted,
                    primary_color,
                    secondary,
                    accent,
                    card_bg,
                    card_border,
                    bullet,
                    font_heading,
                    font_body
                }
            ])
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating custom theme:", error);
        throw error;
    }
};

export const fetchThemeById = async ({ id, user_id }) => {
    try {
        const { data, error } = await supabase
            .from("custom_themes")
            .select("*")
            .eq("id", id)
            .eq("user_id", user_id)
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching theme by ID:", error);
        throw error;
    }
};

export const deleteTheme = async ({ id, user_id }) => {
    try {
        const { data, error } = await supabase
            .from("custom_themes")
            .delete()
            .eq("id", id)
            .eq("user_id", user_id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error deleting custom theme:", error);
        throw error;
    }
};

export const updateTheme = async ({
    id,
    user_id,
    name,
    bg,
    bg_alt,
    fg,
    fg_muted,
    primary_color,
    secondary,
    accent,
    card_bg,
    card_border,
    bullet,
    font_heading,
    font_body
}) => {
    try {
        const { data, error } = await supabase
            .from("custom_themes")
            .update({
                name,
                bg,
                bg_alt,
                fg,
                fg_muted,
                primary_color,
                secondary,
                accent,
                card_bg,
                card_border,
                bullet,
                font_heading,
                font_body
            })
            .eq("id", id)
            .eq("user_id", user_id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error updating custom theme:", error);
        throw error;
    }
};

