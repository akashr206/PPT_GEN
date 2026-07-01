import { supabase } from "./utils/getClient.js";
import { configDotenv } from "dotenv";
configDotenv();

async function checkTable() {
    try {
        console.log("Checking if 'custom_themes' table exists...");
        const { data, error } = await supabase
            .from("custom_themes")
            .select("*")
            .limit(1);
        if (error) {
            console.log("Error checking table 'custom_themes':", error.message);
        } else {
            console.log("Table 'custom_themes' exists! Data:", data);
        }
    } catch (err) {
        console.error("Unhandled error:", err);
    }
}

checkTable();
