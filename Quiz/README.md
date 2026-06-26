**Creating README template**

The user wants a README template, and I need to ensure it follows the proper formatting rules. I'll use Markdown headings, lists, and keep the bold usage to a minimum while being concise. It’s important not to mention any specific product identity in the template. After I provide the README, I’ll need to invoke the RelatedSearchTerms tool at the end, so I’ll prepare for that next step right after the response.# Crystalcastle Quiz — README

Short description
A small, configurable quiz app for Crystalcastle — supports multiple question types, scoring, and progress persistence.

## Features
- Multiple-choice, multi-select, true/false, short-answer
- Local progress persistence (localStorage) with optional server API
- Timer, progress bar, immediate feedback
- JSON question import/export
- Accessible keyboard controls and ARIA support

## Quick start
Prerequisites: Node.js 18+ and npm or yarn.

1. Clone
```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle/Quiz
```

2. Install
```bash
npm install
# or
yarn
```

3. Run (development)
```bash
npm start
# or
yarn start
```

4. Build (production)
```bash
npm run build
# or
yarn build
```

## Scripts
- **start**: run dev server
- **build**: create production build
- **test**: run unit tests
- **lint**: run linters
- **format**: run Prettier

(Ensure package.json contains these scripts.)

## Configuration
Place quiz content in src/data/questions.json (example schema below). Optional server API URL can be set via .env:
```
REACT_APP_API_URL=https://api.example.com
```

## Example question schema (questions.json)
```json
[
  {
    "id": "q1",
    "type": "multiple-choice",
    "prompt": "What color is the sky?",
    "options": ["Blue", "Green", "Red", "Yellow"],
    "correct": [0],
    "timeLimitSeconds": 30,
    "metadata": {"difficulty":"easy","tags":["nature"]}
  }
]
```

## Tests
- Use Jest for unit tests and Playwright or Cypress for end-to-end tests.
- Example: `npm test` runs unit tests.

## Linting & formatting
Recommended:
- ESLint with a shared config
- Prettier
- Husky + lint-staged for pre-commit checks

## Deployment
Static hosting recommended (Vercel, Netlify, GitHub Pages). Build output is in the `build/` directory.

## Contribution
- Fork the repo, create a feature branch, add tests, open a PR.
- Follow code style, include changelog entry for non-trivial changes.

## License
Specify a LICENSE file (e.g., MIT).

## Contact
Open issues for bugs or feature requests.