// pages/api/run-workflow.js
import { Anthropic } from '@anthropic-ai/sdk'; // Or your Vertex adapter

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { config, step } = req.body;

  try {
    // 1. Validate keys from process.env (Server-side environment variables)
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("Missing API Key");

    // 2. Execute orchestration logic
    // If step === 'preview', prompt only for fetch/calc
    // If step === 'execute', prompt for email/slack/clickup
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY 
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        system: buildSystemPrompt(config, step),
        messages: [{ role: "user", content: "Process the workflow." }]
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
