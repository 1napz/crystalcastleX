import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const logPath = "logs/run.log";
let logContent = "No logs found";

if (fs.existsSync(logPath)) {
  logContent = fs.readFileSync(logPath, "utf-8").slice(0, 6000);
}

async function run() {
  const prompt = `
You are a senior DevOps engineer.

Given the log below, generate a FIX as a unified diff patch.

Rules:
- Output ONLY valid unified diff (git diff format)
- Do not include explanations
- Only modify minimal necessary files
- If no fix is possible, output: NO_FIX

Log:
${logContent}
`;

  const res = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      { role: "system", content: "You generate precise git patches." },
      { role: "user", content: prompt }
    ],
  });

  const text = res.choices[0].message.content.trim();

  if (text === "NO_FIX") {
    console.log("No fix generated");
    return;
  }

  fs.writeFileSync("fix.patch", text);
  console.log("Patch created");
}

run();