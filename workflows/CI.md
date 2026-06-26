name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      # ✅ Checkpoint 1: Only run lint if src/ files changed
      - name: Check for source file changes
        id: src_changes
        run: |
          echo "Checking for changes in src/..."
          git fetch origin ${{ github.base_ref }} --depth=1
          CHANGED=$(git diff --name-only origin/${{ github.base_ref }} HEAD | grep -E '^src/.*\.(js|ts|jsx|tsx)$' || true)
          if [ -z "$CHANGED" ]; then
            echo "no_src_changes=true" >> $GITHUB_OUTPUT
          else
            echo "no_src_changes=false" >> $GITHUB_OUTPUT
          fi

      - name: Run lint
        if: steps.src_changes.outputs.no_src_changes == 'false'
        run: npm run lint

      # ✅ Checkpoint 2: Skip tests if only docs changed
      - name: Check for docs-only changes
        id: docs_changes
        run: |
          echo "Checking if only docs changed..."
          git fetch origin ${{ github.base_ref }} --depth=1
          NON_DOCS=$(git diff --name-only origin/${{ github.base_ref }} HEAD | grep -vE '\.md$' || true)
          if [ -z "$NON_DOCS" ]; then
            echo "docs_only=true" >> $GITHUB_OUTPUT
          else
            echo "docs_only=false" >> $GITHUB_OUTPUT
          fi

      - name: Run tests
        if: steps.docs_changes.outputs.docs_only == 'false'
        run: npm test