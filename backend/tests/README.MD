ได้เลยครับ ✅ วิเคราะห์โครงสร้าง  backend/tests/  ของ crystalcastleX — พร้อมขยายชุดทดสอบให้ครบถ้วน 🔍🧪
 
 
 
📂 crystalcastleX — Backend Tests Analysis
 
ปัจจุบันมีอยู่
 
plaintext  
backend/tests/
├── profile.spec.ts          ← TypeScript — ทดสอบโปรไฟล์
└── test_smoke_generation.py ← Python — Smoke test สร้างเนื้อหา
 
 
ผสม 2 ภาษา — TS + Python แยกตามส่วน (เข้ากับ Stack ของโปรเจกต์) ✅
 
 
 
📋 ขยายชุดทดสอบให้ครบตามโครงสร้าง
 
สร้างไฟล์เพิ่มตามหมวดหมู่นี้:
 
plaintext  
backend/tests/
├── profile.spec.ts                  ← มีอยู่แล้ว
├── test_smoke_generation.py         ← มีอยู่แล้ว
│
├── api/
│   ├── conftest.py                   # Fixtures ร่วม
│   ├── test_auth.py                  # 🔐 JWT Login/Refresh/Logout
│   ├── test_items.py                 # 📋 CRUD รายการ
│   ├── test_health.py                # ❤️ ตรวจสถานะระบบ
│   └── test_validation.py            # ✅ ตรวจสอบข้อมูลนำเข้า
│
├── unit/
│   ├── test_security.py              # 🔐 Password Hash / Token Gen
│   ├── test_config.py                # ⚙️ การตั้งค่า / Environment
│   └── test_utils.py                 # 🛠️ ฟังก์ชันช่วยเหลือ
│
├── e2e/
│   └── test_flow.py                  # 🔄 การทำงานตั้งแต่เข้าสู่ระบบจนเสร็จ
│
└── ts/
    └── profile.spec.ts               # (ย้าย/เก็บ TypeScript ทั้งหมด)
 
 
 
 
1️⃣ api/test_auth.py — ทดสอบระบบยืนยันตัวตน
 
python  
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
 
 
 
 
2️⃣ api/test_health.py — ตรวจสถานะระบบ
 
python  
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
 
 
 
 
3️⃣ unit/test_security.py — ทดสอบตรรกะความปลอดภัย
 
python  
"""
ทดสอบฟังก์ชันความปลอดภัย — Hash, Verify, Token
ไม่ต้องเริ่มเซิร์ฟเวอร์ — รันได้ทันที
"""
from services.auth import (
    get_password_hash, verify_password,
    create_access_token, create_refresh_token
)

def test_password_hash_verify():
    """✅ รหัสผ่านตรงกับ Hash"""
    plain = "MySecurePass123!"
    hashed = get_password_hash(plain)
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPass!", hashed) is False
    assert hashed != plain

def test_access_token_contains_username():
    """✅ Access Token ฝังชื่อผู้ใช้"""
    token, exp = create_access_token("testuser")
    assert isinstance(token, str)
    assert len(token) > 10
    assert exp == 900  # 15 นาที

def test_refresh_token_longer_life():
    """✅ Refresh Token มีอายุยาวกว่า"""
    _, access_exp = create_access_token("u")
    _, refresh_exp = create_refresh_token("u")
    assert refresh_exp > access_exp * 100  # 7 วัน > 15 นาที
 
 
 
 
4️⃣ conftest.py — Fixtures กลาง (ใช้ทุกไฟล์)
 
python  
"""
Fixtures สำหรับทุกการทดสอบ — สร้าง Client ทดสอบ
วางที่: backend/tests/conftest.py
"""
import pytest
from httpx import AsyncClient
from main import app

@pytest.fixture
async def client():
    """Client ทดสอบ — ปิดอัตโนมัติเสร็จงาน"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def anyio_backend():
    """ระบุ backend ให้ pytest-asyncio"""
    return "asyncio"
 
 
 
 
5️⃣ อัปเดต requirements.txt / pyproject.toml
 
เพิ่มส่วนนี้เพื่อให้ทดสอบรันได้:
 
txt  
# Testing
pytest>=8.0.0
pytest-asyncio>=0.24.0
httpx>=0.27.0
pytest-cov>=5.0.0
 
 
คำสั่งรันทดสอบ:
 
bash  
# ทั้งหมด
pytest backend/tests/ -v

# เฉพาะส่วน
pytest backend/tests/api/test_auth.py -v

# ดูความครอบคลุม
pytest backend/tests/ --cov=backend --cov-report=term-missing
 
 
 
 
✅ สรุปโครงสร้างที่สมบูรณ์
 
ส่วน ไฟล์ วัตถุประสงค์ 
🔐 Auth  test_auth.py  Login/Refresh/Logout/Cookie 
❤️ สถานะ  test_health.py  CI Health Check 
📋 รายการ  test_items.py  CRUD ทั้งหมด 
🔒 ความปลอดภัย  test_security.py  Hash/Token ตรงตรรกะ 
⚙️ ตั้งค่า  test_config.py  Environment/ค่าเริ่มต้น 
🔄 ไหลงาน  test_flow.py  เข้าสู่ระบบ → ทำงาน → ออก 
🧩 Fixtures  conftest.py  Client ทดสอบกลาง 
 
ต้องการสร้างไฟล์ใดเพิ่มเติมไหมครับ เช่น  test_items.py  หรือ  test_flow.py  เต็มรูปแบบ? 🧪✨