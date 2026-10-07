# Kimi API Platform

> Kimi K2.6 Open Platform, providing trillion-parameter K2.5 large language model API, supporting 256K long context and Tool Calling. Professional code generation, intelligent dialogue, visual reasoning, helping developers build AI applications.

## Docs

- [Terms of Service for Kimi OpenPlatform](https://platform.kimi.ai/docs/agreement/modeluse.md)
- [Kimi OpenPlatform Privacy Policy](https://platform.kimi.ai/docs/agreement/userprivacy.md)
- [Check Balance](https://platform.kimi.ai/docs/api/balance.md): REST API to check your available, voucher, and cash balances on Kimi OpenPlatform.
- [Cancel Batch](https://platform.kimi.ai/docs/api/batch-cancel.md): Cancel an in-progress batch task. The status will change to cancelling and then to cancelled. Only tasks in validating, in_progress, or finalizing status can be cancelled.
- [Create Batch](https://platform.kimi.ai/docs/api/batch-create.md): Create a batch task. You need to first upload a JSONL file with purpose="batch" via the Files API, then use the returned file_id to create the task.
- [List Batches](https://platform.kimi.ai/docs/api/batch-list.md): List batch tasks for your organization.
- [Retrieve Batch](https://platform.kimi.ai/docs/api/batch-retrieve.md): Retrieve the status and details of a specific batch task.
- [Create Chat Completion](https://platform.kimi.ai/docs/api/chat.md): Creates a completion for the chat message. Supports standard chat, Partial Mode, and Tool Use (Function Calling).
- [Errors](https://platform.kimi.ai/docs/api/errors.md)
- [Estimate Tokens](https://platform.kimi.ai/docs/api/estimate.md): Estimates the number of tokens that would be used for a given set of messages and model. The input structure is almost identical to that of chat completion.
- [Files](https://platform.kimi.ai/docs/api/files.md)
- [Get File Content](https://platform.kimi.ai/docs/api/files-content.md): Retrieves extracted text content for files uploaded with purpose `file-extract`.
- [Delete File](https://platform.kimi.ai/docs/api/files-delete.md): Deletes a previously uploaded file.
- [List Files](https://platform.kimi.ai/docs/api/files-list.md): Lists all files uploaded by the current user.
- [Get File Information](https://platform.kimi.ai/docs/api/files-retrieve.md): Retrieves metadata for a specific uploaded file.
- [Upload File](https://platform.kimi.ai/docs/api/files-upload.md): Uploads a file for extraction, image understanding, or video understanding.
- [List Models](https://platform.kimi.ai/docs/api/list-models.md): List all currently available models.
- [Model Parameter Reference](https://platform.kimi.ai/docs/api/models-overview.md)
- [API Overview](https://platform.kimi.ai/docs/api/overview.md)
- [Partial Mode](https://platform.kimi.ai/docs/api/partial.md)
- [Quickstart](https://platform.kimi.ai/docs/api/quickstart.md)
- [Tool Use](https://platform.kimi.ai/docs/api/tool-use.md)
- [Use Kimi K2.7 Code Model in ClaudeCode/Cline/RooCode](https://platform.kimi.ai/docs/guide/agent-support.md)
- [Automatic Reconnection on Disconnect](https://platform.kimi.ai/docs/guide/auto-reconnect.md)
- [Best Practices for Benchmarking](https://platform.kimi.ai/docs/guide/benchmark-best-practice.md)
- [Configure ModelScope MCP Server in Playground](https://platform.kimi.ai/docs/guide/configure-the-modelscope-mcp-server.md)
- [Use the Kimi API for Multi-turn Chat](https://platform.kimi.ai/docs/guide/engage-in-multi-turn-conversations-using-kimi-api.md)
- [Frequently Asked Questions and Solutions](https://platform.kimi.ai/docs/guide/faq.md)
- [Use Kimi CLI to Call Kimi Model](https://platform.kimi.ai/docs/guide/kimi-cli-support.md)
- [Kimi K2.6](https://platform.kimi.ai/docs/guide/kimi-k2-6-quickstart.md)
- [Kimi K2.7 Code](https://platform.kimi.ai/docs/guide/kimi-k2-7-code-quickstart.md)
- [Migrating from OpenAI to Kimi API](https://platform.kimi.ai/docs/guide/migrating-from-openai-to-kimi.md)
- [Setting Up and Verifying Your Organization](https://platform.kimi.ai/docs/guide/org-best-practice.md)
- [Best Practices for Prompts](https://platform.kimi.ai/docs/guide/prompt-best-practice.md)
- [Quickstart with Kimi API](https://platform.kimi.ai/docs/guide/start-using-kimi-api.md)
- [Using Batch API for Bulk Processing](https://platform.kimi.ai/docs/guide/use-batch-api.md)
- [Using the Console for Batch Inference](https://platform.kimi.ai/docs/guide/use-batch-inference.md)
- [Use Kimi API's JSON Mode](https://platform.kimi.ai/docs/guide/use-json-mode-feature-of-kimi-api.md)
- [Use Kimi API for File-Based Q&A](https://platform.kimi.ai/docs/guide/use-kimi-api-for-file-based-qa.md)
- [Use Kimi API for Tool Calls](https://platform.kimi.ai/docs/guide/use-kimi-api-to-complete-tool-calls.md)
- [How to Connect Kimi K2.6 to Hermes Agent](https://platform.kimi.ai/docs/guide/use-kimi-in-hermes-agent.md): Learn how to install Hermes Agent, set up Kimi K2.6 with an API key, and troubleshoot common model provider configuration issues.
- [How to Connect Kimi K2.5 to OpenClaw](https://platform.kimi.ai/docs/guide/use-kimi-in-openclaw.md): Build an AI agent with OpenClaw and the Kimi K2.5 API. Install and configure your API key for seamless chat on Telegram, Discord, WhatsApp, and more.
- [Using Thinking Models](https://platform.kimi.ai/docs/guide/use-kimi-k2-thinking-model.md)
- [Use the Kimi Vision Model](https://platform.kimi.ai/docs/guide/use-kimi-vision-model.md)
- [MoonPalace - Moonshot AI's Kimi API Debugging Tool](https://platform.kimi.ai/docs/guide/use-moonpalace.md)
- [How to Use Official Tools in Kimi API](https://platform.kimi.ai/docs/guide/use-official-tools.md)
- [Use Kimi API's Partial Mode](https://platform.kimi.ai/docs/guide/use-partial-mode-feature-of-kimi-api.md)
- [Use Playground to Debug the Model](https://platform.kimi.ai/docs/guide/use-playground-to-debug-the-model.md)
- [Use Kimi API's Internet Search Functionality](https://platform.kimi.ai/docs/guide/use-web-search.md)
- [Use the Streaming Feature of the Kimi API](https://platform.kimi.ai/docs/guide/utilize-the-streaming-output-feature-of-kimi-api.md)
- [Main Concepts](https://platform.kimi.ai/docs/introduction.md)
- [Model List](https://platform.kimi.ai/docs/models.md)
- [Welcome to Kimi API Docs](https://platform.kimi.ai/docs/overview.md)
- [BatchJob Pricing](https://platform.kimi.ai/docs/pricing/batch.md)
- [Model Inference Pricing Explanation](https://platform.kimi.ai/docs/pricing/chat.md)
- [Multi-modal Model Kimi K2.5 Pricing](https://platform.kimi.ai/docs/pricing/chat-k25.md)
- [Multi-modal Model Kimi K2.6 Pricing](https://platform.kimi.ai/docs/pricing/chat-k26.md)
- [Coding Model Kimi K2.7 Code Pricing](https://platform.kimi.ai/docs/pricing/chat-k27-code.md)
- [Generation Model Moonshot V1 Pricing](https://platform.kimi.ai/docs/pricing/chat-v1.md)
- [FAQ](https://platform.kimi.ai/docs/pricing/faq.md)
- [Recharge and Rate Limiting](https://platform.kimi.ai/docs/pricing/limits.md)
- [Limited-Time Promotion](https://platform.kimi.ai/docs/pricing/promotion.md)
- [WebSearch Pricing](https://platform.kimi.ai/docs/pricing/tools.md)

## OpenAPI Specs

- [openapi](https://platform.kimi.ai/docs/openapi.json)