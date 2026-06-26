const { execSync } = require("child_process");
const fs = require("fs");

const commits = execSync(
  'git log --pretty=format:"- %s (%h)" -10'
).toString();

const content = `
# CHANGELOG

## Latest Updates

${commits}
`;

fs.writeFileSync("docs/CHANGELOG.md", content);

console.log("CHANGELOG updated");
