/**
 * Tests for .gitignore patterns
 *
 * Validates that the .gitignore rules correctly ignore secrets, build
 * artifacts, and OS files, while preserving files that should be tracked.
 *
 * The PR updated .gitignore from a sprawling list to a focused set of rules:
 *   - config.js (secrets)
 *   - .env / .env.* (environment variables, with !.env.example exception)
 *   - node_modules/
 *   - .vercel / .now (Vercel deployment artifacts)
 *   - Log files (npm-debug.log*, yarn-*, pnpm-debug.log*)
 *   - OS files (.DS_Store, Thumbs.db)
 *   - Build output (dist/, build/, .next/, out/)
 */

'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');

/**
 * Run `git check-ignore --quiet <filePath>` in the repo root.
 * Returns true if git would ignore the file, false otherwise.
 *
 * @param {string} filePath - Path relative to repo root
 * @returns {boolean}
 */
function isIgnored(filePath) {
  try {
    execSync(`git check-ignore --quiet -- ${JSON.stringify(filePath)}`, {
      cwd: REPO_ROOT,
      stdio: 'pipe',
    });
    // Exit code 0 → file is ignored
    return true;
  } catch (err) {
    // Exit code 1 → file is NOT ignored
    // Exit code 128 → git error (re-throw)
    if (err.status === 1) return false;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Secrets & Configuration
// ---------------------------------------------------------------------------

describe('.gitignore — secrets and configuration', () => {
  test('ignores config.js (runtime config with secrets)', () => {
    assert.ok(isIgnored('config.js'), 'config.js must be ignored');
  });

  test('does NOT ignore config.example.js (safe template)', () => {
    assert.ok(!isIgnored('config.example.js'), 'config.example.js must not be ignored');
  });
});

// ---------------------------------------------------------------------------
// Environment Variable Files
// ---------------------------------------------------------------------------

describe('.gitignore — environment variable files', () => {
  test('ignores .env (base env file)', () => {
    assert.ok(isIgnored('.env'), '.env must be ignored');
  });

  test('ignores .env.local', () => {
    assert.ok(isIgnored('.env.local'), '.env.local must be ignored');
  });

  test('ignores .env.production', () => {
    assert.ok(isIgnored('.env.production'), '.env.production must be ignored');
  });

  test('ignores .env.development', () => {
    assert.ok(isIgnored('.env.development'), '.env.development must be ignored');
  });

  test('ignores .env.test', () => {
    assert.ok(isIgnored('.env.test'), '.env.test must be ignored');
  });

  test('does NOT ignore .env.example (negation rule — safe to commit)', () => {
    // The !.env.example rule must override the .env.* glob
    assert.ok(!isIgnored('.env.example'), '.env.example must NOT be ignored');
  });
});

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------

describe('.gitignore — dependencies', () => {
  test('ignores node_modules/ directory', () => {
    assert.ok(isIgnored('node_modules/'), 'node_modules/ must be ignored');
  });

  test('ignores files inside node_modules/', () => {
    assert.ok(isIgnored('node_modules/some-package/index.js'), 'files inside node_modules/ must be ignored');
  });
});

// ---------------------------------------------------------------------------
// Vercel / Deployment Artifacts
// ---------------------------------------------------------------------------

describe('.gitignore — Vercel and deployment artifacts', () => {
  test('ignores .vercel', () => {
    assert.ok(isIgnored('.vercel'), '.vercel must be ignored');
  });

  test('ignores .now', () => {
    assert.ok(isIgnored('.now'), '.now must be ignored');
  });
});

// ---------------------------------------------------------------------------
// Log Files
// ---------------------------------------------------------------------------

describe('.gitignore — log files', () => {
  test('ignores npm-debug.log', () => {
    assert.ok(isIgnored('npm-debug.log'), 'npm-debug.log must be ignored');
  });

  test('ignores npm-debug.log with suffix (npm-debug.log.1)', () => {
    assert.ok(isIgnored('npm-debug.log.1'), 'npm-debug.log.1 must be ignored');
  });

  test('ignores yarn-error.log (yarn-* pattern)', () => {
    assert.ok(isIgnored('yarn-error.log'), 'yarn-error.log must be ignored');
  });

  test('ignores yarn-debug.log (yarn-* pattern)', () => {
    assert.ok(isIgnored('yarn-debug.log'), 'yarn-debug.log must be ignored');
  });

  test('ignores pnpm-debug.log (pnpm-debug.log* pattern)', () => {
    assert.ok(isIgnored('pnpm-debug.log'), 'pnpm-debug.log must be ignored');
  });

  test('ignores pnpm-debug.log.1 (pnpm-debug.log* pattern)', () => {
    assert.ok(isIgnored('pnpm-debug.log.1'), 'pnpm-debug.log.1 must be ignored');
  });

  test('does NOT ignore application.log (not a matched log pattern)', () => {
    assert.ok(!isIgnored('application.log'), 'application.log must not be ignored');
  });
});

// ---------------------------------------------------------------------------
// OS-Generated Files
// ---------------------------------------------------------------------------

describe('.gitignore — OS-generated files', () => {
  test('ignores .DS_Store (macOS metadata)', () => {
    assert.ok(isIgnored('.DS_Store'), '.DS_Store must be ignored');
  });

  test('ignores Thumbs.db (Windows thumbnail cache)', () => {
    assert.ok(isIgnored('Thumbs.db'), 'Thumbs.db must be ignored');
  });
});

// ---------------------------------------------------------------------------
// Build Output Directories
// ---------------------------------------------------------------------------

describe('.gitignore — build output directories', () => {
  test('ignores dist/', () => {
    assert.ok(isIgnored('dist/'), 'dist/ must be ignored');
  });

  test('ignores build/', () => {
    assert.ok(isIgnored('build/'), 'build/ must be ignored');
  });

  test('ignores .next/', () => {
    assert.ok(isIgnored('.next/'), '.next/ must be ignored');
  });

  test('ignores out/', () => {
    assert.ok(isIgnored('out/'), 'out/ must be ignored');
  });

  test('ignores files inside dist/', () => {
    assert.ok(isIgnored('dist/bundle.js'), 'files inside dist/ must be ignored');
  });

  test('ignores files inside .next/', () => {
    assert.ok(isIgnored('.next/server/pages/index.js'), 'files inside .next/ must be ignored');
  });
});

// ---------------------------------------------------------------------------
// Files That Must NOT Be Ignored
// ---------------------------------------------------------------------------

describe('.gitignore — files that must remain tracked', () => {
  test('does NOT ignore README.md', () => {
    assert.ok(!isIgnored('README.md'), 'README.md must not be ignored');
  });

  test('does NOT ignore package.json', () => {
    assert.ok(!isIgnored('package.json'), 'package.json must not be ignored');
  });

  test('does NOT ignore index.html', () => {
    assert.ok(!isIgnored('index.html'), 'index.html must not be ignored');
  });

  test('does NOT ignore app.js (application source)', () => {
    assert.ok(!isIgnored('app.js'), 'app.js must not be ignored');
  });

  test('does NOT ignore api/prompt.js (Vercel function)', () => {
    assert.ok(!isIgnored('api/prompt.js'), 'api/prompt.js must not be ignored');
  });

  test('does NOT ignore style.css', () => {
    assert.ok(!isIgnored('style.css'), 'style.css must not be ignored');
  });

  test('does NOT ignore .gitignore itself', () => {
    assert.ok(!isIgnored('.gitignore'), '.gitignore itself must not be ignored');
  });

  // Boundary/regression: files whose names START LIKE ignored names but are different
  test('does NOT ignore configure.js (starts with "config" but not config.js)', () => {
    assert.ok(!isIgnored('configure.js'), 'configure.js must not be ignored — only exact config.js is matched');
  });

  test('does NOT ignore myconfig.js (contains "config" but is not config.js)', () => {
    assert.ok(!isIgnored('myconfig.js'), 'myconfig.js must not be ignored');
  });

  test('does NOT ignore dist.js (file named dist.js, not the dist/ directory)', () => {
    // dist/ is a directory pattern; dist.js is a regular file
    assert.ok(!isIgnored('dist.js'), 'dist.js file must not be ignored — only the dist/ directory is');
  });
});
