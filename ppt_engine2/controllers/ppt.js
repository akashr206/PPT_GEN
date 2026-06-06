import { chat } from "../utils/llmChat.js";
import { pptSystemPrompt } from "../utils/prompts.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { nanoid } from "nanoid";
import { initPPT, updateStatus, addPPTContent, readStatus, deletePPTById, getUserPpts, updateTheme, updateSlides, fetchPPTById } from "../services/ppt.js";
import parseLLMJson from "../utils/parseLLM.js";
import { insertIconsToContent, searchIconsByKeywords } from "../services/insertIcons.js";
import { searchPexelsImages } from "../services/insertImage.js";
import fs from "fs";
import path from "path";
import { convertHtmlToPptx } from "../engine/converter.js";

export const generatePPT = async (req, res) => {
    const { prompt, tone, slidesCount, layoutStyle } = req.body;

    if (!prompt || !tone || !slidesCount) {
        return sendError(res, "Required fields are missing", null, 400);
    }
    const ppt_id = nanoid(10);

    try {
        await initPPT({ ppt_id, userId: req.user.userId, });

        sendSuccess(res, { ppt_id }, "PPT generation started");

        (async () => {
            try {
                const fullPrompt = `${prompt}\nTone: ${tone}\n Text content preference: ${layoutStyle}\n User name: ${req.user.name}`.trim();

                const newSysPrompt = pptSystemPrompt +
                    `\nStrictly output exactly ${slidesCount} slides. Do not generate more or fewer slides under any circumstance.`;

                const response = await chat(newSysPrompt, fullPrompt);
                
                const parsedResponse = parseLLMJson(response);

                await insertIconsToContent(parsedResponse);

                await addPPTContent({ ppt_id, ...parsedResponse, tone, status: "SUCCESS" });

                console.log(`PPT ${ppt_id} generated successfully`);
            } catch (error) {
                console.error(`PPT ${ppt_id} generation failed:`, error);

                try {
                    await updateStatus({ ppt_id, status: "FAILED" });
                } catch (dbError) {
                    console.error("Failed to update PPT status:", dbError);
                }
            }
        })();
    } catch (error) {
        console.error(error);
        return sendError(res, "Failed to start PPT generation", null, 500);
    }
};

export const searchImages = async (req, res) => {
    try {
        const query = req.query.q || req.query.description;
        if (!query) {
            return sendError(res, "Query parameter 'q' or 'description' is required", null, 400);
        }

        const images = await searchPexelsImages(query);
        sendSuccess(res, images, "Images searched successfully");
    } catch (error) {
        console.error("Image search error:", error);
        sendError(res, "Failed to search images", error, 500);
    }
};

export const searchIcons = async (req, res) => {
    try {
        const query = req.query.q || req.query.description;
        if (!query) {
            return sendError(res, "Query parameter 'q' or 'description' is required", null, 400);
        }

        // Split the search query based on spaces, lowercase, and trim them
        const keywords = query.split(/\s+/).filter(Boolean).map(k => k.toLowerCase().trim());
        
        if (keywords.length === 0) {
            return sendSuccess(res, [], "No keywords provided");
        }

        const icons = await searchIconsByKeywords(keywords);
        sendSuccess(res, icons, "Icons searched successfully");
    } catch (error) {
        console.error("Icon search error:", error);
        sendError(res, "Failed to search icons", error, 500);
    }
};

export const getStatus = async (req, res) => {
    try {
        const { ppt_id } = req.params;
        const status = await readStatus({ ppt_id });
        sendSuccess(res, status, "Status fetched successfully");
    } catch (error) {
        console.error(error);
        sendError(res, "Failed to fetch status", error, 500);
    }
}

export const getAllPPTs = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const ppts = await getUserPpts({ user_id });

        sendSuccess(res, ppts, "PPTs fetched successfully");
    } catch (error) {
        console.error(error);
        sendError(res, "Failed to fetch PPTs", error, 500);
    }
}

export const getPPTById = async (req, res) => {
    try {
        const { ppt_id } = req.params;
        const ppt = await fetchPPTById({ ppt_id });
        sendSuccess(res, ppt, "PPT fetched successfully");
    } catch (error) {
        console.error(error);
        sendError(res, "Failed to fetch PPT", error, 500);
    }
}

export const updateTemplate = async (req, res) => {
    try {
        const { ppt_id } = req.params;
        const { theme, slides } = req.body;
        if (!theme && !slides) {
            return sendError(res, "Required fields are missing", null, 400);
        }

        if (theme) {
            await updateTheme({ ppt_id, theme });
        }
        if (slides) {
            await updateSlides({ ppt_id, slides });
        }
        sendSuccess(res, {}, "PPT updated successfully");
    } catch (error) {
        console.error(error);
        sendError(res, "Failed to update PPT", error, 500);
    }
}

export const deletePPT = async (req, res) => {
    try {
        const { ppt_id } = req.params;
        const ppt = await deletePPTById({ ppt_id });
        sendSuccess(res, {}, "PPT deleted successfully");
    } catch (error) {
        console.error(error);
        sendError(res, "Failed to delete PPT", error, 500);
    }
}

export const convertPPT = async (req, res) => {
    const { slides } = req.body;

    if (!slides || !Array.isArray(slides)) {
        return sendError(res, 'Missing or invalid slides array', 'Missing or invalid slides array', 400);
    }

    const tempFile = path.resolve(`temp_${Date.now()}.pptx`);

    try {
        console.log('[Server] Incoming conversion request, starting conversion...');
        await convertHtmlToPptx({
            slides,
            outputPath: tempFile
        });

        // Send the PPTX file to the client for download
        res.download(tempFile, 'presentation.pptx', (downloadErr) => {
            // Clean up the temporary file after the download completes or fails
            fs.unlink(tempFile, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('[Server] Temp file cleanup error:', unlinkErr);
                } else {
                    console.log('[Server] Cleaned up temp file:', tempFile);
                }
            });

            if (downloadErr) {
                console.error('[Server] Download error:', downloadErr);
                if (!res.headersSent) {
                    return sendError(res, 'Error downloading file', downloadErr, 500);
                }
            }
        });
    } catch (err) {
        console.error('[Server] Conversion error:', err);
        // Clean up the temp file if it exists and conversion failed
        if (fs.existsSync(tempFile)) {
            fs.unlink(tempFile, (unlinkErr) => {
                if (unlinkErr) console.error('[Server] Temp file cleanup error on failure:', unlinkErr);
            });
        }
        return sendError(res, 'Error occurred during layout conversion', err, 500);
    }
};
