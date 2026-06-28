#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# setup-compliance.sh
# รันสคริปต์นี้ที่ root ของ project เพื่อสร้างไฟล์ compliance ทั้งหมด
#
# Usage:
#   bash setup-compliance.sh
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

echo "🚀 Setting up compliance files..."
echo "═══════════════════════════════════════"

# ── สร้าง directories ────────────────────────────────────────────────────────
mkdir -p .github/workflows
mkdir -p .github/scripts/compliance

# ════════════════════════════════════════════════════════════════
# 1. compliance-license.yml
# ════════════════════════════════════════════════════════════════
cat > .github/workflows/compliance-license.yml << 'EOF'
name: Compliance · License

on:
  pull_request:
    branches: [main, develop]

jobs:
  license-check:
    name: License Structure Check
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Ensure labels exist
        uses: actions/github-script@v7
        with:
          script: |
            const labels = [
              { name: "license-compliant", color: "0e8a16", description: "✅ License structure is valid" },
              { name: "license-violation", color: "d93f0b", description: "❌ License structure is invalid" }
            ];
            for (const label of labels) {
              try {
                await github.rest.issues.createLabel({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  ...label
                });
              } catch (e) { /* already exists */ }
            }

      - name: Verify license structure
        id: check
        run: bash .github/scripts/compliance/check-license.sh

      - name: Update PR label
        uses: actions/github-script@v7
        with:
          script: |
            const newLabel = "${{ steps.check.outputs.label }}";
            const opposite = newLabel === "license-compliant"
              ? "license-violation" : "license-compliant";
            try {
              await github.rest.issues.removeLabel({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                name: opposite
              });
            } catch (e) {}
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              labels: [newLabel]
            });

      - name: Post compliance comment
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          LABEL: ${{ steps.check.outputs.label }}
          VIOLATIONS: ${{ steps.check.outputs.violations }}
          WARNINGS: ${{ steps.check.outputs.warnings }}
          DOCS_STATUS: ${{ steps.check.outputs.docs_status }}
          LICENSE_TYPE: ${{ steps.check.outputs.license_type }}
          PKG_LICENSE: ${{ steps.check.outputs.pkg_license }}
          REPORT_TYPE: license
        run: node .github/scripts/compliance/post-comment.js

      - name: Fail if license violation
        if: steps.check.outputs.label == 'license-violation'
        run: |
          echo "::error::❌ License violation detected!"
          exit 1
EOF

echo "✅ Created: .github/workflows/compliance-license.yml"

# ════════════════════════════════════════════════════════════════
# 2. compliance-security.yml
# ════════════════════════════════════════════════════════════════
cat > .github/workflows/compliance-security.yml << 'EOF'
name: Compliance · Security

on:
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: "0 2 * * 1"

jobs:
  security-check:
    name: Security Compliance Check
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Ensure labels exist
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const labels = [
              { name: "security-compliant", color: "0e8a16", description: "✅ No known vulnerabilities" },
              { name: "security-violation", color: "d93f0b", description: "❌ Security issues detected" }
            ];
            for (const label of labels) {
              try {
                await github.rest.issues.createLabel({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  ...label
                });
              } catch (e) {}
            }

      - name: Detect project type
        id: detect
        run: |
          [ -f package.json ] && echo "has_node=true" >> $GITHUB_OUTPUT || echo "has_node=false" >> $GITHUB_OUTPUT
          ([ -f requirements.txt ] || [ -f pyproject.toml ]) && echo "has_python=true" >> $GITHUB_OUTPUT || echo "has_python=false" >> $GITHUB_OUTPUT

      - uses: actions/setup-node@v4
        if: steps.detect.outputs.has_node == 'true'
        with:
          node-version: "20"

      - name: Run npm audit
        id: npm_audit
        if: steps.detect.outputs.has_node == 'true'
        run: bash .github/scripts/compliance/check-security.sh npm
        continue-on-error: true

      - name: Run pip audit
        id: pip_audit
        if: steps.detect.outputs.has_python == 'true'
        run: bash .github/scripts/compliance/check-security.sh pip
        continue-on-error: true

      - name: Scan for hardcoded secrets
        id: secret_scan
        run: bash .github/scripts/compliance/check-security.sh secrets
        continue-on-error: true

      - name: Evaluate security status
        id: evaluate
        run: |
          label="security-compliant"
          critical="${{ steps.npm_audit.outputs.critical || '0' }}"
          high="${{ steps.npm_audit.outputs.high || '0' }}"
          pip_vulns="${{ steps.pip_audit.outputs.vuln_count || '0' }}"
          secret_found="${{ steps.secret_scan.outputs.found || '0' }}"

          if [ "$critical" -gt 0 ] || [ "$high" -gt 0 ] || \
             [ "$pip_vulns" -gt 0 ] || [ "$secret_found" -eq 1 ]; then
            label="security-violation"
          fi
          echo "label=${label}" >> $GITHUB_OUTPUT

      - name: Update PR label
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const newLabel = "${{ steps.evaluate.outputs.label }}";
            const opposite = newLabel === "security-compliant"
              ? "security-violation" : "security-compliant";
            try {
              await github.rest.issues.removeLabel({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                name: opposite
              });
            } catch (e) {}
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              labels: [newLabel]
            });

      - name: Post security comment
        if: github.event_name == 'pull_request'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          LABEL: ${{ steps.evaluate.outputs.label }}
          NPM_CRITICAL: ${{ steps.npm_audit.outputs.critical || 'N/A' }}
          NPM_HIGH: ${{ steps.npm_audit.outputs.high || 'N/A' }}
          NPM_MODERATE: ${{ steps.npm_audit.outputs.moderate || 'N/A' }}
          NPM_LOW: ${{ steps.npm_audit.outputs.low || 'N/A' }}
          PIP_VULNS: ${{ steps.pip_audit.outputs.vuln_count || 'N/A' }}
          SECRET_FOUND: ${{ steps.secret_scan.outputs.found || '0' }}
          SECRET_DETAILS: ${{ steps.secret_scan.outputs.details || '' }}
          REPORT_TYPE: security
        run: node .github/scripts/compliance/post-comment.js

      - name: Fail if security violation
        if: steps.evaluate.outputs.label == 'security-violation'
        run: |
          echo "::error::❌ Security violation detected!"
          exit 1
EOF

echo "✅ Created: .github/workflows/compliance-security.yml"

# ════════════════════════════════════════════════════════════════
# 3. check-license.sh
# ════════════════════════════════════════════════════════════════
cat > .github/scripts/compliance/check-license.sh << 'EOF'
#!/usr/bin/env bash
# .github/scripts/compliance/check-license.sh
set -euo pipefail

echo "🔍 Starting license compliance check..."
echo "────────────────────────────────────────"

label="license-compliant"
violations=""
warnings=""

# ── 1. Root LICENSE (บังคับต้องมี) ──────────────────────────
if [ ! -f "LICENSE" ]; then
  label="license-violation"
  violations="${violations}\n- ❌ Root \`LICENSE\` file is missing"
  echo "❌ Root LICENSE   : MISSING"
elif [ ! -s "LICENSE" ]; then
  label="license-violation"
  violations="${violations}\n- ❌ Root \`LICENSE\` file is empty"
  echo "❌ Root LICENSE   : EMPTY"
else
  echo "✅ Root LICENSE   : OK"
fi

# ── 2. frontend/LICENSE (ห้ามมี) ─────────────────────────────
if [ -f "frontend/LICENSE" ]; then
  label="license-violation"
  violations="${violations}\n- ❌ \`frontend/LICENSE\` must not exist"
  echo "❌ frontend/LICENSE : FORBIDDEN"
else
  echo "✅ frontend/LICENSE : OK (not present)"
fi

# ── 3. src/LICENSE (ห้ามมี) ──────────────────────────────────
if [ -f "src/LICENSE" ]; then
  label="license-violation"
  violations="${violations}\n- ❌ \`src/LICENSE\` must not exist"
  echo "❌ src/LICENSE    : FORBIDDEN"
else
  echo "✅ src/LICENSE    : OK (not present)"
fi

# ── 4. docs/license/LICENSE (optional) ───────────────────────
docs_status="not present (optional)"
if [ -f "docs/license/LICENSE" ]; then
  docs_status="present ✅"
  echo "ℹ️  docs LICENSE  : PRESENT (optional)"
else
  echo "ℹ️  docs LICENSE  : NOT PRESENT (optional)"
fi

# ── 5. ตรวจ license type ─────────────────────────────────────
license_type="unknown"
if [ -f "LICENSE" ]; then
  if grep -qi "MIT License"          LICENSE; then license_type="MIT"
  elif grep -qi "Apache License"     LICENSE; then license_type="Apache-2.0"
  elif grep -qi "GNU GENERAL PUBLIC" LICENSE; then license_type="GPL"
  elif grep -qi "ISC License"        LICENSE; then license_type="ISC"
  elif grep -qi "BSD"                LICENSE; then license_type="BSD"
  fi
  echo "ℹ️  License type  : $license_type"
fi

# ── 6. ตรวจ package.json license field ───────────────────────
pkg_license_status="N/A"
if [ -f "package.json" ]; then
  pkg_license=$(node -e \
    "const p=require('./package.json');console.log(p.license||'')" \
    2>/dev/null || true)
  if [ -z "$pkg_license" ]; then
    warnings="${warnings}\n- ⚠️ \`package.json\` missing \`license\` field"
    pkg_license_status="missing ⚠️"
    echo "⚠️  package.json  : license field MISSING"
  else
    pkg_license_status="${pkg_license} ✅"
    echo "✅ package.json  : license = $pkg_license"
  fi
fi

echo "────────────────────────────────────────"

# ── Export GITHUB_OUTPUT ──────────────────────────────────────
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "label=${label}"                    >> "$GITHUB_OUTPUT"
  echo "violations=${violations}"          >> "$GITHUB_OUTPUT"
  echo "warnings=${warnings}"              >> "$GITHUB_OUTPUT"
  echo "docs_status=${docs_status}"        >> "$GITHUB_OUTPUT"
  echo "license_type=${license_type}"      >> "$GITHUB_OUTPUT"
  echo "pkg_license=${pkg_license_status}" >> "$GITHUB_OUTPUT"
fi

# ── สรุปผล ───────────────────────────────────────────────────
echo ""
if [ "$label" = "license-violation" ]; then
  echo "💥 Result: LICENSE VIOLATION"
  echo -e "Violations:${violations}"
  exit 1
else
  echo "🎉 Result: LICENSE COMPLIANT"
  [ -n "$warnings" ] && echo -e "Warnings:${warnings}"
  exit 0
fi
EOF

echo "✅ Created: .github/scripts/compliance/check-license.sh"

# ════════════════════════════════════════════════════════════════
# 4. check-security.sh
# ════════════════════════════════════════════════════════════════
cat > .github/scripts/compliance/check-security.sh << 'EOF'
#!/usr/bin/env bash
# .github/scripts/compliance/check-security.sh
# Usage: bash check-security.sh [npm|pip|secrets]
set -euo pipefail

MODE="${1:-npm}"

case "$MODE" in

  npm)
    echo "📦 Running npm audit..."
    npm install --ignore-scripts --silent 2>/dev/null || true
    AUDIT=$(npm audit --json 2>/dev/null || echo '{}')

    parse() {
      node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(j.metadata?.vulnerabilities?.${1}??0)}catch{console.log(0)}})"
    }

    CRITICAL=$(echo "$AUDIT" | parse critical 2>/dev/null || echo "0")
    HIGH=$(echo "$AUDIT"     | parse high     2>/dev/null || echo "0")
    MODERATE=$(echo "$AUDIT" | parse moderate 2>/dev/null || echo "0")
    LOW=$(echo "$AUDIT"      | parse low      2>/dev/null || echo "0")

    echo "   Critical : $CRITICAL | High : $HIGH | Moderate : $MODERATE | Low : $LOW"

    if [ -n "${GITHUB_OUTPUT:-}" ]; then
      echo "critical=${CRITICAL}" >> "$GITHUB_OUTPUT"
      echo "high=${HIGH}"         >> "$GITHUB_OUTPUT"
      echo "moderate=${MODERATE}" >> "$GITHUB_OUTPUT"
      echo "low=${LOW}"           >> "$GITHUB_OUTPUT"
    fi
    ;;

  pip)
    echo "🐍 Running pip audit..."
    pip install pip-audit --quiet 2>/dev/null
    RESULT=$(pip-audit --format=json 2>/dev/null || echo '{"vulnerabilities":[]}')
    COUNT=$(echo "$RESULT" | python3 -c \
      "import sys,json;d=json.load(sys.stdin);print(len(d.get('vulnerabilities',[])))" \
      2>/dev/null || echo "0")
    echo "   Vulnerabilities : $COUNT"
    [ -n "${GITHUB_OUTPUT:-}" ] && echo "vuln_count=${COUNT}" >> "$GITHUB_OUTPUT"
    ;;

  secrets)
    echo "🔑 Scanning for hardcoded secrets..."
    FOUND=0
    DETAILS=""

    scan() {
      local name="$1" pattern="$2"
      local match
      match=$(grep -rE "$pattern" \
        --include="*.js" --include="*.ts" --include="*.py" \
        --include="*.env" --include="*.json" --include="*.yml" \
        --include="*.yaml" --include="*.sh" \
        --exclude-dir=node_modules --exclude-dir=.git \
        --exclude-dir=dist --exclude-dir=build \
        -l 2>/dev/null || true)

      if [ -n "$match" ]; then
        FOUND=1
        FILES=$(echo "$match" | tr '\n' ',' | sed 's/,$//')
        DETAILS="${DETAILS}\n- **${name}**: \`${FILES}\`"
        echo "   ❌ $name → $FILES"
      else
        echo "   ✅ Clean: $name"
      fi
    }

    scan "AWS Access Key"      "AKIA[0-9A-Z]{16}"
    scan "GitHub Token"        "ghp_[a-zA-Z0-9]{36}"
    scan "Private Key"         "-----BEGIN (RSA|EC|DSA) PRIVATE KEY-----"
    scan "Hardcoded password"  "password\s*=\s*['\"][^'\"]{8,}"
    scan "Hardcoded secret"    "secret\s*=\s*['\"][^'\"]{8,}"
    scan "Slack Token"         "xox[baprs]-[0-9A-Za-z]{10,}"
    scan "Stripe Key"          "sk_live_[0-9a-zA-Z]{24,}"

    if [ -n "${GITHUB_OUTPUT:-}" ]; then
      echo "found=${FOUND}"     >> "$GITHUB_OUTPUT"
      echo "details=${DETAILS}" >> "$GITHUB_OUTPUT"
    fi
    ;;

  *)
    echo "❌ Unknown mode: $MODE  (use: npm | pip | secrets)"
    exit 1
    ;;
esac

echo "✅ Done: $MODE check completed"
EOF

echo "✅ Created: .github/scripts/compliance/check-security.sh"

# ════════════════════════════════════════════════════════════════
# 5. post-comment.js
# ════════════════════════════════════════════════════════════════
cat > .github/scripts/compliance/post-comment.js << 'EOF'
// .github/scripts/compliance/post-comment.js
// Post หรือ Update compliance comment ใน PR (ไม่ซ้ำ)
const https = require("https");

const {
  GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER,
  REPORT_TYPE    = "license",
  LABEL          = "license-compliant",
  // License
  VIOLATIONS     = "", WARNINGS    = "",
  DOCS_STATUS    = "N/A", LICENSE_TYPE = "unknown", PKG_LICENSE = "N/A",
  // Security
  NPM_CRITICAL   = "N/A", NPM_HIGH  = "N/A",
  NPM_MODERATE   = "N/A", NPM_LOW   = "N/A",
  PIP_VULNS      = "N/A",
  SECRET_FOUND   = "0",   SECRET_DETAILS = "",
} = process.env;

if (!GITHUB_TOKEN || !GITHUB_REPOSITORY || !PR_NUMBER) {
  console.error("❌ Missing: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER");
  process.exit(1);
}

const [owner, repo] = GITHUB_REPOSITORY.split("/");
const issueNumber   = parseInt(PR_NUMBER, 10);
const isOk          = LABEL.includes("compliant");
const icon          = isOk ? "✅" : "❌";
const marker        = `<!-- ${REPORT_TYPE}-compliance-report -->`;
const timestamp     = new Date().toUTCString();

function buildLicenseBody() {
  const vBlock = VIOLATIONS.trim()
    ? `\n### ❌ Violations\n${VIOLATIONS.replace(/\\n/g, "\n")}\n` : "";
  const wBlock = WARNINGS.trim()
    ? `\n### ⚠️ Warnings\n${WARNINGS.replace(/\\n/g, "\n")}\n` : "";

  return `${marker}
## 📋 License Compliance Report

| Item | Status |
|------|--------|
| Root \`LICENSE\` | ${isOk ? "✅ present" : "❌ missing or empty"} |
| \`docs/license/LICENSE\` | ${DOCS_STATUS} |
| License Type | \`${LICENSE_TYPE}\` |
| \`package.json\` license field | ${PKG_LICENSE} |
${vBlock}${wBlock}
**Overall Status: ${icon} \`${LABEL}\`**

> _Updated: ${timestamp}_
`;
}

function buildSecurityBody() {
  const secretStatus = SECRET_FOUND === "1"
    ? "❌ Suspicious patterns found" : "✅ None detected";
  const secretBlock = SECRET_DETAILS.trim()
    ? `\n${SECRET_DETAILS.replace(/\\n/g, "\n")}\n` : "";
  const npmSection = NPM_CRITICAL === "N/A"
    ? "_No Node.js project detected_"
    : `| Severity | Count |\n|----------|-------|\n| 🔴 Critical | ${NPM_CRITICAL} |\n| 🟠 High | ${NPM_HIGH} |\n| 🟡 Moderate | ${NPM_MODERATE} |\n| 🔵 Low | ${NPM_LOW} |`;

  return `${marker}
## 🔒 Security Compliance Report

### npm Vulnerabilities
${npmSection}

### Python Vulnerabilities (pip-audit)
${PIP_VULNS === "N/A" ? "_No Python project detected_" : `${PIP_VULNS} vulnerabilities found`}

### Secret Scan
| Result |
|--------|
| ${secretStatus} |
${secretBlock}
**Overall Status: ${icon} \`${LABEL}\`**

> _Updated: ${timestamp}_
`;
}

const commentBody = REPORT_TYPE === "security"
  ? buildSecurityBody() : buildLicenseBody();

function githubRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: "api.github.com", path, method,
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "compliance-bot",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(payload ? {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        } : {}),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  console.log(`📝 [${REPORT_TYPE}] Posting to PR #${issueNumber}...`);

  const listRes = await githubRequest(
    "GET", `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`
  );
  if (listRes.status !== 200) { console.error("❌ List failed:", listRes.body); process.exit(1); }

  const existing = listRes.body.find(
    (c) => typeof c.body === "string" && c.body.includes(marker)
  );

  const result = existing
    ? await githubRequest("PATCH", `/repos/${owner}/${repo}/issues/comments/${existing.id}`, { body: commentBody })
    : await githubRequest("POST",  `/repos/${owner}/${repo}/issues/${issueNumber}/comments`, { body: commentBody });

  if (result.status === 200 || result.status === 201) {
    console.log(`✅ Comment ${existing ? "updated" : "created"}: ${result.body.html_url}`);
  } else {
    console.error("❌ Failed:", result.body);
    process.exit(1);
  }
}

main().catch((err) => { console.error("❌ Error:", err); process.exit(1); });
EOF

echo "✅ Created: .github/scripts/compliance/post-comment.js"

# ════════════════════════════════════════════════════════════════
# ให้สิทธิ์ shell scripts
# ════════════════════════════════════════════════════════════════
chmod +x .github/scripts/compliance/check-license.sh
chmod +x .github/scripts/compliance/check-security.sh

echo ""
echo "═══════════════════════════════════════"
echo "✅ All compliance files created!"
echo ""
echo "📁 Structure:"
echo "   .github/"
echo "   ├── workflows/"
echo "   │   ├── compliance-license.yml"
echo "   │   └── compliance-security.yml"
echo "   └── scripts/"
echo "       └── compliance/"
echo "           ├── check-license.sh"
echo "           ├── check-security.sh"
echo "           └── post-comment.js"
echo ""
echo "📌 Next steps:"
echo "   git update-index --chmod=+x .github/scripts/compliance/check-license.sh"
echo "   git update-index --chmod=+x .github/scripts/compliance/check-security.sh"
echo "   git add .github/"
echo "   git commit -m 'chore: add compliance workflows and scripts'"
echo "   git push"
echo "═══════════════════════════════════════"
