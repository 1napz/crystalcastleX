// lib/github-models.js
import { githubModels } from '@github/models';
import { generateText } from 'ai';

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