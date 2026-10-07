# AI Review Policy

## Purpose
Define how AI assists pull request reviews.

## AI Responsibilities
- summarize PRs
- detect risky changes
- identify missing tests
- detect security-sensitive modifications

## Human Responsibilities
- final approval
- architecture decisions
- production deployment approval

## Review Categories

### Low Risk
- docs
- comments
- formatting

### Medium Risk
- UI logic
- workflow changes

### High Risk
- authentication
- permissions
- secrets
- deployment pipelines