import { supabase } from "../utils/getClient.js";

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
        if (!slide.items || !Array.isArray(slide.items)) {
            continue;
        }

        for (const item of slide.items) {
            if (item.iconKeywords && Array.isArray(item.iconKeywords) && item.iconKeywords.length > 0) {
                // Ensure keywords are trimmed, lowercase, and unique
                const keywords = [...new Set(item.iconKeywords.map(k => k.toLowerCase().trim()))];

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
 * @param {Array<string>} keywords - List of search keywords
 * @returns {Promise<Array>} List of matched icons
 */
export const searchIconsByKeywords = async (keywords) => {
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .rpc('search_icons', { 
            search_keywords: keywords 
        });

    if (error) {
        console.error("RPC search_icons error:", error);
        throw error;
    }

    return data || [];
};