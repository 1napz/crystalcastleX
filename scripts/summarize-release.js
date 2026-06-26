const fs = require("fs");

const summary = `
# AI Release Summary

## Highlights
- Improved rendering pipeline
- Reduced deployment failures
- Updated documentation workflow
`;

fs.writeFileSync("docs/RELEASE_SUMMARY.md", summary);
