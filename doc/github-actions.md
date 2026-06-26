
---

## 📄 3. `doc/github-actions.md`

```markdown
# การตั้งค่า GitHub Actions Workflows สำหรับ Crystal Castle

สร้างโฟลเดอร์ `.github/workflows/` แล้วเพิ่มไฟล์ YAML ตามตัวอย่าง

## 1. Secrets Scanning (`secrets-scan.yml`)

```yaml
name: Secrets Scan

on:
  push:
      branches: [ main ]
        pull_request:
            branches: [ main ]
              schedule:
                  - cron: '0 0 * * 0'  # ทุกวันอาทิตย์

                  jobs:
                    scan:
                        runs-on: ubuntu-latest
                            steps:
                                  - uses: actions/checkout@v4
                                          with:
                                                    fetch-depth: 0
                                                          - name: Install truffleHog
                                                                  run: pip install truffleHog
                                                                        - name: Run truffleHog
                                                                                run: trufflehog git file://. --json --only-verified > trufflehog_report.json || true
                                                                                      - name: Upload report
                                                                                              uses: actions/upload-artifact@v4
                                                                                                      with:
                                                                                                                name: trufflehog-report
                                                                                                                          path: trufflehog_report.json