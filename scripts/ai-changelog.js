import fs from "fs";

const changelog = fs.readFileSync("CHANGELOG.md", "utf-8");

// mock AI refine (คุณสามารถต่อ OpenAI / Claude ได้)
function refine(text) {
  return text
    .replace(/feat:/g, "✨ Features:")
    .replace(/fix:/g, "🐛 Fixes:")
    .replace(/docs:/g, "📝 Docs:")
    .replace(/refactor:/g, "♻️ Refactor:");
}

const refined = refine(changelog);

fs.writeFileSync("CHANGELOG.md", refined);
console.log("✅ Changelog refined");