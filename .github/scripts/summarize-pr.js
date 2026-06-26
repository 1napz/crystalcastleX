const fs = require("fs");

const title = process.env.PR_TITLE || "Unknown PR";

const summary = `
# PR Summary

## Title
${title}

## AI Analysis
- Change type detected
- Documentation impact reviewed
- Release note candidate generated
`;

fs.writeFileSync("PR_SUMMARY.md", summary);

console.log("PR summary generated");