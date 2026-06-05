function parseLLMJson(response) {
    try {
        return JSON.parse(response);
    } catch { }

    const match = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

    if (match) return JSON.parse(match[1]);

    const start = response.indexOf("{");
    const end = response.lastIndexOf("}");

    if (start !== -1 && end !== -1) return JSON.parse(response.slice(start, end + 1));

    throw new Error("No valid JSON found in response");
}

export default parseLLMJson;