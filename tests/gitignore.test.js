/**
 * Tests for .gitignore
 *
 * This PR replaced the old .gitignore with a simplified, security-focused version.
 * These tests verify the new patterns are present and old (removed) patterns are absent.
 */

'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const GITIGNORE_PATH = path.resolve(__dirname, '..', '.gitignore');

/**
 * Parse .gitignore lines into an array, filtering blank lines and comments.
 */
function parseGitignore(content) {
  return content
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

/**
 * Check if a given pattern exists in the parsed list of gitignore entries.
 */
function hasPattern(patterns, pattern) {
  return patterns.includes(pattern);
}

// ──────────────────────────────────────────────────────────────────────────────
// Setup: read the file once
// ──────────────────────────────────────────────────────────────────────────────

let rawContent;
let patterns;

test('setup: .gitignore file exists and is readable', () => {
  assert.ok(
    fs.existsSync(GITIGNORE_PATH),
    `.gitignore not found at ${GITIGNORE_PATH}`
  );
  rawContent = fs.readFileSync(GITIGNORE_PATH, 'utf8');
  patterns = parseGitignore(rawContent);
  assert.ok(rawContent.length > 0, '.gitignore should not be empty');
  assert.ok(patterns.length > 0, '.gitignore should have at least one active pattern');
});

// ──────────────────────────────────────────────────────────────────────────────
// Secrets / config protection (new in this PR)
// ──────────────────────────────────────────────────────────────────────────────

describe('secrets and config protection', () => {
  test('config.js is ignored to prevent leaking secrets', () => {
    rawContent = rawContent || fs.readFileSync(GITIGNORE_PATH, 'utf8');
    patterns = patterns || parseGitignore(rawContent);
    assert.ok(hasPattern(patterns, 'config.js'), 'config.js must be ignored');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Environment variable patterns
// ──────────────────────────────────────────────────────────────────────────────

describe('environment variable patterns', () => {
  test('.env exact file is ignored', () => {
    assert.ok(hasPattern(patterns, '.env'), '.env must be ignored');
  });

  test('.env.* wildcard pattern is present (covers .env.local, .env.production, etc.)', () => {
    assert.ok(hasPattern(patterns, '.env.*'), '.env.* wildcard must be ignored');
  });

  test('!.env.example negation allows env example file to be committed', () => {
    assert.ok(
      hasPattern(patterns, '!.env.example'),
      '!.env.example negation must be present to allow committing the example file'
    );
  });

  test('.env.example negation appears after the .env.* pattern', () => {
    const lines = parseGitignore(rawContent);
    const envStarIndex = lines.indexOf('.env.*');
    const negationIndex = lines.indexOf('!.env.example');
    assert.ok(envStarIndex !== -1, '.env.* pattern must exist');
    assert.ok(negationIndex !== -1, '!.env.example must exist');
    assert.ok(
      negationIndex > envStarIndex,
      '!.env.example must come after .env.* so the negation takes effect'
    );
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Dependencies
// ──────────────────────────────────────────────────────────────────────────────

describe('dependency directories', () => {
  test('node_modules/ is ignored', () => {
    assert.ok(hasPattern(patterns, 'node_modules/'), 'node_modules/ must be ignored');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Vercel deployment artifacts
// ──────────────────────────────────────────────────────────────────────────────

describe('Vercel deployment artifacts', () => {
  test('.vercel directory is ignored', () => {
    assert.ok(hasPattern(patterns, '.vercel'), '.vercel must be ignored');
  });

  test('.now directory is ignored (legacy Vercel deployment directory)', () => {
    assert.ok(hasPattern(patterns, '.now'), '.now must be ignored');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Log files
// ──────────────────────────────────────────────────────────────────────────────

describe('log file patterns', () => {
  test('npm-debug.log* pattern is present', () => {
    assert.ok(hasPattern(patterns, 'npm-debug.log*'), 'npm-debug.log* must be ignored');
  });

  test('yarn-* pattern is present (covers yarn-debug.log, yarn-error.log, etc.)', () => {
    assert.ok(hasPattern(patterns, 'yarn-*'), 'yarn-* must be ignored');
  });

  test('pnpm-debug.log* pattern is present (new addition for pnpm support)', () => {
    assert.ok(hasPattern(patterns, 'pnpm-debug.log*'), 'pnpm-debug.log* must be ignored');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// OS-generated files
// ──────────────────────────────────────────────────────────────────────────────

describe('OS-generated files', () => {
  test('.DS_Store is ignored (macOS metadata files)', () => {
    assert.ok(hasPattern(patterns, '.DS_Store'), '.DS_Store must be ignored');
  });

  test('Thumbs.db is ignored (Windows thumbnail cache)', () => {
    assert.ok(hasPattern(patterns, 'Thumbs.db'), 'Thumbs.db must be ignored');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Build output directories
// ──────────────────────────────────────────────────────────────────────────────

describe('build output directories', () => {
  test('dist/ is ignored', () => {
    assert.ok(hasPattern(patterns, 'dist/'), 'dist/ must be ignored');
  });

  test('build/ is ignored', () => {
    assert.ok(hasPattern(patterns, 'build/'), 'build/ must be ignored');
  });

  test('.next/ is ignored (Next.js build output)', () => {
    assert.ok(hasPattern(patterns, '.next/'), '.next/ must be ignored');
  });

  test('out/ is ignored (static export output)', () => {
    assert.ok(hasPattern(patterns, 'out/'), 'out/ must be ignored');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Patterns that were REMOVED in this PR (should NOT be present)
// ──────────────────────────────────────────────────────────────────────────────

describe('patterns removed in this PR (should not be present)', () => {
  test('.pnpm-store/ was removed (previously ignored, now not needed)', () => {
    assert.ok(
      !hasPattern(patterns, '.pnpm-store/'),
      '.pnpm-store/ should NOT be in the new .gitignore'
    );
  });

  test('.vscode/ was removed (IDE config can now be committed)', () => {
    assert.ok(
      !hasPattern(patterns, '.vscode/'),
      '.vscode/ should NOT be in the new .gitignore'
    );
  });

  test('.idea/ was removed (IDE config can now be committed)', () => {
    assert.ok(
      !hasPattern(patterns, '.idea/'),
      '.idea/ should NOT be in the new .gitignore'
    );
  });

  test('*.swp was removed (vim swap files no longer globally ignored)', () => {
    assert.ok(
      !hasPattern(patterns, '*.swp'),
      '*.swp should NOT be in the new .gitignore'
    );
  });

  test('*.swo was removed (vim swap files no longer globally ignored)', () => {
    assert.ok(
      !hasPattern(patterns, '*.swo'),
      '*.swo should NOT be in the new .gitignore'
    );
  });

  test('coverage/ was removed', () => {
    assert.ok(
      !hasPattern(patterns, 'coverage/'),
      'coverage/ should NOT be in the new .gitignore'
    );
  });

  test('.nyc_output was removed', () => {
    assert.ok(
      !hasPattern(patterns, '.nyc_output'),
      '.nyc_output should NOT be in the new .gitignore'
    );
  });

  test('test/ directory was removed from ignore list', () => {
    assert.ok(
      !hasPattern(patterns, 'test/'),
      'test/ should NOT be in the new .gitignore'
    );
  });

  test('tmp/ was removed', () => {
    assert.ok(
      !hasPattern(patterns, 'tmp/'),
      'tmp/ should NOT be in the new .gitignore'
    );
  });

  test('temp/ was removed', () => {
    assert.ok(
      !hasPattern(patterns, 'temp/'),
      'temp/ should NOT be in the new .gitignore'
    );
  });

  test('*.tmp was removed', () => {
    assert.ok(
      !hasPattern(patterns, '*.tmp'),
      '*.tmp should NOT be in the new .gitignore'
    );
  });

  test('/mocks/local/ was removed', () => {
    assert.ok(
      !hasPattern(patterns, '/mocks/local/'),
      '/mocks/local/ should NOT be in the new .gitignore'
    );
  });

  test('*.mock.js was removed', () => {
    assert.ok(
      !hasPattern(patterns, '*.mock.js'),
      '*.mock.js should NOT be in the new .gitignore'
    );
  });

  test('*.log wildcard was removed (replaced by specific log patterns)', () => {
    assert.ok(
      !hasPattern(patterns, '*.log'),
      '*.log should NOT be in the new .gitignore (replaced by specific patterns)'
    );
  });

  test('yarn-debug.log* was removed (replaced by broader yarn-* pattern)', () => {
    assert.ok(
      !hasPattern(patterns, 'yarn-debug.log*'),
      'yarn-debug.log* should NOT be in the new .gitignore (superseded by yarn-*)'
    );
  });

  test('.vercel/ (trailing slash) was removed - .vercel (no slash) is used instead', () => {
    assert.ok(
      !hasPattern(patterns, '.vercel/'),
      '.vercel/ (with slash) should NOT be in the new .gitignore; .vercel (no slash) is used'
    );
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Structural / format checks
// ──────────────────────────────────────────────────────────────────────────────

describe('file structure and format', () => {
  test('.gitignore contains exactly the expected number of active patterns', () => {
    const expectedPatterns = [
      'config.js',
      '.env',
      '.env.*',
      '!.env.example',
      'node_modules/',
      '.vercel',
      '.now',
      'npm-debug.log*',
      'yarn-*',
      'pnpm-debug.log*',
      '.DS_Store',
      'Thumbs.db',
      'dist/',
      'build/',
      '.next/',
      'out/',
    ];
    assert.deepEqual(
      patterns,
      expectedPatterns,
      'Active patterns in .gitignore should exactly match the expected set'
    );
  });

  test('.gitignore has at least one comment section for each group of patterns', () => {
    const commentLines = rawContent
      .split('\n')
      .filter((line) => line.trimStart().startsWith('#'));
    assert.ok(
      commentLines.length >= 5,
      `Expected at least 5 comment lines for grouping, found ${commentLines.length}`
    );
  });

  test('.gitignore uses LF line endings (Unix-style)', () => {
    // The file should not contain Windows-style CRLF endings
    assert.ok(
      !rawContent.includes('\r\n'),
      '.gitignore should use LF line endings, not CRLF'
    );
  });

  test('.gitignore does not contain duplicate patterns', () => {
    const seen = new Set();
    const duplicates = [];
    for (const p of patterns) {
      if (seen.has(p)) {
        duplicates.push(p);
      }
      seen.add(p);
    }
    assert.deepEqual(duplicates, [], `Duplicate patterns found: ${duplicates.join(', ')}`);
  });

  test('.gitignore ends with a newline', () => {
    assert.ok(rawContent.endsWith('\n'), '.gitignore should end with a newline character');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Security-oriented edge cases
// ──────────────────────────────────────────────────────────────────────────────

describe('security edge cases', () => {
  test('.env.local would be matched by .env.* pattern', () => {
    // Simulate gitignore pattern matching for .env.local
    const envStarPattern = '.env.*';
    assert.ok(
      hasPattern(patterns, envStarPattern),
      '.env.* must be present to cover .env.local'
    );
    // Verify .env.local matches .env.* via simple regex simulation
    const regex = new RegExp('^' + envStarPattern.replace('.', '\\.').replace('*', '.*') + '$');
    assert.ok(regex.test('.env.local'), '.env.local should match .env.* pattern');
    assert.ok(regex.test('.env.production'), '.env.production should match .env.* pattern');
    assert.ok(regex.test('.env.test'), '.env.test should match .env.* pattern');
  });

  test('.env.example is NOT matched by negation check (explicitly allowed)', () => {
    // .env.example should be in allowed list (negation pattern present)
    assert.ok(
      hasPattern(patterns, '!.env.example'),
      '!.env.example must be in patterns to allow committing the example env file'
    );
  });

  test('config.js is specifically named to prevent accidental secret leakage', () => {
    // config.js (exact filename) is ignored - this is a specific file, not a glob
    assert.ok(
      hasPattern(patterns, 'config.js'),
      'config.js must be explicitly ignored to protect local configuration with credentials'
    );
    // Ensure it is NOT a glob pattern (should be exact filename match)
    assert.ok(!patterns.some((p) => p === 'config*.js'), 'config*.js glob should not be used');
  });

  test('both .vercel and .now deployment directories are ignored', () => {
    assert.ok(hasPattern(patterns, '.vercel'), '.vercel must be ignored');
    assert.ok(hasPattern(patterns, '.now'), '.now must be ignored');
  });
});
