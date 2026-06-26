/**
 * Tests for workflows/test.yml
 *
 * This PR changed the target branches in the CI workflow from 'master' to 'main'.
 * These tests guard against accidental regression to the old branch names and
 * verify the overall structural integrity of the workflow file.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const WORKFLOW_PATH = path.join(__dirname, '..', '..', 'workflows', 'test.yml');

let workflowContent;

beforeAll(() => {
  workflowContent = fs.readFileSync(WORKFLOW_PATH, 'utf8');
});

describe('workflows/test.yml – branch configuration', () => {
  it('file exists and is readable', () => {
    expect(() => fs.readFileSync(WORKFLOW_PATH, 'utf8')).not.toThrow();
  });

  it('triggers on push to main branch (not master)', () => {
    // The PR renamed master → main for push triggers
    expect(workflowContent).toMatch(/branches:\s*\[main/);
  });

  it('does not trigger on push to master branch', () => {
    // Regression: ensure old 'master' branch name was not kept
    // The workflow name line mentions 'master' nowhere in branch lists
    const pushSection = workflowContent.match(/push:\s*\n\s*branches:[^\n]+/);
    expect(pushSection).not.toBeNull();
    expect(pushSection[0]).not.toContain('master');
  });

  it('triggers on pull_request targeting main branch', () => {
    expect(workflowContent).toContain('pull_request:');
    // After the PR the pull_request trigger should target main
    const lines = workflowContent.split('\n');
    const prIndex = lines.findIndex((l) => l.trim() === 'pull_request:');
    expect(prIndex).toBeGreaterThan(-1);
    // The branches line immediately follows pull_request:
    const branchLine = lines.slice(prIndex + 1, prIndex + 3).join('\n');
    expect(branchLine).toContain('main');
    expect(branchLine).not.toContain('master');
  });

  it('includes develop branch in push triggers', () => {
    // develop branch was unchanged – it must still be present
    const pushSection = workflowContent.match(/push:\s*\n\s*branches:[^\n]+/);
    expect(pushSection).not.toBeNull();
    expect(pushSection[0]).toContain('develop');
  });
});

describe('workflows/test.yml – workflow structure', () => {
  it('is named "Run Tests"', () => {
    expect(workflowContent).toMatch(/^name:\s*Run Tests/m);
  });

  it('defines a test job', () => {
    expect(workflowContent).toContain('test:');
  });

  it('runs on ubuntu-latest', () => {
    expect(workflowContent).toContain('ubuntu-latest');
  });

  it('tests against Node.js versions 18 and 20', () => {
    expect(workflowContent).toContain('node-version: [18, 20]');
  });

  it('includes a lint step', () => {
    expect(workflowContent).toContain('npm run lint');
  });

  it('includes a type-check step', () => {
    expect(workflowContent).toContain('npm run type-check');
  });

  it('includes a unit test step', () => {
    expect(workflowContent).toContain('npm test');
  });

  it('includes an integration test step', () => {
    expect(workflowContent).toContain('npm run test:integration');
  });

  it('uploads coverage to codecov', () => {
    expect(workflowContent).toContain('codecov/codecov-action');
  });

  it('uses actions/checkout@v4', () => {
    expect(workflowContent).toContain('actions/checkout@v4');
  });

  it('uses actions/setup-node@v4', () => {
    expect(workflowContent).toContain('actions/setup-node@v4');
  });
});