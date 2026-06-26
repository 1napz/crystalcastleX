# Auto Rollback Workflow

## Overview

The **Auto Rollback** workflow is a GitHub Actions automation that automatically reverts the last commit on the `main` branch when the **Lint Check** workflow fails. This helps maintain code quality by preventing non-compliant code from being merged.

## Workflow File Location

- **Path:** `.github/workflows/auto-rollback.yml`
- **Trigger:** Automatic (when "Lint Check" workflow completes)

## When to Use This Workflow

### ✅ Use This Workflow When:

1. **Lint Check Failures** - The workflow triggers automatically when the "Lint Check" workflow fails
2. **Preventing Bad Code** - You want to automatically prevent code that doesn't pass linting standards from staying on the main branch
3. **Continuous Quality Gates** - Your team uses linting as a mandatory quality gate for merges
4. **Automated Rollback Needs** - You prefer automatic remediation over manual intervention for lint failures

### ⚠️ Important Considerations:

- **Automatic Behavior:** This workflow acts without human approval, so ensure your linting rules are strict and well-tested
- **Lint Check Dependency:** Only triggers when the "Lint Check" workflow completes with a **failure** status
- **Branch Creation:** Creates a new rollback branch (e.g., `auto-rollback-1234567890`) with the reverted commit
- **Manual Review Required:** After rollback, the reverted code should be reviewed to understand why it failed linting

## How It Works

### Trigger
```yaml
on:
  workflow_run:
    workflows: ["Lint Check"]
    types:
      - completed
```

The workflow listens for completion of the "Lint Check" workflow.

### Execution Flow

1. **Checkout Main Branch**
   - Checks out the `main` branch to ensure we're working with the latest code

2. **Get Last Commit**
   - Captures the SHA of the last commit for reference

3. **Create Rollback Branch**
   - Creates a new branch named `auto-rollback-{run_id}` to isolate the rollback operation
   - Example: `auto-rollback-1234567890`

4. **Revert Last Commit**
   - Uses `git revert` to create a new commit that undoes the changes from the last commit
   - The `--no-edit` flag commits without prompting for a message

5. **Push Rollback Branch**
   - Pushes the new rollback branch to the remote repository
   - Uses GitHub Actions service account credentials

### Conditional Execution

```yaml
if: ${{ github.event.workflow_run.conclusion == 'failure' }}
```

The rollback only executes when the "Lint Check" workflow **fails**.

## What Gets Reverted

- **The last commit** on the main branch at the time the Lint Check failed
- The revert is committed as a **new commit** (not a hard reset)
- This maintains full git history for audit trails

## After the Workflow Executes

### Expected Outcome

1. A new branch `auto-rollback-{run_id}` is created and pushed
2. The main branch **remains unchanged** (the revert is on the new branch)
3. A review/merge of the rollback branch will undo the failing commit on main

### Next Steps

1. **Review the Rollback** - Check why the Lint Check failed
2. **Merge the Rollback** - If the automatic revert is acceptable, merge the rollback branch to main
3. **Fix the Code** - Address the linting issues and create a new PR with corrections
4. **Re-submit** - Push the corrected code back to main

## Configuration & Customization

### Current Configuration

```yaml
Trigger: Lint Check workflow completion
Action: Auto-rollback on failure
Target Branch: main
Service Account: github-actions (default)
```

### Potential Customizations

If you need to modify this workflow:

| Aspect | Current | Possible Changes |
|--------|---------|------------------|
| **Trigger Workflow** | "Lint Check" | Change to different workflow name |
| **Trigger Condition** | Failure only | Could add success/skipped conditions |
| **Target Branch** | main | Could target develop or other branches |
| **Revert Strategy** | git revert | Could use hard reset instead |
| **Auto-merge** | Manual merge required | Could add auto-merge logic |

## Limitations & Caveats

⚠️ **Important Notes:**

1. **No Automatic Merge** - The rollback branch is created but must be manually merged
2. **Single Commit** - Only reverts the most recent commit; doesn't handle multiple failures
3. **Lint Check Required** - This workflow depends on the "Lint Check" workflow existing and completing
4. **Force Push Risk** - If concurrent commits happen, ensure proper branch protections
5. **Notification** - No built-in notifications; consider adding Slack/email alerts

## Troubleshooting

### Workflow Doesn't Trigger

**Problem:** Auto Rollback never runs even when Lint Check fails

**Solutions:**
- Verify "Lint Check" workflow exists and completes
- Check workflow_run trigger is properly configured
- Ensure the workflow has appropriate permissions (see repository settings)
- Check GitHub Actions logs for errors

### Rollback Branch Not Created

**Problem:** Workflow runs but no branch appears

**Solutions:**
- Verify git configuration has correct user.name and user.email
- Check that github-actions bot has write permissions
- Review workflow logs for git errors
- Ensure main branch is not protected against automated pushes

### Multiple Rollbacks Occur

**Problem:** Workflow creates multiple rollback branches unexpectedly

**Solutions:**
- Check if Lint Check is being triggered multiple times
- Verify workflow_run is not duplicated in triggers
- Monitor for concurrent workflow runs

## Related Workflows

- **Lint Check** - The upstream workflow that triggers this one
- **CI/CD Pipeline** - Other automated checks that may interact with this workflow
- **Deploy Workflows** - May need coordination to avoid deploying reverted code

## Best Practices

1. ✅ **Monitor Rollbacks** - Track how often this workflow executes; high frequency indicates linting rule issues
2. ✅ **Review Lint Rules** - Ensure linting standards are clear and documented
3. ✅ **Team Communication** - Notify team when rollbacks occur
4. ✅ **Branch Cleanup** - Periodically clean up old rollback branches
5. ✅ **Audit Trail** - Maintain git history; use revert instead of reset

## Questions & Support

For issues or questions about this workflow:

1. Check the GitHub Actions logs at: `Actions` → `Auto Rollback on CI Failure`
2. Review the related Lint Check workflow logs
3. Consult the repository's CONTRIBUTING.md guidelines
4. Contact the DevOps/Infra team

---

**Last Updated:** 2026-06-02  
**Workflow Version:** 1.0  
**Status:** Active
