ENABLE_SYNC = False

if not ENABLE_SYNC:
    print("DNS sync disabled (safe mode)")
    exit()

#!/usr/bin/env python3
"""
Idempotent DNS updater for WordPress.com-managed DNS (zyntro-media.art).
- Replaces existing DKIM TXT matching selector (google._domainkey).
- Removes duplicate records for the same name+type that don't match desired values.
Requirements: requests (pip install requests)
Set env var: WP_TOKEN
Usage: python wp_dns_sync.py
"""

import os, sys, requests, time

WP_TOKEN = os.getenv("WP_TOKEN")
SITE = "zyntro-media.art"
API_BASE = f"https://public-api.wordpress.com/rest/v1.1/sites/{SITE}/domains/{SITE}/dns/records"
HEADERS = {"Authorization": f"Bearer {WP_TOKEN}", "Content-Type": "application/json"}

if not WP_TOKEN:
    print("Set WP_TOKEN environment variable with a WordPress.com OAuth token."); sys.exit(1)

# Replace DKIM_VALUE and optionally VERIFICATION_STRING before running
DKIM_VALUE = "REPLACE_WITH_GOOGLE_DKIM_VALUE"
VERIFICATION_STRING = None  # e.g., "google-site-verification=ABC" or None to skip

DESIRED = [
    {"name":"www","type":"CNAME","value":"zyntro-media.wordpress.com.","ttl":3600},
    {"name":"@","type":"ANAME","value":"zyntro-media.wordpress.com.","ttl":3600},
    {"name":"@","type":"MX","value":"ASPMX.L.GOOGLE.COM.","priority":1,"ttl":3600},
    {"name":"@","type":"MX","value":"ALT1.ASPMX.L.GOOGLE.COM.","priority":5,"ttl":3600},
    {"name":"@","type":"MX","value":"ALT2.ASPMX.L.GOOGLE.COM.","priority":5,"ttl":3600},
    {"name":"@","type":"MX","value":"ALT3.ASPMX.L.GOOGLE.COM.","priority":10,"ttl":3600},
    {"name":"@","type":"MX","value":"ALT4.ASPMX.L.GOOGLE.COM.","priority":10,"ttl":3600},
    {"name":"@","type":"TXT","value":"v=spf1 include:_spf.google.com ~all","ttl":3600},
    {"name":"google._domainkey","type":"TXT","value":DKIM_VALUE,"ttl":3600},
    {"name":"_dmarc","type":"TXT","value":"v=DMARC1; p=quarantine; rua=mailto:postmaster@zyntro-media.art; pct=100;","ttl":3600},
]

if VERIFICATION_STRING:
    DESIRED.append({"name":"@","type":"TXT","value":VERIFICATION_STRING,"ttl":3600})

def list_records():
    resp = requests.get(API_BASE, headers=HEADERS)
    resp.raise_for_status()
    return resp.json().get("records", [])

def create_record(rec):
    r = requests.post(API_BASE, json=rec, headers=HEADERS)
    return r

def update_record(record_id, rec):
    url = f"{API_BASE}/{record_id}"
    r = requests.post(url, json=rec, headers=HEADERS)
    return r

def delete_record(record_id):
    url = f"{API_BASE}/{record_id}"
    r = requests.delete(url, headers=HEADERS)
    return r

def normalize_name(n):
    return n if n!="@" else SITE

def records_by_key(records):
    d = {}
    for r in records:
        key = (r.get("name"), r.get("type"))
        d.setdefault(key, []).append(r)
    return d

def same_record(existing, desired):
    if existing.get("type") != desired.get("type"): return False
    if existing.get("name") != desired.get("name"): return False
    if existing.get("value") != desired.get("value"): return False
    if desired.get("priority") is not None and existing.get("priority") != desired.get("priority"): return False
    return True

def sync():
    existing = list_records()
    index = records_by_key(existing)

    for want in DESIRED:
        key = (want["name"], want["type"])
        existing_group = index.get(key, [])
        # If exact match exists, keep it and remove any other duplicates
        matched = None
        for e in existing_group:
            if same_record(e, want):
                matched = e
                break

        # Remove duplicates that don't match desired
        for e in existing_group:
            if matched and e.get("ID") == matched.get("ID"): continue
            # If this record equals desired value but different ID, keep the first and delete others
            if not same_record(e, want):
                # Decide whether to delete non-matching duplicates (safe for TXT/MX duplicates)
                rec_id = e.get("ID") or e.get("id") or e.get("record_id")
                if rec_id:
                    r = delete_record(rec_id)
                    if r.status_code in (200,204):
                        print(f"Deleted duplicate/non-matching record: {e.get('type')} {e.get('name')} (id {rec_id})")
                    else:
                        print(f"Failed to delete record id {rec_id}: {r.status_code} {r.text}")
        if matched:
            print(f"OK: {want['type']} {want['name']} exists and matches desired")
            continue

        # No exact match: if there's any existing record for the key, update the first one; else create
        if existing_group:
            e = existing_group[0]
            rec_id = e.get("ID") or e.get("id") or e.get("record_id")
            if rec_id:
                payload = {k:v for k,v in want.items() if k!="name"}
                r = update_record(rec_id, payload)
                if r.status_code in (200,201):
                    print(f"Updated record id {rec_id}: {want['type']} {want['name']}")
                else:
                    print(f"Update failed ({r.status_code}) for id {rec_id}: {r.text}")
                continue
        # Otherwise create
        r = create_record(want)
        if r.status_code in (200,201):
            print(f"Created: {want['type']} {want['name']}")
        else:
            print(f"Create failed ({r.status_code}): {want['type']} {want['name']} -> {r.text}")

if __name__ == "__main__":
    log("wp_dns_sync script booting...")

    run_sync()