// githubTriggerReporter.js
const { Octokit } = require("@octokit/rest");

class GitHubTriggerReporter {
  onEnd(result) {
    if (result.status === 'passed') {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      octokit.actions.createWorkflowDispatch({
        owner: 'ZyntroMedia',
        repo: 'zyntromedia',
        workflow_id: 'studio-usage.yml',
        ref: 'main'
      });
    }
  }
}
module.exports = GitHubTriggerReporter;
