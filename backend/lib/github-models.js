// lib/github-models.js
import { githubModels } from '@github/models';
import { generateText } from 'ai';

/**
 * Generate text using a specified GitHub-hosted model and return a standardized result object.
 * @param {string} prompt - The text prompt to send to the model.
 * @param {string} [model='meta/meta-llama-3.1-8b-instruct'] - Model identifier to use (e.g., 'meta/meta-llama-3.1-8b-instruct').
 * @returns {{success: true, content: string, provider: string} | {success: false, error: string}} On success, an object with `success: true`, the generated `content`, and `provider: 'github-models'`; on failure, an object with `success: false` and an `error` message.
 */
export async function callGithubModel(prompt, model = 'meta/meta-llama-3.1-8b-instruct') {
  try {
    const result = await generateText({
      model: githubModels(model),
      prompt: prompt,
    });
    
    return {
      success: true,
      content: result.text,
      provider: 'github-models',
    };
  } catch (error) {
    console.error('GitHub Models error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
// รายชื่อโมเดลฟรีที่ GitHub เปิดให้ใช้งาน
const FREE_MODELS = [
  'meta/meta-llama-3.1-8b-instruct',
  'meta/meta-llama-3.1-70b-instruct',
  'mistral/mistral-7b-instruct',
  'microsoft/phi-3-mini-4k-instruct',
  'microsoft/phi-3-medium-instruct',
  'google/gemma-7b-it',
  'cohere/command-r-plus'
];

export async function callGithubModel(prompt) {
  for (const model of FREE_MODELS) {
    try {
      const result = await generateText({
        model: githubModels(model),
        prompt,
      });
      return {
        success: true,
        content: result.text,
        provider: 'github-models',
        model,
      };
    } catch (error) {
      console.warn(`Model ${model} failed:`, error.message);
      // ถ้า error จะลองโมเดลฟรีตัวถัดไป
    }
  }
  return {
    success: false,
    error: 'All free models failed',
  };
}