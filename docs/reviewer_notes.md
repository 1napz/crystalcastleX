- name: Save reviewer notes
        run: |
          LOG_PATH="version/CrystalCastle/logs/reviewer-ci.log"
          COMMIT_SHA=$(git rev-parse HEAD)
          TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S %Z")

          {
            echo "✅ Lint/Test completed successfully"
            echo "ตรวจสอบ Lint/Test เสร็จสิ้นเรียบร้อย"
            echo ""
            echo "Commit: $COMMIT_SHA"
            echo "Timestamp: $TIMESTAMP"
            echo ""
            echo "Severity Matrix:"
            echo "- Lint fail → Minor (เล็กน้อย)"
            echo "- Docs lint fail → Moderate (ปานกลาง)"
            echo "- Test fail → Major (ร้ายแรง)"
            echo "- Build/coverage fail → Critical (วิกฤติ)"
            echo ""
            echo "หมายเหตุ: Reviewer cockpit ใช้ log นี้ในการตัดสินใจขั้นต่อไป"
          } > $LOG_PATH