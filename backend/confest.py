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
