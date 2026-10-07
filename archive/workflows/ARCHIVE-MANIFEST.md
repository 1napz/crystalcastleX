# Archive Manifest — top-level `workflows/`

This directory holds the former top-level `workflows/` tree, archived because
GitHub Actions executes a workflow **only** at `.github/workflows/`. Nothing
here runs; it is kept for reference and was migrated without data loss.

- Source: `workflows/`
- Destination: `archive/workflows/`
- Files moved: **38**
- Renamed (name exceeded 255-byte NAME_MAX): **2**
- Parent commit: `0f1c248abf228c3f947d4bc832af88fd7c345d2c`

## Restore

```bash
git mv archive/workflows workflows
```

## Files

| Original path | New path | Blob SHA | Notes |
|---|---|---|---|
| `workflows/CI.yml` | `archive/workflows/CI.yml` | `9a359c338551` |  |
| `workflows/Deploy-Github-Page.yml` | `archive/workflows/Deploy-Github-Page.yml` | `547a3086b3be` |  |
| `workflows/Docs300.yml` | `archive/workflows/Docs300.yml` | `28b4b8a58ae8` |  |
| `workflows/FileNamingRules.yml` | `archive/workflows/FileNamingRules.yml` | `88844a3e5e6c` |  |
| `workflows/GovernanceFlow.md` | `archive/workflows/GovernanceFlow.md` | `59e706c085a5` |  |
| `workflows/LineUILog.yml` | `archive/workflows/LineUILog.yml` | `29c3166679c8` |  |
| `workflows/More-Language.YAML` | `archive/workflows/More-Language.YAML` | `cc9851e5cf89` |  |
| `workflows/PIPELINE.yaml` | `archive/workflows/PIPELINE.yaml` | `a88f3d01051f` |  |
| `workflows/ReviewerChecklist.md` | `archive/workflows/ReviewerChecklist.md` | `ca3a64e52d3d` |  |
| `workflows/Snapshot-Processor.YAML` | `archive/workflows/Snapshot-Processor.YAML` | `4aba6acb5786` |  |
| `workflows/Sync-Vercel.yml` | `archive/workflows/Sync-Vercel.yml` | `02c5e7b6c799` |  |
| `workflows/Template_TestCase.yml` | `archive/workflows/Template_TestCase.yml` | `f1cc30f6598b` |  |
| `workflows/ai-video.yml` | `archive/workflows/ai-video.yml` | `5e83a709d3ba` |  |
| `workflows/auto-label.yml` | `archive/workflows/auto-label.yml` | `397ff2aa8344` |  |
| `workflows/backup-db.yml` | `archive/workflows/backup-db.yml` | `5c387dee80d7` |  |
| `workflows/chat-merge-request.yaml` | `archive/workflows/chat-merge-request.yaml` | `df5d859d1280` |  |
| `workflows/cleanup.yml` | `archive/workflows/cleanup.yml` | `9f375f9a55d0` |  |
| `workflows/compare-release.yml` | `archive/workflows/compare-release.yml` | `1bd47fbfdd7a` |  |
| `workflows/compliance.yml` | `archive/workflows/compliance.yml` | `3804d8f8feb8` |  |
| `workflows/dependabot-auto-merge.yml
name: Auto-merge Dependabot PRs

on:
  pull_request:
    types: [labeled]

jobs:
  auto-merge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    
    steps:
      - name: Enable auto-merge
        run: gh pr merge --auto --merge "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}` | `archive/workflows/dependabot-auto-merge.yml-bcc62ad3.yml` | `739dc1183c16` | renamed |
| `workflows/deploy-githubpage.yaml` | `archive/workflows/deploy-githubpage.yaml` | `5136d9007757` |  |
| `workflows/force-squash-merge.yml` | `archive/workflows/force-squash-merge.yml` | `ec15228edc19` |  |
| `workflows/health-check.yml` | `archive/workflows/health-check.yml` | `70e6dccb320d` |  |
| `workflows/line-notify.yml` | `archive/workflows/line-notify.yml` | `9ef584fe104c` |  |
| `workflows/name: DeploDeploy
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'เลือก env'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]
      version:
        description: 'เวอร์ชันที่จะ deploy'
        required: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy ${{ inputs.version }} ไป ${{ inputs.environm` | `archive/workflows/name-deplodeploy-8eb14b32.yml` | `70f7780f2c13` | renamed |
| `workflows/pr-check.yml` | `archive/workflows/pr-check.yml` | `08759a8057ca` |  |
| `workflows/pr-labeler.yml` | `archive/workflows/pr-labeler.yml` | `c523adb27828` |  |
| `workflows/pr-testcase.yml` | `archive/workflows/pr-testcase.yml` | `a7c77fa63dd0` |  |
| `workflows/privacy-check.yml` | `archive/workflows/privacy-check.yml` | `af3c8c054e25` |  |
| `workflows/refreshpr.yml` | `archive/workflows/refreshpr.yml` | `7b0d152e16a1` |  |
| `workflows/release.yml` | `archive/workflows/release.yml` | `9df81981cd62` |  |
| `workflows/secret-scan.yml` | `archive/workflows/secret-scan.yml` | `7c4ab33dbf84` |  |
| `workflows/security-check.yml` | `archive/workflows/security-check.yml` | `2e95fe6a191d` |  |
| `workflows/security-headers.yml` | `archive/workflows/security-headers.yml` | `60bb4697496c` |  |
| `workflows/supabase-backup.yml` | `archive/workflows/supabase-backup.yml` | `09fb0cc68882` |  |
| `workflows/sync-ignore-file.yml` | `archive/workflows/sync-ignore-file.yml` | `f12a79379148` |  |
| `workflows/verify-repo.yml` | `archive/workflows/verify-repo.yml` | `acc7d01bdfe6` |  |
| `workflows/versions/pr-testcase.md` | `archive/workflows/versions/pr-testcase.md` | `be494d870a7e` |  |

## Renamed during archive

These paths had a filename longer than the filesystem's 255-byte limit — in
most cases an entire document pasted in as the name. Such a path can never be
checked out, so it existed only in git's index. The **content is preserved
byte-for-byte** (blob SHA unchanged); only the name was normalised.

- **412 bytes** — original name began `dependabot-auto-merge.yml`
  - now: `archive/workflows/dependabot-auto-merge.yml-bcc62ad3.yml`
  - blob: `739dc1183c16097ebdc1559b497e23ba28e30d29`
- **465 bytes** — original name began `name: DeploDeploy`
  - now: `archive/workflows/name-deplodeploy-8eb14b32.yml`
  - blob: `70f7780f2c13e234437ed9e011e85cb026156446`

## Collisions with the live CI directory

The archived tree duplicated these filenames that also exist under
`.github/workflows/`. Only the live copy ever executed:

- `workflows/CI.yml` &rarr; duplicated `.github/workflows/CI.yml`
- `workflows/Deploy-Github-Page.yml` &rarr; duplicated `.github/workflows/Deploy-Github-Page.yml`
- `workflows/Docs300.yml` &rarr; duplicated `.github/workflows/Docs300.yml`
- `workflows/FileNamingRules.yml` &rarr; duplicated `.github/workflows/FileNamingRules.yml`
- `workflows/GovernanceFlow.md` &rarr; duplicated `.github/workflows/GovernanceFlow.md`
- `workflows/LineUILog.yml` &rarr; duplicated `.github/workflows/LineUILog.yml`
- `workflows/More-Language.YAML` &rarr; duplicated `.github/workflows/More-Language.YAML`
- `workflows/PIPELINE.yaml` &rarr; duplicated `.github/workflows/PIPELINE.yaml`
- `workflows/ReviewerChecklist.md` &rarr; duplicated `.github/workflows/ReviewerChecklist.md`
- `workflows/Snapshot-Processor.YAML` &rarr; duplicated `.github/workflows/Snapshot-Processor.YAML`
- `workflows/Sync-Vercel.yml` &rarr; duplicated `.github/workflows/Sync-Vercel.yml`
- `workflows/Template_TestCase.yml` &rarr; duplicated `.github/workflows/Template_TestCase.yml`
- `workflows/ai-video.yml` &rarr; duplicated `.github/workflows/ai-video.yml`
- `workflows/auto-label.yml` &rarr; duplicated `.github/workflows/auto-label.yml`
- `workflows/backup-db.yml` &rarr; duplicated `.github/workflows/backup-db.yml`
- `workflows/chat-merge-request.yaml` &rarr; duplicated `.github/workflows/chat-merge-request.yaml`
- `workflows/cleanup.yml` &rarr; duplicated `.github/workflows/cleanup.yml`
- `workflows/compare-release.yml` &rarr; duplicated `.github/workflows/compare-release.yml`
- `workflows/compliance.yml` &rarr; duplicated `.github/workflows/compliance.yml`
- `workflows/deploy-githubpage.yaml` &rarr; duplicated `.github/workflows/deploy-githubpage.yaml`
- `workflows/force-squash-merge.yml` &rarr; duplicated `.github/workflows/force-squash-merge.yml`
- `workflows/health-check.yml` &rarr; duplicated `.github/workflows/health-check.yml`
- `workflows/line-notify.yml` &rarr; duplicated `.github/workflows/line-notify.yml`
- `workflows/pr-check.yml` &rarr; duplicated `.github/workflows/pr-check.yml`
- `workflows/pr-labeler.yml` &rarr; duplicated `.github/workflows/pr-labeler.yml`
- `workflows/pr-testcase.yml` &rarr; duplicated `.github/workflows/pr-testcase.yml`
- `workflows/privacy-check.yml` &rarr; duplicated `.github/workflows/privacy-check.yml`
- `workflows/refreshpr.yml` &rarr; duplicated `.github/workflows/refreshpr.yml`
- `workflows/release.yml` &rarr; duplicated `.github/workflows/release.yml`
- `workflows/secret-scan.yml` &rarr; duplicated `.github/workflows/secret-scan.yml`
- `workflows/security-check.yml` &rarr; duplicated `.github/workflows/security-check.yml`
- `workflows/security-headers.yml` &rarr; duplicated `.github/workflows/security-headers.yml`
- `workflows/supabase-backup.yml` &rarr; duplicated `.github/workflows/supabase-backup.yml`
- `workflows/sync-ignore-file.yml` &rarr; duplicated `.github/workflows/sync-ignore-file.yml`
- `workflows/verify-repo.yml` &rarr; duplicated `.github/workflows/verify-repo.yml`
- `workflows/versions/pr-testcase.md` &rarr; duplicated `.github/workflows/versions/pr-testcase.md`
