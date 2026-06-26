// scripts/generateVideo.js
import fetch from "node-fetch";
import fs from "fs";

const FAL_KEY = process.env.FAL_KEY; // เก็บใน GitHub Secrets
const IMAGE_PATH = process.argv[2] || "input.jpg";

async function generateVideo() {
  try {
    // Step 1: Upload image to Fal API v2
    const uploadRes = await fetch("https://fal.run/fal-ai/kling-video/v2/master/image-to-video", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          image_url: `https://your-storage/${IMAGE_PATH}`,
          duration: 5, // วิดีโอ 5 วินาที
          resolution: "720p"
        }
      })
    });

    const job = await uploadRes.json();
    console.log("Job created:", job);

    // Step 2: Poll job status
    let status = "PENDING";
    let result = null;

    while (status === "PENDING" || status === "RUNNING") {
      await new Promise(r => setTimeout(r, 5000)); // รอ 5 วินาที
      const pollRes = await fetch(job.urls.get, {
        headers: { "Authorization": `Bearer ${FAL_KEY}` }
      });
      const pollData = await pollRes.json();
      status = pollData.status;
      console.log("Job status:", status);

      if (status === "COMPLETED") {
        result = pollData.output;
        break;
      }
    }

    if (result) {
      console.log("Video generated:", result.video_url);
      fs.writeFileSync("logs/video.json", JSON.stringify(result, null, 2));
    } else {
      console.error("Video generation failed.");
    }
  } catch (err) {
    console.error("Error generating video:", err.message);
  }
}

generateVideo();
