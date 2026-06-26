
```yaml
name: Telegram CLI Runner

on:
  workflow_dispatch:
  repository_dispatch:

jobs:
  run-cli:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Close all open PRs
        run: |
          gh pr list --state open --repo ${{ github.repository }} \
            | awk '{print $1}' \
            | xargs -n1 gh pr close --repo ${{ github.repository }}
        env:
          GITHUBTOKEN: ${{ secrets.GITHUBTOKEN }}
`

---


```bash
curl -X POST \
  -H "Authorization: token <YOURGITHUBPAT>" \
  -H "Accept: application/vnd.github.everest-preview+json" \
  https://api.github.com/repos/1napz/crystalcastle/dispatches \
  -d '{"event_type": "telegram-cli"}''

