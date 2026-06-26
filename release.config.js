สำหรับ CrystalCastle ที่มี

Next.js / Node.js

GitHub Actions

Vercel

CHANGELOG.md

README.md

GitHub Releases


ผมแนะนำ release.config.js แบบ Production ดังนี้

module.exports = {
branches: [
"main",
{
name: "develop",
prerelease: "beta"
}
],

tagFormat: "v${version}",

plugins: [
[
"@semantic-release/commit-analyzer",
{
preset: "conventionalcommits",
releaseRules: [
{ type: "feat", release: "minor" },
{ type: "fix", release: "patch" },
{ type: "perf", release: "patch" },
{ type: "refactor", release: "patch" },
{ type: "docs", release: false },
{ type: "style", release: false },
{ type: "test", release: false },
{ type: "chore", release: false },

      { breaking: true, release: "major" }
    ]
  }
],

[
  "@semantic-release/release-notes-generator",
  {
    preset: "conventionalcommits"
  }
],

[
  "@semantic-release/changelog",
  {
    changelogFile: "CHANGELOG.md"
  }
],

[
  "@semantic-release/npm",
  {
    npmPublish: false
  }
],

[
  "@semantic-release/git",
  {
    assets: [
      "package.json",
      "package-lock.json",
      "pnpm-lock.yaml",
      "CHANGELOG.md",
      "README.md"
    ],
    message:
      "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
  }
],

[
  "@semantic-release/github",
  {
    successComment: true,
    failComment: true,
    releasedLabels: ["released"]
  }
]

]
};
---

Required Packages

ติดตั้ง

pnpm add -D \
semantic-release \
@semantic-release/changelog \
@semantic-release/commit-analyzer \
@semantic-release/release-notes-generator \
@semantic-release/git \
@semantic-release/github \
@semantic-release/npm


---

package.json

เพิ่ม script

{
"scripts": {
"release": "semantic-release",
"release:dry": "semantic-release --dry-run"
}
}
---

Commit Convention

Semantic Release จะอ่าน commit แบบนี้

feat: add AI storyboard engine
feat(video): add batch rendering
fix(api): resolve OpenAI timeout
perf(cache): optimize image generation
refactor(workflow): simplify CI pipeline

Version จะเปลี่ยนเป็น

feat  → 1.2.0 → 1.3.0
fix   → 1.2.0 → 1.2.1
perf  → 1.2.0 → 1.2.1
BREAKING CHANGE → 2.0.0


---

Auto Sync README Version

เพิ่ม workflow step ก่อน release

- name: Update README Version
  run: |
    VERSION=$(node -p "require('./package.json').version")

    sed -i "s/version-[0-9]\+\.[0-9]\+\.[0-9]\+/version-$VERSION/g" README.md

แล้ว semantic-release จะ commit README กลับให้อัตโนมัติ


---

ตัวอย่างผลลัพธ์

เมื่อ merge

feat(ai): add storyboard generator
fix(render): fix ffmpeg pipeline
docs(readme): update examples

Semantic Release จะสร้าง

v1.8.0
↓
v1.9.0

พร้อม

CHANGELOG.md
GitHub Release
Git Tag
package.json
README.md

อัปเดตทั้งหมดในรอบเดียว

สำหรับ repository CrystalCastle ผมแนะนำเพิ่มไฟล์ .releaserc.json หรือ release.config.js คู่กับ .github/workflows/release.yml เพื่อให้หลัง merge เข้า main แล้ว Release → Changelog → GitHub Release → Deploy Vercel ทำงานต่อเนื่องแบบอัตโนมัติทั้งหมด.
