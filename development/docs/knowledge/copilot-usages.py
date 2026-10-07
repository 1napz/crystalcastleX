import requests
import pandas as pd
from datetime import datetime, timedelta

TOKEN = "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"
ORG = "Zyntro-Media-AI"
SINCE = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
UNTIL = datetime.now().strftime("%Y-%m-%d")

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

url = f"https://api.github.com/orgs/{ORG}/copilot/usage?since={SINCE}&until={UNTIL}"
data = requests.get(url, headers=headers).json()

# 1. สร้าง DataFrame สำหรับสรุปตาม Phase
rows = []
for p in data.get("totals_by_ai_adoption_phase", []):
    sugg = p["avg_suggestions_per_user"]
    acc = p["avg_acceptances_per_user"]
    rows.append({
        "AI Adoption Phase": p["phase"],
        "Version": p["version"],
        "Engaged Users": p["total_engaged_users"],
        "Avg Suggestions/คน": round(sugg, 1),
        "Avg Acceptances/คน": round(acc, 1),
        "Acceptance Rate %": round(acc / sugg * 100, 1) if sugg > 0 else 0,
        "Avg Lines Accepted/คน": round(p["avg_lines_accepted_per_user"], 1),
        "Avg PRs Merged/คน": round(p["avg_prs_merged_per_user"], 1),
        "Median Time-to-Merge ชม.": round(p.get("avg_median_time_to_merge_per_user", 0), 1)
    })

df_phase = pd.DataFrame(rows)

# 2. สร้าง DataFrame สำหรับรายคน + phase
rows_user = []
for u in data.get("users", []):
    phase = u.get("ai_adoption_phase", {}).get("phase", "Phase 0 — No cohort")
    sugg = u["total_suggestions_count"]
    acc = u["total_acceptances_count"]
    rows_user.append({
        "Username": u["user_login"],
        "AI Adoption Phase":
