import { configDotenv } from "dotenv";
configDotenv();

async function chat(systemPrompt, prompt, thinking = "standard") {
    const response = await fetch("https://api.xiaomimimo.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "api-key": process.env.MIMO_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mimo-v2.5",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            max_completion_tokens: 8192,
            temperature: 0.5,
            top_p: 0.9,
            stream: false,
            stop: null,
            frequency_penalty: 0,
            presence_penalty: 0,
            thinking: {
                type: thinking === "extended" ? "enabled" : "disabled"
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return content;
}

async function chatStream1(systemPrompt, prompt, onToken, signal, thinking = "standard") {
    // 1. Correct Endpoint and API Key
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:streamGenerateContent?alt=sse", {
        method: "POST",
        headers: {
            "x-goog-api-key": process.env.GEMINI_API_KEY,
            "Content-Type": "application/json"
        },
        signal, // Attaching the abort signal so you can stop generation if needed
        body: JSON.stringify({
            "system_instruction": {
                "parts": [{ "text": systemPrompt }]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{ "text": prompt }]
                }
            ],
            // Optional layout handling for thinking configurations
            ...(thinking !== "standard" && {
                "generationConfig": {
                    "thinkingConfig": { "thinkingBudget": 1024 }
                }
            })
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    // 2. Reading stream chunks safely
    const reader = response.body.getReader();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let lines = buffer.split("\n");
            buffer = lines.pop(); // Keep incomplete line in the buffer

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                // Gemini SSE lines start with "data: "
                if (trimmed.startsWith("data: ")) {
                    const dataStr = trimmed.slice(6);

                    try {
                        const parsed = JSON.parse(dataStr);

                        // 3. Gemini JSON Response Path Mapping
                        // Structure: parsed.candidates[0].content.parts[0].text
                        const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text;

                        if (token) {
                            onToken(token);
                        }
                    } catch (err) {
                        console.error("Failed to parse stream line:", trimmed, err);
                    }
                }
            }
        }

        // 4. Handle any trailing data left in the buffer
        if (buffer && buffer.trim().startsWith("data: ")) {
            try {
                const parsed = JSON.parse(buffer.trim().slice(6));
                const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (token) {
                    onToken(token);
                }
            } catch (err) {
                // Ignore trailing parser noise
            }
        }
    } finally {
        reader.releaseLock();
    }
}

async function chatStream(systemPrompt, prompt, onToken, signal, thinking = "standard") {
    const response = await fetch("https://api.xiaomimimo.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "api-key": process.env.MIMO_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "mimo-v2.6-flash",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            max_completion_tokens: 8192,
            temperature: 0.5,
            top_p: 0.9,
            stream: true,
            stop: null,
            frequency_penalty: 0,
            presence_penalty: 0,
            thinking: {
                type: thinking === "extended" ? "enabled" : "disabled"
            }
        }),
        signal
    });
    
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    for await (const chunk of response.body) {
        buffer += decoder.decode(chunk, { stream: true });
        let lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6);
                if (dataStr === "[DONE]") {
                    break;
                }
                try {
                    const parsed = JSON.parse(dataStr);
                    const delta = parsed.choices?.[0]?.delta;
                    const token = delta?.content;
                    if (token) {
                        onToken(token);
                    }
                } catch (err) {
                    console.error("Failed to parse stream line:", line, err);
                }
            }
        }
    }

    if (buffer) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr !== "[DONE]") {
                try {
                    const parsed = JSON.parse(dataStr);
                    const token = parsed.choices?.[0]?.delta?.content;
                                        
                    if (token) {
                        onToken(token);
                    }
                } catch (err) {
                    // ignore
                }
            }
        }
    }
}

export { chat, chatStream }