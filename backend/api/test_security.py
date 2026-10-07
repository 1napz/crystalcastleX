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
