- name: Install dependencies
  run: pip install requests python-dotenv urllib3

- name: Run monitor
  working-directory: link-monitor    # ← เพิ่มบรรทัดนี้
  env:
    MY_LINE_KEY: ${{ secrets.MY_LINE_KEY }}
    MY_LINE_USER_ID: ${{ secrets.MY_LINE_USER_ID }}
  run: python monitor.py