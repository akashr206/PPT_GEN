import partialJsonParser from "partial-json-parser";

const cleanJsonString = (str) => {
    if (!str) return "";
    return str.replace(/,\s*([\]}])/g, '$1').trim();
};

function parseLLMJson(response) {
    const cleanedRaw = cleanJsonString(response);
    try {
        return JSON.parse(cleanedRaw);
    } catch { }

    const match = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

    if (match) {
        const cleanedMatch = cleanJsonString(match[1]);
        try {
            return JSON.parse(cleanedMatch);
        } catch {
            try {
                return partialJsonParser(cleanedMatch);
            } catch { }
        }
    }

    const start = response.indexOf("{");
    const end = response.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
        const sliced = response.slice(start, end + 1);
        const cleanedSliced = cleanJsonString(sliced);
        try {
            return JSON.parse(cleanedSliced);
        } catch {
            try {
                return partialJsonParser(cleanedSliced);
            } catch { }
        }
    }

    const fallbackStart = response.indexOf("{");
    if (fallbackStart !== -1) {
        const cleanedFallback = cleanJsonString(response.slice(fallbackStart));
        try {
            return partialJsonParser(cleanedFallback);
        } catch { }
    }

    throw new Error("No valid JSON found in response");
}

export default parseLLMJson;