import { supabase } from "../utils/getClient.js";

/**
 * Helper to parse/normalize keywords when the LLM returns a string instead of an array.
 * e.g., "artificial intelligence | brain | research" -> ["artificial intelligence", "brain", "research"]
 * 
 * @param {any} input 
 * @returns {Array<string>}
 */
export const parseIconKeywords = (input) => {
    if (!input) return [];
    let rawKeywords = [];
    if (Array.isArray(input)) {
        rawKeywords = input.map(k => String(k).trim()).filter(Boolean);
    } else if (typeof input === 'string') {
        if (input.includes('|')) {
            rawKeywords = input.split('|');
        } else if (input.includes(',')) {
            rawKeywords = input.split(',');
        } else if (input.includes(';')) {
            rawKeywords = input.split(';');
        } else {
            rawKeywords = [input];
        }
    }

    // Split any keywords containing spaces into individual words
    const keywords = [];
    for (const kw of rawKeywords) {
        const parts = kw.split(/\s+/).map(p => p.trim()).filter(Boolean);
        keywords.push(...parts);
    }
    return keywords;
};

/**
 * Searches and assigns matching icons for slide items based on their iconKeywords.
 * Uses Promise.all to fetch icons in parallel.
 * 
 * @param {Object|Array} slidesContent - Either the parent PPT content object containing a slides array, or the slides array itself.
 * @returns {Promise<Object|Array>} The updated slidesContent.
 */
export const insertIconsToContent = async (slidesContent) => {
    if (!slidesContent) return slidesContent;

    const isArray = Array.isArray(slidesContent);
    const slides = isArray ? slidesContent : (slidesContent.slides || []);

    const tasks = [];

    for (const slide of slides) {
        let allItems = [];
        if (slide.items && Array.isArray(slide.items)) {
            allItems = allItems.concat(slide.items);
        }
        if (slide.blocks && Array.isArray(slide.blocks)) {
            for (const block of slide.blocks) {
                if (block.items && Array.isArray(block.items)) {
                    allItems = allItems.concat(block.items);
                }
            }
        }
        if (slide.contentTree) {
            const traverseTree = (node) => {
                if (!node) return;
                if (node.items && Array.isArray(node.items)) {
                    allItems = allItems.concat(node.items);
                }
                if (node.type === "split") {
                    traverseTree(node.first);
                    traverseTree(node.second);
                }
            };
            traverseTree(slide.contentTree);
        }

        if (allItems.length === 0) continue;

        for (const item of allItems) {
            if (item.icon) continue;
            const parsedKeywords = parseIconKeywords(item.iconKeywords || item.header);
            if (parsedKeywords.length > 0) {
                // Ensure keywords are trimmed, lowercase, and unique
                const keywords = [...new Set(parsedKeywords.map(k => k.toLowerCase().trim()))];

                tasks.push((async () => {
                    try {
                        const { data, error } = await supabase
                            .rpc('search_icons', { 
                                search_keywords: keywords 
                            });

                        if (error) {
                            console.error("RPC search_icons error:", error);
                        }

                        if (data && data.length > 0) {
                            // The RPC returns matching icons; use the best match's name (CamelCase/PascalCase)
                            item.icon = data[0].name;
                            item.recommendedIcons = data.slice(1, 7).map(i => i.name);
                        } else {
                            item.icon = null;
                            item.recommendedIcons = [];
                        }
                    } catch (err) {
                        console.error("Failed to query icon for keywords:", keywords, err);
                        item.icon = null;
                    }
                })());
            }
        }
    }

    if (tasks.length > 0) {
        await Promise.all(tasks);
    }

    return slidesContent;
};

/**
 * Service to search icons in the database using list of keywords.
 * 
 * @param {Array<string>|string} keywords - List of search keywords or a delimited string
 * @returns {Promise<Array>} List of matched icons
 */
export const searchIconsByKeywords = async (keywords) => {
    const parsedKeywords = parseIconKeywords(keywords);
    if (parsedKeywords.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .rpc('search_icons', { 
            search_keywords: parsedKeywords.map(k => k.toLowerCase().trim())
        });

    if (error) {
        console.error("RPC search_icons error:", error);
        throw error;
    }

    return data || [];
};