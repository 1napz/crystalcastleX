/**
 * Tests for doc/content_creator_strategy_v1.md
 *
 * Validates the structure and required content of the content creator
 * strategy document added in this PR.
 *
 * Run with: node --test test/content_creator_strategy_v1.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOC_PATH = resolve(__dirname, '..', 'doc', 'content_creator_strategy_v1.md');

let content;

// Load file once; fail fast if missing so individual tests have clear errors.
try {
  content = readFileSync(DOC_PATH, 'utf8');
} catch {
  content = null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns all lines of the document. */
const lines = () => content.split('\n');

/** Returns lines that match a given prefix (e.g. '| ' for table rows). */
const tableDataRows = (sectionHeading) => {
  const allLines = lines();
  let inside = false;
  const rows = [];
  for (const line of allLines) {
    if (line.startsWith('## ') && line.includes(sectionHeading)) {
      inside = true;
      continue;
    }
    if (inside) {
      if (line.startsWith('## ') || line.startsWith('# ')) break; // next section
      // Table rows start with '|' but skip separator rows (e.g. '| --- |')
      if (line.startsWith('|') && !line.replace(/\|/g, '').trim().match(/^[-\s]+$/)) {
        // Skip the header row (first row that follows the table header separator)
        rows.push(line);
      }
    }
  }
  // Separator rows are already excluded by the regex filter above, so
  // rows[0] is the header row and rows[1..n] are the data rows.
  return rows.slice(1);
};

/** Returns checkbox list items (lines starting with '- [ ]') under a section. */
const checklistItems = (sectionHeading) => {
  const allLines = lines();
  let inside = false;
  const items = [];
  for (const line of allLines) {
    if (line.startsWith('## ') && line.includes(sectionHeading)) {
      inside = true;
      continue;
    }
    if (inside) {
      if (line.startsWith('## ') || line.startsWith('# ')) break;
      if (line.startsWith('- [ ]') || line.startsWith('- [x]') || line.startsWith('- [X]')) {
        items.push(line);
      }
    }
  }
  return items;
};

/** Returns numbered list items under a section. */
const numberedItems = (sectionHeading) => {
  const allLines = lines();
  let inside = false;
  const items = [];
  for (const line of allLines) {
    if (line.startsWith('## ') && line.includes(sectionHeading)) {
      inside = true;
      continue;
    }
    if (inside) {
      if (line.startsWith('## ') || line.startsWith('# ')) break;
      if (/^\d+\./.test(line.trim())) {
        items.push(line.trim());
      }
    }
  }
  return items;
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('doc/content_creator_strategy_v1.md', () => {

  describe('File presence and readability', () => {
    it('should exist at doc/content_creator_strategy_v1.md', () => {
      assert.ok(existsSync(DOC_PATH), `File not found: ${DOC_PATH}`);
    });

    it('should be non-empty', () => {
      assert.ok(content !== null, 'Could not read file');
      assert.ok(content.trim().length > 0, 'File is empty');
    });

    it('should be valid UTF-8 text (no null bytes)', () => {
      assert.ok(content !== null, 'Could not read file');
      assert.ok(!content.includes('\0'), 'File contains null bytes');
    });
  });

  describe('H1 document title', () => {
    it('should contain a top-level H1 heading', () => {
      const h1Lines = lines().filter((l) => l.startsWith('# '));
      assert.ok(h1Lines.length >= 1, 'No H1 heading found');
    });

    it('should include "Content Strategy" in the H1 title', () => {
      const h1 = lines().find((l) => l.startsWith('# '));
      assert.ok(h1, 'No H1 heading found');
      assert.ok(
        h1.includes('Content Strategy') || h1.includes('คอนเทนต์'),
        `H1 does not mention Content Strategy: "${h1}"`
      );
    });
  });

  describe('Required H2 sections', () => {
    const REQUIRED_SECTIONS = [
      'ไอเดียหลัก',          // Main ideas section
      'Weekly Planner',        // Weekly planner (EN label)
      'Short Video Script',    // Script template (EN label)
      'Pre-Post Checklist',    // Pre-post checklist (EN label)
    ];

    for (const section of REQUIRED_SECTIONS) {
      it(`should contain a section matching "${section}"`, () => {
        assert.ok(content !== null, 'Could not read file');
        const h2Lines = lines().filter((l) => l.startsWith('## '));
        const found = h2Lines.some((l) => l.includes(section));
        assert.ok(found, `Section "${section}" not found in H2 headings. Found: ${h2Lines.join(' | ')}`);
      });
    }
  });

  describe('Main ideas section — 3 numbered items', () => {
    it('should list exactly 3 main ideas', () => {
      const items = numberedItems('ไอเดียหลัก');
      assert.strictEqual(items.length, 3, `Expected 3 main ideas, got ${items.length}: ${items.join(', ')}`);
    });

    it('should include a short video idea', () => {
      const items = numberedItems('ไอเดียหลัก');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('Short Video') || combined.includes('บทวิดีโอสั้น'),
        'Short video idea not found'
      );
    });

    it('should include a multi-platform strategy idea', () => {
      const items = numberedItems('ไอเดียหลัก');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('Multi-Platform') || combined.includes('หลายแพลตฟอร์ม'),
        'Multi-platform strategy idea not found'
      );
    });

    it('should include a fashion trend forecasting idea', () => {
      const items = numberedItems('ไอเดียหลัก');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('Fashion Trend Forecasting') || combined.includes('พยากรณ์เทรนด์'),
        'Fashion trend forecasting idea not found'
      );
    });
  });

  describe('Weekly Planner table', () => {
    it('should have exactly 5 data rows (Monday to Friday)', () => {
      const rows = tableDataRows('Weekly Planner');
      assert.strictEqual(rows.length, 5, `Expected 5 weekday rows, got ${rows.length}`);
    });

    it('should reference ShopeeVideo as a platform', () => {
      const rows = tableDataRows('Weekly Planner');
      const rowText = rows.join('\n');
      assert.ok(rowText.includes('ShopeeVideo'), 'ShopeeVideo not found in Weekly Planner');
    });

    it('should reference Threads as a platform', () => {
      const rows = tableDataRows('Weekly Planner');
      const rowText = rows.join('\n');
      assert.ok(rowText.includes('Threads'), 'Threads not found in Weekly Planner');
    });

    it('should reference X (Twitter) as a platform', () => {
      const rows = tableDataRows('Weekly Planner');
      const rowText = rows.join('\n');
      assert.ok(rowText.includes('X (Twitter)') || rowText.includes('X ('), 'X (Twitter) not found in Weekly Planner');
    });

    it('should reference Line as a platform', () => {
      const rows = tableDataRows('Weekly Planner');
      const rowText = rows.join('\n');
      assert.ok(rowText.includes('Line'), 'Line not found in Weekly Planner');
    });

    it('should include OOTD content', () => {
      const rows = tableDataRows('Weekly Planner');
      const rowText = rows.join('\n');
      assert.ok(rowText.includes('OOTD'), 'OOTD not found in Weekly Planner');
    });
  });

  describe('Short Video Script Template table', () => {
    const REQUIRED_COMPONENTS = ['Hook', 'Body', 'Value', 'CTA'];

    for (const component of REQUIRED_COMPONENTS) {
      it(`should include script component: ${component}`, () => {
        assert.ok(content !== null, 'Could not read file');
        assert.ok(
          content.includes(`**${component}`),
          `Script component "${component}" not found`
        );
      });
    }

    it('should mention time ranges in the Hook component (0-3s)', () => {
      assert.ok(content.includes('0-3s'), 'Hook time range "0-3s" not found');
    });

    it('should mention a call-to-action instruction in the CTA component', () => {
      // CTA row should have Thai text about directing viewers somewhere
      const ctaLineIndex = lines().findIndex((l) => l.includes('**CTA'));
      assert.ok(ctaLineIndex >= 0, 'CTA row not found');
      const ctaLine = lines()[ctaLineIndex];
      assert.ok(ctaLine.length > 10, 'CTA row appears to have no content');
    });

    it('should have 4 data rows in the script template table', () => {
      const rows = tableDataRows('Short Video Script');
      assert.strictEqual(rows.length, 4, `Expected 4 script template rows, got ${rows.length}`);
    });
  });

  describe('Pre-Post Checklist', () => {
    it('should contain exactly 4 checklist items', () => {
      const items = checklistItems('Pre-Post Checklist');
      assert.strictEqual(items.length, 4, `Expected 4 checklist items, got ${items.length}`);
    });

    it('should include a hashtag reminder item', () => {
      const items = checklistItems('Pre-Post Checklist');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('Hashtag') || combined.includes('#'),
        'Hashtag checklist item not found'
      );
    });

    it('should include an audio/video quality check item', () => {
      const items = checklistItems('Pre-Post Checklist');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('เสียง') || combined.includes('แสง') || combined.includes('คุณภาพ'),
        'Audio/video quality check item not found'
      );
    });

    it('should include an affiliate link verification item', () => {
      const items = checklistItems('Pre-Post Checklist');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('Affiliate Link') || combined.includes('ลิงก์สินค้า'),
        'Affiliate link check item not found'
      );
    });

    it('should include a brand tone/color item', () => {
      const items = checklistItems('Pre-Post Checklist');
      const combined = items.join(' ');
      assert.ok(
        combined.includes('Mood') || combined.includes('Tone') || combined.includes('โทนสี'),
        'Brand tone/color item not found'
      );
    });

    it('all checklist items should use unchecked markdown syntax "- [ ]"', () => {
      const items = checklistItems('Pre-Post Checklist');
      for (const item of items) {
        assert.ok(
          item.startsWith('- [ ]'),
          `Checklist item is not in unchecked format: "${item}"`
        );
      }
    });
  });

  describe('Document footer / notes', () => {
    it('should contain a footer note (หมายเหตุ)', () => {
      assert.ok(content !== null, 'Could not read file');
      assert.ok(content.includes('หมายเหตุ'), 'Footer note (หมายเหตุ) not found');
    });
  });

  describe('Document integrity (regression / boundary checks)', () => {
    it('should have at least 49 lines', () => {
      const lineCount = lines().length;
      assert.ok(lineCount >= 49, `Document has fewer lines than expected: ${lineCount}`);
    });

    it('should contain exactly 4 H2 sections', () => {
      const h2Count = lines().filter((l) => l.startsWith('## ')).length;
      assert.strictEqual(h2Count, 4, `Expected 4 H2 sections, found ${h2Count}`);
    });

    it('should contain at least 4 horizontal rules (---)', () => {
      const hrCount = lines().filter((l) => l.trim() === '---').length;
      assert.ok(hrCount >= 4, `Expected at least 4 horizontal rules, found ${hrCount}`);
    });

    it('should not contain any broken placeholder text (TODO/FIXME/TBD)', () => {
      const upper = content.toUpperCase();
      assert.ok(!upper.includes('TODO'), 'Document contains TODO placeholder');
      assert.ok(!upper.includes('FIXME'), 'Document contains FIXME placeholder');
      assert.ok(!upper.includes('TBD'), 'Document contains TBD placeholder');
    });

    it('should not have Windows-style line endings (CRLF)', () => {
      assert.ok(!content.includes('\r\n'), 'Document uses CRLF line endings; expected LF only');
    });
  });
});
