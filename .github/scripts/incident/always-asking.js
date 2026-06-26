- name: Notify missing fields
  if: failure()
  run: |
    echo "❌ Missing required fields in incident template"