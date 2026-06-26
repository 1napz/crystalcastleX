# CodeQL Code Scanning

CrystalCastle uses GitHub's CodeQL for automated security scanning in CI/CD pipelines.

## Setup

CodeQL scanning is configured via:
- `.github/workflows/codeql.yml` — Automated scanning on push/PR
- Supported languages: JavaScript, TypeScript, Python

## Running CodeQL Locally

```bash
npm run codeql:analyze
