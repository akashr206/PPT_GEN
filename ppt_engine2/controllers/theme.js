import {
    fetchUserThemes,
    createTheme,
    deleteTheme,
    updateTheme
} from "../services/theme.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { chat } from "../utils/llmChat.js";


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

function getLuminance(hex) {
    if (!hex || typeof hex !== "string" || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
        return 0.5;
    }
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function adjustHexBrightness(hex, percent) {
    if (!hex || typeof hex !== "string" || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
        return hex;
    }
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const extractThemeFromImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Image data is required." });
        }

        const systemPrompt = `You are an elite presentation art director, UI designer, and color theorist.
Your mission is to analyze an uploaded presentation template image and extract a unified, accessible, and high-contrast color palette and font pairing that maps directly into our presentation slide rendering engine.

CRITICAL ARCHITECTURAL RULES & CSS MAPPING:
1. DETECT THEME POLARITY FIRST:
   - Identify whether the overall presentation slide canvas is DARK (dark background with light text) or LIGHT (light background with dark text).
   - If the image shows a slide deck cover, template showcase, or floating card mockups (e.g., floating white thumbnail cards on a dark backdrop), prioritize the MAIN SLIDE CANVAS BACKGROUND and HERO TITLE of the overall presentation, NOT the tiny embedded preview screenshots inside it!

2. HOW OUR CSS SLIDE ENGINE USES EACH VARIABLE:
   - bg: The main slide canvas background color.
   - primary_color: THIS COLORS THE MAIN SLIDE TITLE (.theme-heading) AND HERO ACCENTS!
     * In a DARK theme: primary_color MUST BE BRIGHT, VIBRANT, OR CRISP WHITE (e.g. #ffffff, #f8fafc, #a78bfa, #38bdf8, #fcd34d) so the title has high contrast and is effortlessly legible against the dark bg. NEVER return a dark or dull shade for primary_color in a dark theme!
     * In a LIGHT theme: primary_color MUST BE a rich, saturated, high-contrast brand color (e.g. #0284c7, #2563eb, #0f172a, #be185d).
   - fg: Primary text color for standard content.
     * Dark theme: Crisp white or off-white (#ffffff or #f8fafc).
     * Light theme: Dark charcoal or near-black (#0f172a or #111827).
   - fg_muted: Subtitles, captions, and paragraph descriptions.
     * Dark theme: Soft light silver/slate/lavender (#cbd5e1, #94a3b8, #c4b5cb) with strong contrast against dark backgrounds.
     * Light theme: Medium dark slate/grey (#475569, #4b5563).
   - card_bg: The background color of cards, container boxes, and stat boxes.
     * In a DARK theme: card_bg MUST BE A DARK ELEVATED SURFACE (typically 5%–15% lighter than bg, e.g. if bg is #231728, card_bg should be #321f37 or #2a1c2f). NEVER return white (#ffffff) for card_bg in a dark theme, because white text inside cards would become completely invisible!
     * In a LIGHT theme: Clean white (#ffffff) or soft light panel (#f8fafc).
   - card_border: Border outline for cards and dividers.
     * Dark theme: A slightly lighter subtle border (e.g. #452b4c or #3f2a48).
     * Light theme: Subtle light grey border (#e2e8f0 or #e5e7eb).
   - bg_alt: Secondary background for split panels, alternating rows, and number badges.
     * Dark theme: Slightly elevated dark shade (e.g. #3b2345).
     * Light theme: Soft light contrast shade (#f1f5f9).
   - font_heading: Best matching font from: ["Inter", "Lora", "Merriweather", "Outfit", "Playfair Display", "Poppins", "Quicksand", "Roboto"].
   - font_body: Best matching font from the same list.

You must return ONLY a raw JSON object with no markdown formatting or backticks.`;

        const userPrompt = `Analyze this presentation template image and extract its complete color system adhering strictly to our design rules.
Return a JSON object matching this exact schema:
{
  "name": "Creative Theme Name",
  "bg": "#hex",
  "bg_alt": "#hex",
  "fg": "#hex",
  "fg_muted": "#hex",
  "primary_color": "#hex",
  "card_bg": "#hex",
  "card_border": "#hex",
  "font_heading": "\\"Inter\\", sans-serif",
  "font_body": "\\"Inter\\", sans-serif",
  "summary": "1-sentence design summary explaining the palette & contrast"
}`;

        const rawResult = await chat(systemPrompt, userPrompt, "standard", 2048, image, true);

        let parsed;
        try {
            const cleaned = rawResult.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
            parsed = JSON.parse(cleaned);
        } catch (jsonErr) {
            console.error("Failed to parse JSON from vision chat:", rawResult);
            return sendError(res, "Failed to parse extracted theme from AI", jsonErr);
        }

        const normalizeHex = (val, fallback) => {
            if (typeof val === "string" && /^#[0-9a-fA-F]{6}$/.test(val.trim())) {
                return val.trim();
            }
            if (typeof val === "string" && /^#[0-9a-fA-F]{3}$/.test(val.trim())) {
                const s = val.trim();
                return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
            }
            return fallback;
        };

        const normalizeFont = (val, fallback) => {
            if (!val || typeof val !== "string") return fallback;
            const validFonts = ["Inter", "Lora", "Merriweather", "Outfit", "Playfair Display", "Poppins", "Quicksand", "Roboto"];
            const matched = validFonts.find(f => val.toLowerCase().includes(f.toLowerCase()));
            if (matched) {
                const isSerif = ["Lora", "Merriweather", "Playfair Display"].includes(matched);
                return `"${matched}", ${isSerif ? "serif" : "sans-serif"}`;
            }
            return fallback;
        };

        let bg = normalizeHex(parsed.bg, "#ffffff");
        let bg_alt = normalizeHex(parsed.bg_alt, "#f9fafb");
        let fg = normalizeHex(parsed.fg, "#1f2937");
        let fg_muted = normalizeHex(parsed.fg_muted, "#4b5563");
        let primary_color = normalizeHex(parsed.primary_color, "#3b82f6");
        let card_bg = normalizeHex(parsed.card_bg, "#ffffff");
        let card_border = normalizeHex(parsed.card_border, "#e5e7eb");

        // Polarity and Contrast Safety Guards
        const bgLum = getLuminance(bg);
        const isDarkTheme = bgLum < 0.35;

        if (isDarkTheme) {
            // Dark Theme Enforcement:
            // 1. Primary color (styles the main title .theme-heading) must have high contrast on dark bg
            if (getLuminance(primary_color) < 0.3) {
                primary_color = "#ffffff";
            }
            // 2. Base text must be bright
            if (getLuminance(fg) < 0.5) {
                fg = "#ffffff";
            }
            // 3. Subtitles & descriptions must be readable light slate/silver
            if (getLuminance(fg_muted) < 0.25) {
                fg_muted = "#cbd5e1";
            }
            // 4. In dark themes, cards MUST be dark surfaces (cannot be white #ffffff!)
            if (getLuminance(card_bg) > 0.45) {
                card_bg = adjustHexBrightness(bg, 10);
            }
            // 5. Border must be subtle
            if (getLuminance(card_border) > 0.5 || getLuminance(card_border) < 0.05) {
                card_border = adjustHexBrightness(card_bg, 15);
            }
            // 6. Section background must be a complementary dark tone
            if (getLuminance(bg_alt) > 0.45) {
                bg_alt = adjustHexBrightness(bg, 14);
            }
        } else {
            // Light Theme Enforcement:
            // 1. Primary color must have high contrast on light bg
            if (getLuminance(primary_color) > 0.75) {
                primary_color = "#0f172a";
            }
            // 2. Base text must be dark
            if (getLuminance(fg) > 0.45) {
                fg = "#0f172a";
            }
            // 3. Muted text must be dark slate
            if (getLuminance(fg_muted) > 0.6) {
                fg_muted = "#475569";
            }
            // 4. Cards in light themes must be light
            if (getLuminance(card_bg) < 0.4) {
                card_bg = "#ffffff";
            }
            // 5. Border must be subtle
            if (getLuminance(card_border) < 0.2) {
                card_border = "#e2e8f0";
            }
            // 6. Section background must be light
            if (getLuminance(bg_alt) < 0.4) {
                bg_alt = "#f8fafc";
            }
        }

        const extractedTheme = {
            name: (parsed.name && typeof parsed.name === "string") ? parsed.name.trim() : (isDarkTheme ? "Dark Modern Theme" : "Light Modern Theme"),
            bg,
            bg_alt,
            fg,
            fg_muted,
            primary_color,
            card_bg,
            card_border,
            font_heading: normalizeFont(parsed.font_heading, '"Inter", sans-serif'),
            font_body: normalizeFont(parsed.font_body, '"Inter", sans-serif'),
            summary: parsed.summary || "Theme extracted from presentation template."
        };

        sendSuccess(res, extractedTheme, "Theme extracted successfully");
    } catch (error) {
        console.error("Error in extractThemeFromImage:", error);
        sendError(res, "Error extracting theme from image", error);
    }
};
