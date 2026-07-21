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

/**
 * Searches Pexels API for a given query and returns a list of images.
 * Falls back to PEXEL_KEY_FALLBACK if the primary PEXEL_KEY is rate limited (HTTP 429).
 * 
 * @param {string} query - The image search query / description.
 * @returns {Promise<Array<{imageURL: string, previewURL: string}>>} The list of matching images.
 */
export const searchPexelsImages = async (query) => {
    const key = process.env.PEXEL_KEY;
    const fallbackKey = process.env.PEXEL_KEY_FALLBACK;
    const q = cleanQuery(query);
    if (!q) return [];

    const url = `https://api.pexels.com/v1/search?query=${q}&per_page=25`;

    try {
        let response = await fetch(url, {
            headers: {
                'Authorization': key
            }
        });

        if (response.status === 429 && fallbackKey) {
            console.warn("Pexels rate limited (429). Retrying with fallback key");
            response = await fetch(url, {
                headers: {
                    'Authorization': fallbackKey
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