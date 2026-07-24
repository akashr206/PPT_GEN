/**
 * Helper to clean and format search query parameters.
 * Truncates queries to 100 characters.
 */
const cleanQuery = (query) => {
    if (!query || typeof query !== 'string') return '';
    let q = query.trim();
    if (q.length > 100) {
        q = q.substring(0, 100);
    }
    return encodeURIComponent(q);
};

let currentKeyIndex = 0;

/**
 * Searches Pexels API for a given query and returns a list of images.
 * Uses a round-robin strategy across multiple API keys stored in PEXEL_KEYS.
 * 
 * @param {string} query - The image search query / description.
 * @returns {Promise<Array<{imageURL: string, previewURL: string}>>} The list of matching images.
 */
export const searchPexelsImages = async (query) => {
    const keysString = process.env.PEXEL_KEYS || process.env.PEXEL_KEY || "";
    const keys = keysString.split(',').map(k => k.trim()).filter(Boolean);

    if (keys.length === 0) {
        console.error("No Pexels API keys found in PEXEL_KEYS.");
        return [];
    }

    const key = keys[currentKeyIndex % keys.length];
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;

    const q = cleanQuery(query);
    if (!q) return [];

    const url = `https://api.pexels.com/v1/search?query=${q}&per_page=25`;

    try {
        let response = await fetch(url, {
            headers: {
                'Authorization': key
            }
        });

        if (response.status === 429 && keys.length > 1) {
            console.warn("Pexels rate limited (429). Retrying with next key");
            const nextKey = keys[currentKeyIndex % keys.length];
            currentKeyIndex = (currentKeyIndex + 1) % keys.length;
            response = await fetch(url, {
                headers: {
                    'Authorization': nextKey
                }
            });
        }

        if (!response.ok) {
            console.error(`Pexels API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (data && data.photos && Array.isArray(data.photos)) {
            return data.photos.map(photo => ({
                alt: photo.alt || '',
                photographer: photo.photographer || '',
                imageURL: photo.src?.large || photo.src?.original || '',
                previewURL: photo.src?.medium || photo.src?.small || ''
            }));
        }
        return [];
    } catch (err) {
        console.error("Pexels fetch failed:", err);
        return [];
    }
};