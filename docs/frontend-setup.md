`markdown

Frontend Setup Script

This script restructures the CrystalCastle repo, updates workflows, and generates deploy/PR/Issue status JSON for the governance dashboard.

`bash

!/bin/bash

frontend-setup.sh

CrystalCastle Frontend Restructure + Workflow Update + Deploy Status + Severity Escalation (PRs + Issues)

set -e

echo "📂 Creating frontend folder..."
mkdir -p frontend

Move UI files
for file in index.html dashboard.html working-space.html style.css dashboard.css dashboard.js; do
  if [ -f "$file" ]; then
    mv "$file" frontend/
    echo "✅ Moved $file"
  else
    echo "⚠️ $file not found, skipping"
  fi
done

Update HTML references
for html in frontend/*.html; do
  sed -i 's|href="style.css"|href="frontend/style.css"|g' "$html"
  sed -i 's|src="dashboard.js"|src="frontend/dashboard.js"|g' "$html"
done

Append updated structure to README.md
...

Generate deploy-status.json, pr-status.json, issue-status.json
...
`
`

---

🚀 Benefits of Saving to .md
- Reviewer visibility → script is documented in repo, not hidden in .sh.  
- Governance → Markdown allows bilingual notes, checklists, and Kanban boards alongside the script.  
- Audit trail → version control tracks changes to automation scripts.  

---

👉 Suggestion: Place this file under docs/automation/frontend-setup.md and link it from your Documentation Hub index.md. That way reviewers can see both the script and the governance Kanban board in one place.  
