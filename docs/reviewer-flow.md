name: Auto Reviewer Comment (Devcontainer Error)

on:
  pull_request:
    paths:
      - "logs/creation.log"

jobs:
  auto-comment:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Scan creation.log for Error 1302
        id: scan
        run: |
          if grep -q "UnifiedContainersError (code: 1302)" logs/creation.log; then
            echo "error_found=true" >> $GITHUB_ENV
          else
            echo "error_found=false" >> $GITHUB_ENV
          fi

      - name: Post Reviewer Comment
        if: env.error_found == 'true'
        uses: peter-evans/create-or-update-comment@v3
        with:
          issue-number: ${{ github.event.pull_request.number }}
          body: |
            ## 🛑 Devcontainer Setup Failure Detected
            Reviewer Bot found the following error in `creation.log`:

            ```
            UnifiedContainersError (code: 1302)
            Message: unable to find user codespace: no match
            ```

            ### 🇹🇭 ภาษาไทย
            - ตรวจสอบค่า `"remoteUser"` ใน `devcontainer.json`
            - ยืนยันว่า base image (`javascript-node:20`) มี user ที่กำหนดไว้
            - ตรวจสอบ log เพิ่มเติม
            - Rebuild container หลังแก้ไข config

            ### 🇬🇧 English
            - Check `"remoteUser"` in `devcontainer.json`
            - Ensure base image (`javascript-node:20`) contains the specified user
            - Review `creation.log` for more details
            - Rebuild container after fixing configuration

            Please fix and resubmit the PR for reviewer validation.