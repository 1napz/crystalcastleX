"""
ทดสอบ /api/v1/auth — Login, Refresh, Logout
ครอบคลุม: สำเร็จ · ผิดพลาด · Token หมดอายุ · ไม่มีสิทธิ์
"""
import pytest
from fastapi import status

pytestmark = pytest.mark.asyncio

BASE = "/api/v1/auth"

async def test_login_success(client):
    """✅ เข้าสู่ระบบสำเร็จ — ได้ Token + Cookie"""
    res = await client.post(
        f"{BASE}/login",
        json={"username": "admin", "password": "ChangeMe123!"}
    )
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 900
    assert "access_token" in res.cookies
    assert "refresh_token" in res.cookies

async def test_login_wrong_password(client):
    """❌ รหัสผ่านผิด — 401"""
    res = await client.post(
        f"{BASE}/login",
        json={"username": "admin", "password": "Wrong!"}
    )
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

async def test_login_nonexistent_user(client):
    """❌ ไม่พบผู้ใช้ — 401"""
    res = await client.post(
        f"{BASE}/login",
        json={"username": "ghost", "password": "AnyPass123!"}
    )
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

async def test_refresh_token_success(client):
    """✅ ต่ออายุ Token สำเร็จ — Cookie ส่งเอง"""
    # เข้าสู่ระบบก่อน
    login = await client.post(
        f"{BASE}/login",
        json={"username": "admin", "password": "ChangeMe123!"}
    )
    assert login.status_code == 200

    # ต่ออายุ
    res = await client.post(f"{BASE}/refresh")
    assert res.status_code == 200
    assert "access_token" in res.json()

async def test_refresh_without_token(client):
    """❌ ไม่มี Refresh Token — 401"""
    res = await client.post(f"{BASE}/refresh")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED

async def test_logout_clears_cookies(client):
    """✅ ออกจากระบบ — ล้าง Cookie ทั้งคู่"""
    await client.post(
        f"{BASE}/login",
        json={"username": "admin", "password": "ChangeMe123!"}
    )
    res = await client.post(f"{BASE}/logout")
    assert res.status_code == 200
    assert res.json()["message"] == "ออกจากระบบสำเร็จ"
    assert "access_token" not in res.cookies
    assert "refresh_token" not in res.cookies
