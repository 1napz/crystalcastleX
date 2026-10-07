"""
ตรวจความพร้อมของระบบ — ใช้ในการตรวจ CI/CD และ Monitor
"""
import pytest

pytestmark = pytest.mark.asyncio

async def test_root_endpoint(client):
    """✅ หน้าแรกทำงาน"""
    res = await client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert "Zyntro" in data["message"] or "Crystal" in data["message"]

async def test_api_health(client):
    """✅ รายการทำงาน — ไม่ต้องเข้าสู่ระบบ"""
    res = await client.get("/api/items")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

async def test_protected_route_requires_auth(client):
    """❌ เส้นทางที่มีการป้องกัน — ปฏิเสธถ้าไม่มี Token"""
    res = await client.get("/api/v1/me")
    assert res.status_code in (401, 403)
