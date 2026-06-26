#!/usr/bin/env node
const { Octokit } = require("@octokit/rest");
const fs = require("fs");

const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: token });

async function run() {
  const repo = process.env.GITHUB_REPOSITORY;
  const [owner, repoName] = repo.split("/");
  const prNumber = process.env.GITHUB_EVENT_PULL_REQUEST_NUMBER || process.env.GITHUB_REF.split("/").pop();

  // ดึงข้อมูล PR
  const { data: pr } = await octokit.pulls.get({
    owner,
    repo: repoName,
    pull_number: prNumber,
  });

  // สร้าง commit message แบบง่าย
  let msg = "";
  if (pr.title.toLowerCase().includes("docs")) {
    msg = `docs: ${pr.title}`;
  } else if (pr.title.toLowerCase().includes("fix")) {
    msg = `fix: ${pr.title}`;
  } else {
    msg = `chore: ${pr.title}`;
  }

  // เขียน commit message ลงไฟล์ (optional)
  fs.writeFileSync("commit_message.txt", msg);

  // เขียน comment ใน PR
  await octokit.issues.createComment({
    owner,
    repo: repoName,
    issue_number: prNumber,
    body: `💡 Suggested commit message: \`${msg}\``,
  });

  console.log("✅ Commit message suggested:", msg);
}

run().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});