---
applyTo: ".github/workflows/**/*.yml"
---

# GitHub Actions Instructions

## Workflow Philosophy
- Keep workflows deterministic
- Prefer reusable workflows
- Avoid duplicated CI logic
- Minimize unnecessary workflow runs
- Optimize for reliability before complexity

## Naming Standards
- Use lowercase kebab-case filenames
- Add descriptive workflow names
- Add clear step names
- Keep job names short but meaningful

## Trigger Rules
- Avoid triggering on every branch unnecessarily
- Prefer path filters when possible
- Use workflow_dispatch for manual operations
- Prevent recursive workflow triggering

## Performance Rules
- Cache dependencies whenever possible
- Avoid reinstalling tools repeatedly
- Minimize checkout depth only when safe
- Prefer lightweight runners

## Failure Prevention
- Add timeout-minutes to jobs
- Add retry logic for unstable external services
- Validate required secrets before execution
- Fail early with clear messages

## Security
- Use least-privilege permissions
- Never expose secrets in logs
- Mask sensitive outputs
- Avoid running untrusted scripts directly

## Logging
- Print concise debug information
- Avoid noisy logs
- Group logs logically
- Add summary outputs when useful

## YAML Standards
- Keep YAML clean and modular
- Avoid deeply nested conditionals
- Reuse environment variables
- Prefer matrix strategies for repeated jobs

## Deployment Rules
- Use concurrency groups for deployments
- Prevent overlapping production deploys
- Separate preview and production deployments
- Add rollback support when possible

## AI Automation Rules
- Explain workflow purpose briefly
- Prefer maintainable CI/CD architecture
- Suggest reusable workflows before creating new ones
- Avoid creating duplicate pipelines

## Forbidden Patterns
- Do not duplicate checkout/setup steps unnecessarily
- Do not hardcode tokens
- Do not create workflows without clear purpose
- Do not trigger expensive workflows on documentation-only changes
- Do not use unstable third-party actions without pinning versions
