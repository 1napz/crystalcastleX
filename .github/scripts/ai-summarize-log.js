import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const logPath = "logs/run.log";
const outputDir = "update";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

let logContent = "No logs found";

if (fs.existsSync(logPath)) {
  logContent = fs.readFileSync(logPath, "utf-8").slice(0, 8000); // จำกัดขนาด
}

async function run() {
  const prompt = `
You are a DevOps assistant.

Analyze the following log and produce:

1. Summary (short)
2. Root Cause
3. Errors (if any)
4. Suggested Fix (actionable steps)

Log:
${logContent}
`;

  const res = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      { role: "system", content: "You are an expert DevOps engineer." },
      { role: "user", content: prompt }
    ],
  });

  const aiText = res.choices[0].message.content;

  const date = new Date().toISOString().split("T")[0];
  const file = `${outputDir}/${date}-ai-summary.md`;

  const content = `# 🤖 AI Log Analysis

${aiText}

---
Generated at: ${new Date().toISOString()}
`;

  fs.writeFileSync(file, content);
  console.log("AI summary created:", file);
}

run();