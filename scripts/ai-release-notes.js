import OpenAI from "openai";
import { execSync } from "child_process";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get commit range
const lastTag = execSync("git describe --tags --abbrev=0").toString().trim();
const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%s"`).toString();

const prompt = `
You are a release engine for a developer + e-commerce automation system.

Convert these commits into:

1. TECHNICAL CHANGELOG (developer-focused)
2. MARKETING RELEASE (TikTok/Shopee/Threads style)
3. PRODUCT VALUE SUMMARY (1 paragraph)

COMMITS:
${commits}
`;

const res = await openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [{ role: "user", content: prompt }]
});

fs.writeFileSync("RELEASE_AI.md", res.choices[0].message.content);

console.log("AI release notes generated.");