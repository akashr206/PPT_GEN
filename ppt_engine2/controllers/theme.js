import {
    fetchUserThemes,
    createTheme,
    deleteTheme,
    updateTheme
} from "../services/theme.js";
import { sendSuccess, sendError } from "../utils/response.js";


export const getThemes = async (req, res) => {
    try {
        const { userId } = req.user;
        const themes = await fetchUserThemes({ user_id: userId });
        sendSuccess(res, themes);
    } catch (error) {
        sendError(res, "Error fetching themes", error);
    }
};

export const postTheme = async (req, res) => {
    try {
        const { userId } = req.user;
        const {
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
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Theme name is required." });
        }

        const theme = await createTheme({
            user_id: userId,
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
        });

        sendSuccess(res, theme, "Theme created successfully", 201);
    } catch (error) {
        sendError(res, "Error creating theme", error);
    }
};

export const removeTheme = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const theme = await deleteTheme({ id, user_id: userId });
        sendSuccess(res, theme, "Theme deleted successfully");
    } catch (error) {
        sendError(res, "Error deleting theme", error);
    }
};

export const patchTheme = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const {
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
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Theme name is required." });
        }

        const theme = await updateTheme({
            id,
            user_id: userId,
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
        });

        sendSuccess(res, theme, "Theme updated successfully");
    } catch (error) {
        sendError(res, "Error updating theme", error);
    }
};
