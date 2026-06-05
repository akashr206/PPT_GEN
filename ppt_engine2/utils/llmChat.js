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

export { chat }