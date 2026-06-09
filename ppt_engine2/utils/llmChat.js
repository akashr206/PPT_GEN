import { configDotenv } from "dotenv";
configDotenv();

async function chat(systemPrompt, prompt) {
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
            // thinking: {
            //     type: "disabled"
            // }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log(content);

    return content;
}

async function chatStream(systemPrompt, prompt, onToken, signal) {
    const response = await fetch("https://api.xiaomimimo.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "api-key": process.env.MIMO_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mimo-v2.5-pro",
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
                type: "disabled"
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