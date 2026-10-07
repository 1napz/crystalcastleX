export class BaseChannel {
  constructor(config = {}) {
    this.config = config;
    this.name = this.constructor.name.replace('Channel', '').toLowerCase();
  }

  isEnabled() {
    return Boolean(this.config.enabled);
  }

  async send(event) {
    throw new Error(`${this.name}: send() not implemented`);
  }

  async test() {
    return this.isEnabled();
  }
}
