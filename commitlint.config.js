module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "docs",
        "ui",
        "ci",
        "chore",
        "test",
        "perf",
        "security"
      ]
    ],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [2, "never", ["sentence-case", "start-case"]],
    "subject-max-length": [2, "always", 72]
  }
};