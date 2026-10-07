# AI Commit Policy

## Purpose
Define standards for AI-generated commit messages.

## Commit Format

<type>(<scope>): <summary>

Example:
feat(auth): add JWT refresh validation

## Allowed Types
- feat
- fix
- docs
- refactor
- perf
- test
- ci
- build
- security

## Rules
- Use imperative mood
- Keep summary under 72 chars
- Mention affected module
- Avoid vague wording

## Extended Context
AI may append:
- impact analysis
- risk notes
- testing notes

## Forbidden Patterns
- update stuff
- fix bug
- misc changes