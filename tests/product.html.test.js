/**
 * Tests for product.html — PR changes:
 * - videoEngineSelect dropdown added (replaces genFALBtn / genHFBtn)
 * - engineInfo element added
 * - cta-generator.js script removed
 * - speed-insights.js script removed
 * - Tool section restructured to 3-column grid
 * - HTML head fixed (no merge conflict artifacts)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeAll } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let document;

beforeAll(() => {
  const html = readFileSync(join(__dirname, '..', 'product.html'), 'utf-8');
  const dom = new JSDOM(html);
  document = dom.window.document;
});

// ─── Section 5: videoEngineSelect dropdown (new in this PR) ──────────────────

describe('videoEngineSelect dropdown', () => {
  it('exists in the DOM', () => {
    expect(document.getElementById('videoEngineSelect')).not.toBeNull();
  });

  it('has exactly 6 options', () => {
    const select = document.getElementById('videoEngineSelect');
    expect(select.options.length).toBe(6);
  });

  it('first option value is "fal" (default selected engine)', () => {
    const select = document.getElementById('videoEngineSelect');
    expect(select.options[0].value).toBe('fal');
  });

  it('contains option with value "magic"', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toContain('magic');
  });

  it('contains option with value "runway"', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toContain('runway');
  });

  it('contains option with value "pika"', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toContain('pika');
  });

  it('contains option with value "nexa"', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toContain('nexa');
  });

  it('contains option with value "wavespeed"', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toContain('wavespeed');
  });

  it('has all six expected engine values in correct order', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toEqual(['fal', 'magic', 'runway', 'pika', 'nexa', 'wavespeed']);
  });

  it('is a <select> element', () => {
    const el = document.getElementById('videoEngineSelect');
    expect(el.tagName.toLowerCase()).toBe('select');
  });
});

// ─── engineInfo element (new in this PR) ─────────────────────────────────────

describe('engineInfo element', () => {
  it('exists in the DOM', () => {
    expect(document.getElementById('engineInfo')).not.toBeNull();
  });

  it('is a <p> element', () => {
    const el = document.getElementById('engineInfo');
    expect(el.tagName.toLowerCase()).toBe('p');
  });

  it('has non-empty initial text content', () => {
    const el = document.getElementById('engineInfo');
    expect(el.textContent.trim().length).toBeGreaterThan(0);
  });
});

// ─── Removed elements (genFALBtn and genHFBtn) ───────────────────────────────

describe('removed buttons from previous version', () => {
  it('genFALBtn does not exist in the DOM', () => {
    expect(document.getElementById('genFALBtn')).toBeNull();
  });

  it('genHFBtn does not exist in the DOM', () => {
    expect(document.getElementById('genHFBtn')).toBeNull();
  });
});

// ─── Retained canvas tool buttons ────────────────────────────────────────────

describe('canvas tool buttons still present', () => {
  it('genIntroBtn exists', () => {
    expect(document.getElementById('genIntroBtn')).not.toBeNull();
  });

  it('genCTABtn exists', () => {
    expect(document.getElementById('genCTABtn')).not.toBeNull();
  });

  it('genThumbnailBtn exists', () => {
    expect(document.getElementById('genThumbnailBtn')).not.toBeNull();
  });

  it('tool section uses 3-column grid layout for canvas buttons', () => {
    const introBtn = document.getElementById('genIntroBtn');
    const parentGrid = introBtn.closest('.grid-cols-3');
    expect(parentGrid).not.toBeNull();
  });

  it('canvas button container does not use 5-column grid', () => {
    const introBtn = document.getElementById('genIntroBtn');
    const fiveColGrid = introBtn.closest('.grid-cols-5');
    expect(fiveColGrid).toBeNull();
  });
});

// ─── Script tags (removed and retained) ──────────────────────────────────────

describe('script tags', () => {
  it('product.js script is present', () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const hasProductJs = scripts.some(s => s.getAttribute('src') === 'product.js');
    expect(hasProductJs).toBe(true);
  });

  it('cta-generator.js script is NOT present', () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const hasCTAScript = scripts.some(s => s.getAttribute('src').includes('cta-generator'));
    expect(hasCTAScript).toBe(false);
  });

  it('speed-insights.js script is NOT present', () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const hasSpeedInsights = scripts.some(s => s.getAttribute('src').includes('speed-insights'));
    expect(hasSpeedInsights).toBe(false);
  });
});

// ─── HTML <head> validity ─────────────────────────────────────────────────────

describe('HTML head validity', () => {
  it('has a well-formed title element', () => {
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent).toContain('@snapzreview');
  });

  it('has a properly closed meta description', () => {
    const desc = document.querySelector('meta[name="description"]');
    expect(desc).not.toBeNull();
    expect(desc.getAttribute('content')).toBeTruthy();
    // content must not be cut off mid-sentence (old bug had unclosed attribute)
    expect(desc.getAttribute('content').length).toBeGreaterThan(0);
  });

  it('has charset UTF-8', () => {
    const charset = document.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
    expect(charset.getAttribute('charset').toUpperCase()).toBe('UTF-8');
  });

  it('has viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
  });

  it('does not contain merge conflict markers', () => {
    const html = readFileSync(
      join(__dirname, '..', 'product.html'),
      'utf-8'
    );
    expect(html).not.toContain('<<<<<<<');
    expect(html).not.toContain('>>>>>>>');
    expect(html).not.toContain('=======');
  });
});

// ─── Core UI elements (unrelated to section 5, regression safety) ────────────

describe('core UI elements still present', () => {
  it('generateBtn exists', () => {
    expect(document.getElementById('generateBtn')).not.toBeNull();
  });

  it('fileInput exists', () => {
    expect(document.getElementById('fileInput')).not.toBeNull();
  });

  it('uploadBtn exists', () => {
    expect(document.getElementById('uploadBtn')).not.toBeNull();
  });

  it('promptInput exists', () => {
    expect(document.getElementById('promptInput')).not.toBeNull();
  });

  it('videoEngineSelect is inside section 5 tool section', () => {
    const select = document.getElementById('videoEngineSelect');
    // The select should be nested inside a section in main
    const section = select.closest('section');
    expect(section).not.toBeNull();
  });

  it('updated footer hint text references engine selection', () => {
    // The new text tells users to pick an engine before generating
    const allText = document.body.textContent;
    expect(allText).toContain('Engine');
  });
});

// ─── Boundary / negative cases ────────────────────────────────────────────────

describe('boundary and negative cases', () => {
  it('videoEngineSelect does not have a "fal" button (old genFALBtn replaced by dropdown)', () => {
    // Confirm FAL is only accessible via dropdown, not standalone button
    const falBtn = document.getElementById('genFALBtn');
    const select = document.getElementById('videoEngineSelect');
    expect(falBtn).toBeNull();
    expect(select).not.toBeNull();
  });

  it('exactly one videoEngineSelect exists (no duplicates)', () => {
    const selects = document.querySelectorAll('#videoEngineSelect');
    expect(selects.length).toBe(1);
  });

  it('exactly one engineInfo element exists (no duplicates)', () => {
    const infos = document.querySelectorAll('#engineInfo');
    expect(infos.length).toBe(1);
  });

  it('videoEngineSelect options have distinct non-empty values', () => {
    const select = document.getElementById('videoEngineSelect');
    const values = Array.from(select.options).map(o => o.value);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
    values.forEach(v => expect(v.trim().length).toBeGreaterThan(0));
  });
});
