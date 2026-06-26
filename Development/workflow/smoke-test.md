name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      # 🔹 Smoke Tests
      - name: Run Smoke Tests
        run: |
          npm run test:smoke
        # ตัวอย่าง smoke test: login, upload image, generate AI prompt, view gallery

      # 🔹 Unit Tests
      - name: Run Unit Tests
        run: npm run test:unit

      # 🔹 Visual Regression Tests
      - name: Run Playwright Visual Regression
        run: |
          npx playwright test --config=playwright.visual.config.ts

      # 🔹 Lint & Type Check
      - name: Run Lint
        run: npm run lint
      - name: Run TypeScript Check
        run: npm run typecheck

  # Optional: Budget Guardrail
  budget-guardrail:
    runs-on: ubuntu-latest
    steps:
      - name: Check API Rate Limits
        run: npm run test:rate-limit