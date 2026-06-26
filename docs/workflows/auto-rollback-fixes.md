# Auto Rollback Workflow - Improvements & Fix Guide

## 🔴 Issues in Current Workflow

The current `auto-rollback.yml` has several critical issues that prevent it from functioning correctly:

### Issue #1: Missing Permissions
**Problem:** The workflow cannot push to the repository.
```yaml
# ❌ WRONG - No permissions specified
jobs:
  rollback:
    runs-on: ubuntu-latest
```

**Fix:** Add explicit write permissions:
```yaml
# ✅ CORRECT
jobs:
  rollback:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
```

---

### Issue #2: No Error Handling for Revert Conflicts
**Problem:** If the commit cannot be reverted (due to conflicts), the workflow fails silently without notification.

**Fix:** Add dry-run check before attempting revert:
```yaml
- name: Check if commit can be reverted
  id: check_revert
  continue-on-error: true
  run: |
    git revert HEAD --no-edit --dry-run

- name: Create rollback branch
  if: steps.check_revert.outcome == 'success'
  run: |
    git checkout -b auto-rollback-${{ github.run_id }}-${{ github.run_number }}
    git revert HEAD --no-edit
```

---

### Issue #3: Insufficient Git Configuration
**Problem:** Git config is set inside a step instead of before checkout, causing potential issues.

**Fix:** Configure git immediately after checkout:
```yaml
- name: Checkout main
  uses: actions/checkout@v4
  with:
    ref: main
    fetch-depth: 0  # Fetch full history

- name: Configure Git
  run: |
    git config user.name "github-actions"
    git config user.email "actions@github.com"
```

---

### Issue #4: No Pull Request Creation
**Problem:** The rollback branch is pushed but never merged. No PR is created for team review.

**Fix:** Create a PR automatically:
```yaml
- name: Create Pull Request for Rollback
  if: steps.check_revert.outcome == 'success'
  uses: actions/github-script@v7
  with:
    script: |
      const { data: pr } = await github.rest.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: `🔄 Auto-Rollback: Revert commit ${{ steps.last_commit.outputs.sha }}`,
        body: `## Auto Rollback Triggered by Lint Failure
        
Reverted Commit: ${{ steps.last_commit.outputs.sha }}

Please review and merge to apply rollback.`,
        head: `auto-rollback-${{ github.run_id }}-${{ github.run_number }}`,
        base: 'main'
      });
```

---

### Issue #5: No Notification on Failure
**Problem:** If revert fails, nobody knows. The workflow just ends.

**Fix:** Add notification step:
```yaml
- name: Handle revert conflict
  if: steps.check_revert.outcome == 'failure'
  uses: actions/github-script@v7
  with:
    script: |
      console.log('⚠️ Revert failed - conflicts detected');
      // Could add Slack/email notification here
```

---

### Issue #6: Branch Naming Collision Risk
**Problem:** Branch name `auto-rollback-${{ github.run_id }}` could conflict with concurrent runs.

**Fix:** Use unique identifiers:
```yaml
# ❌ RISKY
git checkout -b auto-rollback-${{ github.run_id }}

# ✅ SAFE
git checkout -b auto-rollback-${{ github.run_id }}-${{ github.run_number }}
```

---

## ✅ Recommended Fixed Workflow

Here's the complete improved workflow:

```yaml
name: Auto Rollback on CI Failure

on:
  workflow_run:
    workflows: ["Lint Check"]
    types:
      - completed

jobs:
  rollback:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout main
        uses: actions/checkout@v4
        with:
          ref: main
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"

      - name: Get last commit info
        id: last_commit
        run: |
          COMMIT_SHA=$(git log -1 --pretty=format:"%H")
          COMMIT_MSG=$(git log -1 --pretty=format:"%B")
          COMMIT_AUTHOR=$(git log -1 --pretty=format:"%an")
          
          echo "sha=$COMMIT_SHA" >> $GITHUB_OUTPUT
          echo "message=$COMMIT_MSG" >> $GITHUB_OUTPUT
          echo "author=$COMMIT_AUTHOR" >> $GITHUB_OUTPUT
          echo "Last commit: $COMMIT_SHA by $COMMIT_AUTHOR"

      - name: Check if commit can be reverted
        id: check_revert
        continue-on-error: true
        run: |
          echo "Testing if commit can be reverted..."
          git revert HEAD --no-edit --dry-run
          echo "✅ Revert test passed"

      - name: Create rollback branch
        if: steps.check_revert.outcome == 'success'
        run: |
          BRANCH_NAME="auto-rollback-${{ github.run_id }}-${{ github.run_number }}"
          echo "Creating branch: $BRANCH_NAME"
          
          git checkout -b $BRANCH_NAME
          git revert HEAD --no-edit
          git push origin $BRANCH_NAME
          
          echo "rollback_branch=$BRANCH_NAME" >> $GITHUB_ENV

      - name: Create Pull Request for Rollback
        if: steps.check_revert.outcome == 'success'
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const { data: pr } = await github.rest.pulls.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🔄 Auto-Rollback: Revert failed lint check`,
              body: `## 🔄 Automatic Rollback - Lint Check Failed

### ⚠️ Why This PR?
The **Lint Check** workflow failed, triggering an automatic rollback.

### 📌 Reverted Commit
- **SHA:** \`${{ steps.last_commit.outputs.sha }}\`
- **Author:** @${{ steps.last_commit.outputs.author }}
- **Message:** 
  \`\`\`
  ${{ steps.last_commit.outputs.message }}
  \`\`\`

### ✅ What To Do
1. **Review** - Check why the linting failed
2. **Merge** - Click "Merge" if the rollback is acceptable
3. **Fix** - Address the linting issues and create a new PR

### 🔗 Links
- [Failed Workflow Run](https://github.com/${{ github.repository }}/actions/runs/${{ github.event.workflow_run.id }})
- [Original Commit](https://github.com/${{ github.repository }}/commit/${{ steps.last_commit.outputs.sha }})

---
*Generated by Auto Rollback workflow*
              `,
              head: '${{ env.rollback_branch }}',
              base: 'main',
              labels: ['🔄 auto-rollback', 'needs-review']
            });
            
            console.log('✅ Rollback PR created:', pr.html_url);

      - name: Notify team - Revert conflict
        if: steps.check_revert.outcome == 'failure'
        uses: actions/github-script@v7
        with:
          script: |
            const failureMessage = `
## ⚠️ Auto-Rollback Failed - Manual Intervention Required

### Problem
The commit **cannot be automatically reverted** due to conflicts.

### Commit Details
- **SHA:** \`${{ steps.last_commit.outputs.sha }}\`
- **Author:** @${{ steps.last_commit.outputs.author }}

### Action Required
1. **Review** the failing Lint Check workflow
2. **Manually revert** the commit if needed
3. **Fix** the linting issues

### Workflow Run
[View Failed Run](https://github.com/${{ github.repository }}/actions/runs/${{ github.event.workflow_run.id }})
            `;
            
            console.log('⚠️ Revert failed with conflicts');
            
            // Optional: Create an issue for manual intervention
            const { data: issue } = await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🚨 Manual Rollback Needed - Lint Check Failed`,
              body: failureMessage,
              labels: ['🚨 critical', '🔄 rollback', 'manual-intervention']
            });
            
            console.log('Created issue for manual intervention:', issue.html_url);
```

---

## 🚀 Deployment Instructions

### Step 1: Update the Workflow
Replace `.github/workflows/auto-rollback.yml` with the fixed version above.

### Step 2: Verify Permissions
- Go to **Settings** → **Actions** → **General**
- Ensure **Workflow permissions** is set to **Read and write permissions**

### Step 3: Test the Workflow
1. Make a commit that fails linting
2. Push to a branch
3. Watch for the automatic rollback PR

### Step 4: Monitor
- Check **Actions** tab for workflow runs
- Review automatically created rollback PRs
- Monitor for conflict notifications

---

## 📊 Workflow Comparison

| Feature | Original | Fixed |
|---------|----------|-------|
| **Permissions** | ❌ Missing | ✅ Added |
| **Error Handling** | ❌ None | ✅ Dry-run check |
| **Git Config** | ⚠️ Late | ✅ Immediate |
| **Pull Request** | ❌ Manual | ✅ Auto-created |
| **Conflict Detection** | ❌ Silent fail | ✅ Notifications |
| **Branch Safety** | ⚠️ Basic | ✅ Unique names |
| **Team Notification** | ❌ None | ✅ PR + Issue |
| **Logging** | ⚠️ Minimal | ✅ Detailed |

---

## 🔧 Configuration Options

### Add Slack Notifications
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "🔄 Automatic rollback executed",
        "blocks": [...]
      }
```

### Add Auto-Merge Option
```yaml
- name: Auto-merge Rollback PR
  if: steps.check_revert.outcome == 'success'
  run: |
    gh pr merge ${{ env.rollback_branch }} --squash --auto
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Exclude Specific Branches
```yaml
on:
  workflow_run:
    workflows: ["Lint Check"]
    types: [completed]
    branches-ignore:
      - develop
      - staging
```

---

## ⚠️ Important Notes

1. **Always review rollback PRs** - Don't auto-merge without human approval
2. **Fix underlying issues** - Rollback is a safety measure, not a permanent solution
3. **Monitor frequency** - High rollback frequency indicates linting rule issues
4. **Communicate with team** - Ensure everyone knows about auto-rollback behavior

---

## Troubleshooting

### Workflow Doesn't Trigger
- Verify "Lint Check" workflow exists and completes
- Check workflow_run trigger syntax
- Ensure permissions are set correctly

### Revert Fails with Conflicts
- This is expected behavior - workflow will create an issue
- Manually inspect and revert if needed
- Consider simplifying recent commits

### PR Not Created
- Check GitHub Actions logs
- Verify `pull-requests: write` permission
- Ensure `GITHUB_TOKEN` is available

---

**Last Updated:** 2026-06-02  
**Status:** Ready for Implementation
