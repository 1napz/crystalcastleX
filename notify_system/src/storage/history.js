import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class HistoryLogger {
  constructor(logPath) {
    this.logPath = path.resolve(process.cwd(), logPath || './logs/notify_history.json');
    this.ensureLogDir();
  }

  async ensureLogDir() {
    const dir = path.dirname(this.logPath);
    await fs.mkdir(dir, { recursive: true });
  }

  async append(record) {
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      ...record
    }) + '\n';
    
    await fs.appendFile(this.logPath, line, 'utf8');
  }

  async recent(limit = 50) {
    try {
      const content = await fs.readFile(this.logPath, 'utf8');
      return content
        .trim()
        .split('\n')
        .filter(Boolean)
        .map(line => JSON.parse(line))
        .slice(-limit);
    } catch {
      return [];
    }
  }
}
