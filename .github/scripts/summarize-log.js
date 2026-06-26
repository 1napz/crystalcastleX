import fs from "fs";

const logPath = "logs/run.log";
const outputDir = "update";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

let summary = "No logs found";

if (fs.existsSync(logPath)) {
  const log = fs.readFileSync(logPath, "utf-8");

  const lines = log.split("\n");

  const errors = lines.filter(l => l.toLowerCase().includes("error"));
  const warnings = lines.filter(l => l.toLowerCase().includes("warn"));

  summary = `
# 📝 Log Summary

## 📊 Stats
- Total lines: ${lines.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}

## ❌ Errors
${errors.slice(0, 5).join("\n") || "None"}

## ⚠️ Warnings
${warnings.slice(0, 5).join("\n") || "None"}
`;
}

const date = new Date().toISOString().split("T")[0];
const file = `${outputDir}/${date}-summary.md`;

fs.writeFileSync(file, summary);

console.log("Summary created:", file);