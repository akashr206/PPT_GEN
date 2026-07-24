import { chat, chatStream } from "../utils/llmChat.js";
import partialJsonParser from "partial-json-parser";
import { pptSystemPrompt, editSlideSystemPrompt } from "../utils/prompts.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { nanoid } from "nanoid";
import { initPPT, updateStatus, addPPTContent, readStatus, deletePPTById, getUserPpts, updateTheme, updateSlides, fetchPPTById, updateShareStatus, getSharedPPTById } from "../services/ppt.js";
import parseLLMJson from "../utils/parseLLM.js";
import { insertIconsToContent, searchIconsByKeywords } from "../services/insertIcons.js";
import { searchPexelsImages } from "../services/insertImage.js";
import fs from "fs";
import path from "path";
import { convertHtmlToPptx } from "../engine/converter.js";
import { getUserCredits, updateCredits } from "../services/user.js";

export const generatePPT = async (req, res) => {
    const { prompt, tone, slidesCount, layoutStyle, thinking } = req.body;

    const ppt_id = nanoid(10);

    let creditsToDeduct = 20;
    if (thinking) creditsToDeduct += 5;
    if (parseInt(slidesCount) > 10) creditsToDeduct += 5;

    try {
        const currentCredits = await getUserCredits({ user_id: req.user.userId });
        if (currentCredits < creditsToDeduct) {
            return sendError(res, "Not enough credits", null, 402);
        }

        // Pre-deduct credits
        await updateCredits({ user_id: req.user.userId, amount_to_add: -creditsToDeduct });

        await initPPT({ ppt_id, userId: req.user.userId, });

        sendSuccess(res, { ppt_id }, "PPT generation started");

        (async () => {
            try {
                const fullPrompt = `${prompt}\nTone: ${tone}\n Text content preference: ${layoutStyle}\n User name: ${req.user.name}`.trim();

                const newSysPrompt = pptSystemPrompt +
                    `\nStrictly output exactly ${slidesCount} slides. Do not generate more or fewer slides under any circumstance.`;

                const response = await chat(newSysPrompt, fullPrompt, thinking);

                const parsedResponse = parseLLMJson(response);

                await insertIconsToContent(parsedResponse);

                parsedResponse.slides_count = parsedResponse.slides.length;

                await addPPTContent({ ppt_id, ...parsedResponse, tone, status: "SUCCESS" });

                console.log(`PPT ${ppt_id} generated successfully`);
            } catch (error) {
                console.error(`PPT ${ppt_id} generation failed:`, error);

                if (error.name !== "AbortError") {
                    try {
                        console.log(`[Credits] Refund ${creditsToDeduct} credits due to failure`);
                        await updateCredits({ user_id: req.user.userId, amount_to_add: creditsToDeduct });
                    } catch (refundError) {
                        console.error("Failed to refund credits:", refundError);
                    }
                }

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

const getPartialData = (accumulatedText) => {
    const start = accumulatedText.indexOf("{");
    if (start === -1) return { slides: [], theme: null };

    let jsonStr = accumulatedText.slice(start);
    jsonStr = jsonStr.replace(/```json\s*$/g, "").replace(/```\s*$/g, "").trim();

    try {
        const parsed = partialJsonParser(jsonStr);
        return {
            slides: (parsed && parsed.slides && Array.isArray(parsed.slides)) ? parsed.slides : [],
            theme: parsed?.theme || null
        };
    } catch (err) {
        // Ignore parsing errors on incomplete JSON fragments
    }
    return { slides: [], theme: null };
};

const activeGenerations = new Map();

export const streamPPT = async (req, res) => {
    const { ppt_id } = req.params;
    const { prompt, tone, slidesCount, layoutStyle, thinking } = req.query;

    // Abort existing running generation for the same ppt_id (handles React StrictMode / reconnections)
    if (activeGenerations.has(ppt_id)) {
        console.log(`[Stream] Aborting existing active generation for PPT: ${ppt_id}`);
        const existing = activeGenerations.get(ppt_id);
        existing.abortController.abort();
        activeGenerations.delete(ppt_id);
    }

    // Check if PPT already exists to prevent double charging on reconnects
    let isNewGeneration = false;
    try {
        const existingPpt = await fetchPPTById({ ppt_id });
        if (!existingPpt || existingPpt.length === 0) {
            isNewGeneration = true;
        }
    } catch (err) {
        console.error("Error checking existing PPT:", err);
    }

    if (isNewGeneration) {
        let creditsToDeduct = 20;
        if (thinking === "true" || thinking === "advanced") creditsToDeduct += 5;
        if (parseInt(slidesCount) > 10) creditsToDeduct += 5; // deduct 5 extra if number of slides is > 10

        try {
            const currentCredits = await getUserCredits({ user_id: req.user.userId });
            if (currentCredits < creditsToDeduct) {
                return sendError(res, "Not enough credits", null, 402);
            }
            // Pre-deduct credits
            await updateCredits({ user_id: req.user.userId, amount_to_add: -creditsToDeduct });
        } catch (err) {
            console.error("Failed to process credits:", err);
            return sendError(res, "Failed to verify credits", null, 500);
        }
    }

    const abortController = new AbortController();
    activeGenerations.set(ppt_id, { abortController, res, isNewGeneration, creditsDeducted: isNewGeneration ? 20 + (thinking === "true" || thinking === "advanced" ? 5 : 0) + (parseInt(slidesCount) === 15 ? 5 : 0) : 0 });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let accumulatedText = "";

    // Set up request close event listener to clean up if client disconnects
    req.on('close', () => {
        const current = activeGenerations.get(ppt_id);
        if (current && current.res === res) {
            console.log(`[Stream] Client closed connection for PPT: ${ppt_id}. Aborting stream.`);
            abortController.abort();
        }
    });

    try {
        try {
            await initPPT({ ppt_id, userId: req.user?.userId });
        } catch (initErr) {
            console.log(`[Stream] PPT ${ppt_id} already initialized or error:`, initErr.message);
        }

        const fullPrompt = `${prompt.trim()}\nTone: ${tone}\n Text content preference: ${layoutStyle || 'balanced'}\n User name: ${req.user?.name || 'User'}`.trim();
        const newSysPrompt = pptSystemPrompt +
            `\n[CRITICAL] Strictly output exactly ${slidesCount} slides. Do not generate more or fewer slides under any circumstance.`;

        // Pass the abort signal and thinking config to chatStream
        await chatStream(newSysPrompt, fullPrompt, (token) => {
            accumulatedText += token;
            const partialData = getPartialData(accumulatedText);
            res.write(`data: ${JSON.stringify({ slides: partialData.slides, theme: partialData.theme })}\n\n`);
        }, abortController.signal, thinking);

        const completedResponse = parseLLMJson(accumulatedText);
        completedResponse.slides_count = completedResponse.slides.length;
        await insertIconsToContent(completedResponse);

        await addPPTContent({
            ppt_id,
            ...completedResponse,
            tone,
            status: "SUCCESS"
        });

        res.write('event: complete\ndata: {"status": "SUCCESS"}\n\n');
        res.end();

        // Success cleanup
        const current = activeGenerations.get(ppt_id);
        if (current && current.res === res) {
            activeGenerations.delete(ppt_id);
        }
    } catch (error) {
        console.error(`Streaming PPT ${ppt_id} generation failed:`, error);

        // Handle AbortError vs other errors
        if (error.name === 'AbortError') {
            console.log(`[Stream] PPT ${ppt_id} stream was aborted.`);
            // Only update DB status to FAILED if this is still the active generation (no new request took over)
            const current = activeGenerations.get(ppt_id);
            if (current && current.res === res) {
                try {
                    await updateStatus({ ppt_id, status: "FAILED" });
                } catch (dbError) {
                    console.error("Failed to update PPT status to FAILED in DB:", dbError);
                }
                activeGenerations.delete(ppt_id);
            }
        } else {
            // Standard error
            const current = activeGenerations.get(ppt_id);
            if (current && current.res === res && current.creditsDeducted > 0) {
                try {
                    console.log(`[Credits] Refund ${current.creditsDeducted} credits due to streaming failure for PPT ${ppt_id}`);
                    await updateCredits({ user_id: req.user.userId, amount_to_add: current.creditsDeducted });
                } catch (refundError) {
                    console.error("Failed to refund credits:", refundError);
                }
            }

            try {
                await updateStatus({ ppt_id, status: "FAILED" });
            } catch (dbError) {
                console.error("Failed to update PPT status to FAILED in DB:", dbError);
            }
            // Clear from activeGenerations
            if (current && current.res === res) {
                activeGenerations.delete(ppt_id);
            }
        }

        if (!res.writableEnded) {
            res.write(`event: error\ndata: ${JSON.stringify({ message: error.message || "Generation failed" })}\n\n`);
            res.end();
        }
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
        const query = req.query.q || req.query.description || req.query.keywords;
        if (!query) {
            return sendError(res, "Query parameter 'q', 'description' or 'keywords' is required", null, 400);
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
            const pptData = await fetchPPTById({ ppt_id });
            const currentSlidesCount = pptData[0]?.slides_count;
            const newSlidesCount = Array.isArray(slides) ? slides.length : undefined;

            if (newSlidesCount !== undefined && newSlidesCount !== currentSlidesCount) {
                await updateSlides({ ppt_id, slides, slides_count: newSlidesCount });
            } else {
                await updateSlides({ ppt_id, slides });
            }
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

export const editSlide = async (req, res) => {
    const { slide, prompt, presentationTitle, slideTitles, slideIndex } = req.body;

    try {
        const currentCredits = await getUserCredits({ user_id: req.user.userId });
        if (currentCredits < 5) {
            return sendError(res, "Not enough credits", null, 402);
        }

        // Pre-deduct 5 credits
        await updateCredits({ user_id: req.user.userId, amount_to_add: -5 });

        const contextInfo = `
Presentation Context:
- Topic/Title: ${presentationTitle || 'N/A'}
- Total Slides: ${slideTitles?.length || 0}
- Current Slide Position: Slide ${slideIndex !== undefined ? slideIndex + 1 : 'N/A'} of ${slideTitles?.length || 0}
- Sequence of Slide Titles in Deck: ${slideTitles ? slideTitles.map((t, idx) => `\n  ${idx + 1}. ${t}`).join('') : 'N/A'}
`.trim();

        const userPrompt = `${contextInfo}\n\n====================\n\nCurrent Slide JSON to Edit:\n${JSON.stringify(slide, null, 2)}\n\nEdit Instruction:\n${prompt}`;

        const response = await chat(editSlideSystemPrompt, userPrompt);
        const parsedSlide = parseLLMJson(response);

        // Fetch icons if needed
        await insertIconsToContent([parsedSlide]);

        return sendSuccess(res, parsedSlide, "Slide edited successfully");
    } catch (error) {
        console.error("Edit slide failed:", error);

        try {
            console.log(`[Credits] Refund 5 credits due to edit slide failure`);
            await updateCredits({ user_id: req.user.userId, amount_to_add: 5 });
        } catch (refundError) {
            console.error("Failed to refund credits:", refundError);
        }

        return sendError(res, "Failed to edit slide with AI", error.message, 500);
    }
};

export const toggleShare = async (req, res) => {
    const { ppt_id } = req.params;
    const { is_shared } = req.body;
    try {
        // First verify ownership
        const pptList = await fetchPPTById({ ppt_id });
        if (!pptList || pptList.length === 0) {
            return sendError(res, "Presentation not found", null, 404);
        }
        if (pptList[0].user_id !== req.user.userId) {
            return sendError(res, "Unauthorized", null, 403);
        }

        await updateShareStatus({ ppt_id, is_shared: !!is_shared });
        return sendSuccess(res, { is_shared: !!is_shared }, "Sharing status updated successfully");
    } catch (error) {
        console.error("Toggle share failed:", error);
        return sendError(res, "Failed to update sharing status", error.message, 500);
    }
};

export const getSharedPPT = async (req, res) => {
    const { ppt_id } = req.params;
    try {
        const ppt = await getSharedPPTById({ ppt_id });
        if (!ppt) {
            return sendError(res, "Presentation not found or not shared", null, 404);
        }
        return sendSuccess(res, ppt, "Shared presentation retrieved successfully");
    } catch (error) {
        console.error("Get shared PPT failed:", error);
        return sendError(res, "Presentation not found or not shared", error.message, 404);
    }
};
