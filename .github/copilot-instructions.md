# CrystalCastle Copilot Instructions

## Project Overview
CrystalCastle is an AI-powered content generation platform focused on:
- Product-to-video workflows
- Social commerce automation
- AI-generated marketing assets
- GitHub Actions based CI/CD
- Vercel deployment pipelines

## Development Principles
- Prefer clean, modular, production-ready code
- Keep files small and composable
- Avoid unnecessary dependencies
- Prefer TypeScript over JavaScript
- Use async/await instead of promise chains
- Always validate environment variables
- Never hardcode secrets or tokens

## Code Style
- Use Prettier formatting
- Use 2 spaces indentation
- Prefer descriptive variable names
- Avoid single-letter variables
- Write reusable utility functions
- Use named exports when possible

## GitHub Actions Standards
- Reuse workflows whenever possible
- Minimize duplicated YAML logic
- Add workflow names and step names clearly
- Cache dependencies when supported
- Use concurrency groups for deployments
- Prefer official GitHub Actions

## Security Rules
- Never expose API keys
- Never commit .env files
- Mask sensitive logs
- Use least-privilege permissions
- Validate external inputs before execution

## Documentation Rules
- Update README when architecture changes
- Generate changelog summaries for major updates
- Add comments only when logic is non-obvious
- Prefer self-documenting code

## AI Assistant Behavior
- Explain architectural decisions briefly
- Suggest performance improvements
- Suggest security improvements
- Prefer maintainable solutions over clever hacks
- When fixing bugs, explain root cause first

## Frontend Standards
- Use responsive layouts
- Prefer Tailwind utility classes
- Avoid inline styles unless necessary
- Keep UI visually minimal and modern

## Backend Standards
- Separate business logic from routes
- Validate request payloads
- Return typed responses
- Add structured error handling

## Output Preferences
- Show only changed code blocks unless full file requested
- Keep explanations concise
- Include terminal commands when useful
- Prefer copy-paste-ready solutions
