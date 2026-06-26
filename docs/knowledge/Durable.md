Here's the quick take on workflow-sdk.dev/docs/ai — the AI page for Vercel's Workflow SDK:

What it is
Workflow SDK adds durability, reliability, and observability to async JavaScript/TypeScript. You build apps and AI agents that can suspend, resume, and keep state without wiring your own database.
Vercel Workflows is the managed version — same SDK, but hosted, and it now works for JS, TS, and Python. 3f6435d7

Why it matters for AI agents
The SDK is designed to pair with Vercel's AI SDK. Together they give you:
durable execution (survives restarts)
built-in tool calling
state management across steps
graceful handling of external events or interruptions
The pattern is "write a normal function that can time-travel": it can pause mid-execution and resume hours, days, or weeks later with all variables intact — no manual checkpoints or state machines. ad061fbd

How durable agents work
DurableAgent wraps the AI SDK agent loop. Each tool call becomes a workflow step that:
persists automatically
retries on failure
can run indefinitely without losing context
Tools can be:
step functions (automatic retries, observability), or
regular workflow code using primitives like sleep() and hooks to suspend/resume cleanly 8cc6ad06

Core primitives you'll see in the docs
suspend/resume — wait for webhooks, human input, or external APIs
hooks — used in demos like magic-link login, Slack story bot, FFmpeg conversion
Promise.race / use step — coordinate parallel work and npm integrations
observability — every step is logged, so you can replay/debug an agent run e690

When to use it
long-running agents (research bots, lead qualification, video rendering)
workflows needing human-in-the-loop approval
anything where a normal serverless function would time out

Install is one line: npm install workflow — then you import from the SDK and wrap your agent function. The managed Vercel Workflows handles the rest 2f33