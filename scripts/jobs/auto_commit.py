#!/usr/bin/env python3
import json
import os

# อ่านไฟล์ที่เปลี่ยนจาก GitHub event
event_path = os.environ.get("GITHUB_EVENT_PATH")
with open(event_path, "r") as f:
    event = json.load(f)

files_changed = [f["filename"] for f in event["pull_request"]["changed_files"]]

# กำหนด commit message แบบง่าย
if any(f.startswith("docs/") for f in files_changed):
    msg = "docs: update documentation"
elif any(f.endswith(".py") for f in files_changed):
    msg = "fix: update Python scripts"
else:
    msg = "chore: update project files"

# เขียนลงไฟล์
with open("commit_message.txt", "w") as f:
    f.write(msg)