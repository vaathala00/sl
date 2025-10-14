const axios = require("axios");
const fs = require("fs");

const STREAM_URL = "https://solii.saqlainhaider8198.workers.dev/";
const OUTPUT_FILE = "stream.m3u";

async function fetchAndSaveM3U() {
  try {
    const response = await axios.get(STREAM_URL);
    let data = response.data;

    // Remove unwanted metadata lines
    data = data
      .split("\n") // split by line
      .filter(line => line.startsWith("#EXTINF") || line.startsWith("http")) // keep only EXTINF + URLs
      .join("\n") // join back

    fs.writeFileSync(OUTPUT_FILE, data.trim() + "\n", "utf-8");

    console.log("✅ Cleaned and saved stream.m3u successfully.");
  } catch (error) {
    console.error("❌ Failed to fetch stream:", error.message);
    process.exit(1);
  }
}

fetchAndSaveM3U();
