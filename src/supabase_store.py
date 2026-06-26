# supabase_store.py
import os
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]   # ใส่ใน GitHub Secrets
SUPABASE_KEY = os.environ["SUPABASE_KEY"]   # Service Role Key

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

def upsert_link(slug: str, url: str, metadata: dict = {}):
    """แทน redis.set()"""
    sb.table("affiliate_links").upsert({
        "slug": slug,
        "url": url,
        "metadata": metadata
    }).execute()

def get_link(slug: str) -> dict | None:
    """แทน redis.get()"""
    res = sb.table("affiliate_links").select("*").eq("slug", slug).single().execute()
    return res.data

def update_status(slug: str, status_code: int, response_ms: int):
    """อัปเดตสถานะหลัง ping"""
    status = "active" if status_code == 200 else "down"
    sb.table("affiliate_links").update({
        "status": status,
        "last_checked": "now()",
        "last_status_code": status_code
    }).eq("slug", slug).execute()

    sb.table("link_monitor_log").insert({
        "slug": slug,
        "status_code": status_code,
        "response_ms": response_ms
    }).execute()

def get_all_active() -> list:
    """ดึง links ทั้งหมดที่ active"""
    res = sb.table("affiliate_links").select("*").eq("status", "active").execute()
    return res.data