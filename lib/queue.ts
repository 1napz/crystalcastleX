import { QueueClient } from '@vercel/queue';
 
const queue = new QueueClient({ region: 'sfo1' });
 
export const { send, handleCallback } = queue;