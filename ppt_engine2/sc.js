import { chat } from "./utils/llmChat.js"
import { supabase } from "./utils/getClient.js"
import * as icons from "@phosphor-icons/react"

const BATCH_SIZE = 20;

const systemPrompt = `
You are an icon tagging and description expert.

For each icon, generate exactly 10 search tags and a short description.

Rules:
- Return only valid JSON.
- No markdown.
- No explanations.
- Every icon must have exactly 10 tags.
- Tags must be lowercase and include synonyms and related concepts.
- The description must be a brief explanation of what the icon represents (1 sentence).

Example:
{
  "rocket": {
    "tags": [
      "launch",
      "startup",
      "growth",
      "speed",
      "innovation",
      "success",
      "takeoff",
      "technology",
      "progress",
      "momentum"
    ],
    "description": "An icon depicting a rocket taking off, representing launches, growth, speed, and innovation."
  }
}
`;

async function processIcons(icons) {
    for (let i = 0; i < icons.length; i += BATCH_SIZE) {
        const batch = icons.slice(i, i + BATCH_SIZE);

        try {
            console.log(
                `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`
            );

            const response = await chat(
                systemPrompt,
                JSON.stringify(batch)
            );

            let cleanResponse = response.trim();
            if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse
                    .replace(/^```(?:json)?\n?/, "")
                    .replace(/\n?```$/, "")
                    .trim();
            }

            const parsed = JSON.parse(cleanResponse);

            const rows = Object.entries(parsed).map(
                ([name, data]) => ({
                    name,
                    tags: Array.isArray(data) ? data : (data?.tags || []),
                    description: typeof data === 'object' && data !== null ? (data.description || "") : "",
                })
            );

            const { error } = await supabase
                .from("icons")
                .upsert(rows, {
                    onConflict: "name",
                });

            if (error) {
                throw error;
            }

            console.log(
                `Inserted ${rows.length} icons`
            );
        } catch (err) {
            console.error(
                `Failed batch starting at ${i}`,
                err
            );
        }
    }

    console.log("Finished processing all icons");
}



const allIcons = Object.keys(icons).filter((name) => {
    if (
        name === "default" ||
        name === "IconContext" ||
        name === "IconBase" ||
        !/^[A-Z]/.test(name) ||
        name.startsWith("Lucide") ||
        name.endsWith("Icon") ||
        name.endsWith("Props")
    ) {
        return false;
    }

    const item = icons[name];
    if (!item) return false;

    if (typeof item === "function") return true;
    if (typeof item === "object" && item.$$typeof) return true;

    return false;
});

processIcons(allIcons.slice(21));