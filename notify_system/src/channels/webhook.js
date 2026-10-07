import { BaseChannel } from './base.js';
import axios from 'axios';
import crypto from 'crypto';

export class WebhookChannel extends BaseChannel {
  async send(event) {
    if (!this.isEnabled()) return { sent: false, reason: 'disabled' };

    const { url, secret, signatureHeader = 'X-Notify-Signature' } = this.config;
    if (!url) return { sent: false, reason: 'missing url' };

    const payload = JSON.stringify(event);
    const headers = { 'Content-Type': 'application/json' };

    if (secret) {
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      headers[signatureHeader] = signature;
    }

    try {
      await axios.post(url, payload, { headers });
      return { sent: true, channel: 'webhook' };
    } catch (err) {
      return { sent: false, error: err.message, retry: err.response?.status >= 500 };
    }
  }
}
