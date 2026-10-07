import { BaseChannel } from './base.js';
import axios from 'axios';

export class SlackChannel extends BaseChannel {
  async send(event) {
    if (!this.isEnabled()) return { sent: false, reason: 'disabled' };

    const { webhookUrl, defaultChannel } = this.config;
    if (!webhookUrl) return { sent: false, reason: 'missing webhookUrl' };

    const priorityTags = {
      critical: ':red_circle: CRITICAL',
      warning: ':warning: Warning',
      info: ':information_source: Info',
      success: ':white_check_mark: Success'
    };

    const payload = {
      channel: defaultChannel,
      username: 'CrystalCastle Notify',
      icon_emoji: ':castle:',
      attachments: [{
        color: event.priority === 'critical' ? 'danger' :
               event.priority === 'warning' ? 'warning' : 'good',
        pretext: priorityTags[event.priority] || priorityTags.info,
        title: event.title,
        text: event.message,
        title_link: event.link,
        fields: [
          { short: true, title: 'Source', value: event.source },
          { short: true, title: 'Actor', value: event.actor || 'system' }
        ],
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    try {
      await axios.post(webhookUrl, payload);
      return { sent: true, channel: 'slack' };
    } catch (err) {
      return { sent: false, error: err.message, retry: true };
    }
  }
}
