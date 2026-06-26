#!/bin/bash
# Consolidate workflow files into .github/workflows

# Ensure target directory exists
mkdir -p .github/workflows

# Move all YAML/YML files from workflows/ into .github/workflows
for file in workflows/*.yml workflows/*.yaml; do
  if [ -f "$file" ]; then
    git mv "$file" .github/workflows/
  fi
done

# Commit the changes
git commit -m "chore: consolidate workflows into .github/workflows"

# Push to your branch
git push origin <branch-name>
