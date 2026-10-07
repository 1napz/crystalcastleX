/**
 * Tests for the repository's test/coverage workflow.
 *
 * HISTORY: this file previously read `workflows/test.yml`, which never existed
 * in this repository -- verified absent from main AND from all fetched history.
 * Every assertion threw ENOENT in beforeAll, so the suite never passed, and it
 * was never wired into CI. It now targets the real workflow and asserts the
 * properties that file actually has.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const WORKFLOW_PATH = path.join(
  __dirname, '..', '..', '.github', 'workflows', 'test-and-coverage.yml'
);

let workflowContent;

beforeAll(() => {
  workflowContent = fs.readFileSync(WORKFLOW_PATH, 'utf8');
});

describe('test-and-coverage.yml - branch configuration', () => {
  it('file exists and is readable', () => {
    expect(() => fs.readFileSync(WORKFLOW_PATH, 'utf8')).not.toThrow();
  });

  it('triggers on push to main branch (not master)', () => {
    expect(workflowContent).toMatch(/push:\s*\n\s*branches:\s*\[main\]/);
  });

  it('does not reference the master branch at all', () => {
    expect(workflowContent).not.toMatch(/master/);
  });

  it('triggers on pull_request targeting main branch', () => {
    expect(workflowContent).toMatch(/pull_request:\s*\n\s*branches:\s*\[main\]/);
  });
});

describe('test-and-coverage.yml - workflow structure', () => {
  it('is named "Test & Coverage"', () => {
    expect(workflowContent).toMatch(/^name:\s*Test & Coverage$/m);
  });

  it('defines a test job', () => {
    expect(workflowContent).toContain('test:');
  });

  it('runs on ubuntu-latest', () => {
    expect(workflowContent).toContain('ubuntu-latest');
  });

  it('pins Node.js to version 20', () => {
    expect(workflowContent).toMatch(/node-version:\s*'20'/);
  });

  it('installs dependencies with npm ci', () => {
    expect(workflowContent).toContain('npm ci');
  });

  it('runs vitest with coverage', () => {
    expect(workflowContent).toContain('npx vitest run --coverage');
  });

  it('uploads coverage to codecov', () => {
    expect(workflowContent).toContain('codecov/codecov-action@v4');
  });

  it('uses actions/checkout@v4', () => {
    expect(workflowContent).toContain('actions/checkout@v4');
  });

  it('uses actions/setup-node@v4', () => {
    expect(workflowContent).toContain('actions/setup-node@v4');
  });
});
