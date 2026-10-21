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
    bg = "#ffffff",
    bg_alt = "#f9fafb",
    fg = "#1f2937",
    fg_muted = "#4b5563",
    primary_color = "#3b82f6",
    secondary = "#f3f4f6",
    accent = "#8b5cf6",
    card_bg = "#ffffff",
    card_border = "#e5e7eb",
    bullet = "#3b82f6",
    font_heading = '"Inter", sans-serif',
    font_body = '"Inter", sans-serif'
}) => {
    try {
        const { data, error } = await supabase
            .from("custom_themes")
            .insert([
                {
                    user_id,
                    name,
                    bg: bg || "#ffffff",
                    bg_alt: bg_alt || "#f9fafb",
                    fg: fg || "#1f2937",
                    fg_muted: fg_muted || "#4b5563",
                    primary_color: primary_color || "#3b82f6",
                    secondary: secondary || "#f3f4f6",
                    accent: accent || "#8b5cf6",
                    card_bg: card_bg || "#ffffff",
                    card_border: card_border || "#e5e7eb",
                    bullet: bullet || primary_color || "#3b82f6",
                    font_heading: font_heading || '"Inter", sans-serif',
                    font_body: font_body || '"Inter", sans-serif'
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
        const updatePayload = {};
        if (name !== undefined) updatePayload.name = name;
        if (bg !== undefined) updatePayload.bg = bg;
        if (bg_alt !== undefined) updatePayload.bg_alt = bg_alt;
        if (fg !== undefined) updatePayload.fg = fg;
        if (fg_muted !== undefined) updatePayload.fg_muted = fg_muted;
        if (primary_color !== undefined) updatePayload.primary_color = primary_color;
        if (secondary !== undefined) updatePayload.secondary = secondary || "#f3f4f6";
        if (accent !== undefined) updatePayload.accent = accent || "#8b5cf6";
        if (card_bg !== undefined) updatePayload.card_bg = card_bg;
        if (card_border !== undefined) updatePayload.card_border = card_border;
        if (bullet !== undefined) updatePayload.bullet = bullet || primary_color || "#3b82f6";
        if (font_heading !== undefined) updatePayload.font_heading = font_heading;
        if (font_body !== undefined) updatePayload.font_body = font_body;

        const { data, error } = await supabase
            .from("custom_themes")
            .update(updatePayload)
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

