#!/usr/bin/env bash
echo "🧹 Running Flake8..."
flake8 . --count --statistics

if [ $? -eq 0 ]; then
  echo "✅ Lint passed"
  exit 0
else
  echo "❌ Fix errors before committing"
  exit 1
fi
