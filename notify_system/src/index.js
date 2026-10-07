import { config } from 'dotenv';
import { SlackChannel } from './channels/slack.js';
import { WebhookChannel } from './channels/webhook.js';
import { HistoryLogger } from './storage/history.js';
import fs from 'fs/promises';

config({ path: '.env' });

const PRIORITY_ORDER = ['debug', 'info', 'warning', 'critical', 'success'];

class NotifySystem {
  constructor() {
    this.cfg = null;
    this.channels = [];
    this.history = null;
    this.lastSent = new Map();
    this.queue = [];
  }

  async init() {
    const cfgText = await fs.readFile(new URL('../config.json', import.meta.url), 'utf8');
    this.cfg = JSON.parse(cfgText);

    this.history = new HistoryLogger(process.env.NOTIFY_LOG_PATH || this.cfg.system.logPath);

    this._initChannels();

    console.log(`✅ Notify System v${this.cfg.system.version} initialized`);
    console.log(`📋 Active channels: ${this.channels.map(c => c.name).join(', ') || 'none'}`);
    return this;
  }

  _initChannels() {
    const { channels } = this.cfg;

    if (channels.slack?.enabled) {
      this.channels.push(new SlackChannel({
        ...channels.slack,
        webhookUrl: process.env.NOTIFY_SLACK_WEBHOOK_URL || channels.slack.webhookUrl
      }));
    }

    if (channels.webhook?.enabled) {
      this.channels.push(new WebhookChannel({
        ...channels.webhook,
        url: process.env.NOTIFY_WEBHOOK_URL || channels.webhook.url,
        secret: process.env.NOTIFY_SECRET_TOKEN || channels.webhook.secret
      }));
    }
  }

  shouldSend(event) {
    const { rules } = this.cfg;

    if (rules.filter.excludeEvents.includes(event.type)) return false;

    const minIdx = PRIORITY_ORDER.indexOf(rules.filter.minPriority);
    const evtIdx = PRIORITY_ORDER.indexOf(event.priority || 'info');
    if (evtIdx < minIdx) return false;

    if (rules.throttle.enabled) {
      const key = `${event.source}:${event.priority}`;
      const last = this.lastSent.get(key) || 0;
      const elapsed = (Date.now() - last) / 1000;
      if (elapsed < rules.throttle.windowSeconds) return false;
      this.lastSent.set(key, Date.now());
    }

    return true;
  }

  async dispatch(event) {
    const fullEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
      priority: 'info',
      ...event
    };

    if (!this.shouldSend(fullEvent)) {
      await this.history.append({ id: fullEvent.id, status: 'skipped', reason: 'filter/throttle' });
      return { id: fullEvent.id, dispatched: false };
    }

    const results = [];
    for (const ch of this.channels) {
      const res = await ch.send(fullEvent);
      results.push({ channel: ch.name, ...res });
      
      await this.history.append({
        id: fullEvent.id,
        channel: ch.name,
        status: res.sent ? 'sent' : 'failed',
        error: res.error
      });
    }

    return {
      id: fullEvent.id,
      dispatched: true,
      results
    };
  }
}

// CLI entry — accept event from arg or stdin
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sys = new NotifySystem();
  await sys.init();

  let event;
  if (process.argv[2]) {
    try {
      event = JSON.parse(process.argv[2]);
    } catch {
      event = { message: process.argv[2] };
    }
  } else {
    event = {
      type: 'startup',
      source: 'notify-system',
      priority: 'success',
      title: 'Notify System Ready',
      message: 'All channels initialized and active',
      actor: 'system'
    };
  }

  const result = await sys.dispatch(event);
  console.log(result);
}

export { NotifySystem };
