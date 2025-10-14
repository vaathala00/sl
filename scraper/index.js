const axios = require("axios");
const fs = require("fs");

const STREAM_URL = "https://solii.saqlainhaider8198.workers.dev/";
const OUTPUT_FILE = "stream.m3u";

async function fetchAndSaveM3U() {
  try {
    const response = await axios.get(STREAM_URL);
    let data = response.data;

    // Split into lines
    let lines = data.split("\n");

    // Process each line
    lines = lines
      .map(line => {
        // Keep only EXTINF and URLs
        if (line.startsWith("#EXTINF")) return line;

        if (line.startsWith("http")) {
          // Remove everything after '|' if present
          return line.split("|")[0].trim();
        }

        return null;
      })
      .filter(Boolean) // remove nulls or empty lines
      .join("\n");

    // Save to file
    fs.writeFileSync(OUTPUT_FILE, lines.trim() + "\n", "utf-8");
    console.log("✅ Cleaned and saved stream.m3u successfully.");
  } catch (error) {
    console.error("❌ Failed to fetch stream:", error.message);
    process.exit(1);
  }
}

fetchAndSaveM3U();
