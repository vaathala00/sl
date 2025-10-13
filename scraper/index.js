const axios = require("axios");
const fs = require("fs");

const STREAM_URL = "https://solii.saqlainhaider8198.workers.dev/";
const OUTPUT_FILE = "../stream.m3u"; // Save at root level

async function fetchAndCleanM3U() {
  try {
    const response = await axios.get(STREAM_URL);
    const rawData = response.data;

    // Split into lines and process
    const lines = rawData.split("\n");
    const cleanedLines = lines.map((line) => {
      // If line is a stream URL and contains '|', strip the pipe and everything after
      if (line.startsWith("http") && line.includes("|")) {
        return line.split("|")[0];
      }
      return line;
    });

    const cleanedData = cleanedLines.join("\n");

    // Save only if different from existing content
    const existing = fs.existsSync(OUTPUT_FILE) ? fs.readFileSync(OUTPUT_FILE, "utf-8") : "";
    if (existing !== cleanedData) {
      fs.writeFileSync(OUTPUT_FILE, cleanedData, "utf-8");
      console.log("✅ stream.m3u cleaned and saved.");
    } else {
      console.log("ℹ️ No changes detected in stream.m3u");
    }
  } catch (error) {
    console.error("❌ Failed to fetch and clean stream:", error.message);
    process.exit(1);
  }
}

fetchAndCleanM3U();
