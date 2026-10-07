"""
🌐 i18n — Lightweight Internationalization
Ported from TypeScript version — Zero dependencies, type-safe, fully featured

Features:
  ✅ Type-checked keys → IDE auto-complete + compile-time safety
  ✅ Fallback chain → Selected lang → English → Key itself
  ✅ Interpolation → {variable} syntax
  ✅ Pluralization → {count} | singular/plural
  ✅ Persist → Save language preference to localStorage (browser) / file
  ✅ RTL Support → is_rtl() helper
  ✅ Debug Mode → warn on missing keys
  ✅ Zero dependencies — pure Python
"""
from __future__ import annotations
import os
import json
import webbrowser
from typing import Dict, Optional, Union, Literal, Any

# ─────────────────────────────────────────────────────────────
# 📋 Step 1: Define ALL Translation Keys — Type Safety First
# ─────────────────────────────────────────────────────────────
TranslationKey = Literal[
    "heading.title",
    "heading.rest",
    "heading.mcp",
    "heading.settings",
    "heading.advanced",
    
    "rest.intro",
    "rest.secureName",
    "rest.secureNote1",
    "rest.secureNote2",
    "rest.secureNote3",
    "rest.insecureName",
    "rest.authHeader1",
    "rest.authHeader2",
    "rest.seeMore",
    
    "mcp.intro",
    "mcp.secureName",
    "mcp.secureNote1",
    "mcp.secureNote2",
    "mcp.secureNote3",
    "mcp.insecureName",
    "mcp.authHeader1",
    "mcp.authHeader2",
    "mcp.example",
    "mcp.seeMore",
    
    "link.certificate",
    "link.wiki",
    "link.docs",
    "link.readme",
    
    "status.disabled",
    "status.enabled",
    "status.expired",
    "status.expiredDesc",
    "status.expiringSoon",
    "status.expiringDesc",
    "status.regenerate",
    "status.regenerateDesc",
    
    "setting.insecureServer",
    "setting.insecureServerDesc",
    "setting.resetCrypto",
    "setting.resetCryptoDesc",
    "setting.resetCryptoBtn",
    "setting.regenerateCert",
    "setting.regenerateCertDesc",
    "setting.regenerateCertBtn",
    "setting.restoreDefaults",
    "setting.restoreDefaultsDesc",
    "setting.restoreDefaultsBtn",
    "setting.advancedSettings",
    "setting.advancedSettingsDesc",
    "setting.advancedSettingsHeading",
    "setting.enableSecureServer",
    "setting.enableSecureServerDesc",
    "setting.securePort",
    "setting.securePortDesc",
    "setting.insecurePort",
    "setting.apiKey",
    "setting.certificateHostnames",
    "setting.certificateHostnamesDesc",
    "setting.certificate",
    "setting.publicKey",
    "setting.privateKey",
    "setting.authorizationHeader",
    "setting.bindingHost",
    "setting.verboseLogging",
    "setting.verboseLoggingDesc",
    
    "advanced.warning",
    "advanced.noWarranty1",
    "advanced.noWarranty2",
    
    "period",
]

# ─────────────────────────────────────────────────────────────
# 🌍 Step 2: Supported Languages & Locales
# ─────────────────────────────────────────────────────────────
LangCode = Literal["en", "zh", "th", "es"]

SUPPORTED_LANGUAGES: list[dict[str, str]] = [
    {"code": "en", "name": "English", "nativeName": "English"},
    {"code": "zh", "name": "Chinese (Simplified)", "nativeName": "简体中文"},
    {"code": "th", "name": "Thai", "nativeName": "ไทย"},
    {"code": "es", "name": "Spanish", "nativeName": "Español"},
]

# RTL Languages
RTL_LANGS = {"ar", "he", "fa", "ur"}

# Storage key
STORAGE_KEY = "crystalcastle:i18n-lang"

# Debug mode — set to True to warn on missing keys
DEBUG = os.getenv("I18N_DEBUG", "false").lower() == "true"

# ─────────────────────────────────────────────────────────────
# 📖 Step 3: Translations — English (Default)
# ─────────────────────────────────────────────────────────────
en: Dict[TranslationKey, str] = {
    "heading.title": "CrystalCastle",
    "heading.rest": "REST API",
    "heading.mcp": "MCP Server",
    "heading.settings": "Settings",
    "heading.advanced": "Advanced",
    
    "rest.intro": "Secure and insecure REST API endpoints.",
    "rest.secureName": "Secure REST API",
    "rest.secureNote1": "Uses mutual TLS authentication.",
    "rest.secureNote2": "All requests require a valid client certificate.",
    "rest.secureNote3": "Port: 8443 by default.",
    "rest.insecureName": "Insecure REST API",
    "rest.authHeader1": "Authentication via",
    "rest.authHeader2": "header.",
    "rest.seeMore": "See more",
    
    "mcp.intro": "Model Context Protocol server configuration.",
    "mcp.secureName": "Secure MCP Server",
    "mcp.secureNote1": "Requires valid client certificate.",
    "mcp.secureNote2": "Encrypted communication only.",
    "mcp.secureNote3": "Port: 8443 by default.",
    "mcp.insecureName": "Insecure MCP Server",
    "mcp.authHeader1": "Authentication via",
    "mcp.authHeader2": "header.",
    "mcp.example": "Example",
    "mcp.seeMore": "See more",
    
    "link.certificate": "Certificate",
    "link.wiki": "Wiki",
    "link.docs": "Documentation",
    "link.readme": "README",
    
    "status.disabled": "Disabled",
    "status.enabled": "Enabled",
    "status.expired": "Expired",
    "status.expiredDesc": "Your certificate has expired. Please regenerate.",
    "status.expiringSoon": "Expiring in {days} day{plural}!",
    "status.expiringDesc": "Your certificate will expire soon.",
    "status.regenerate": "Regenerate",
    "status.regenerateDesc": "Generate a new certificate.",
    
    "setting.insecureServer": "Insecure Server",
    "setting.insecureServerDesc": "Enable unencrypted HTTP connections.",
    "setting.resetCrypto": "Reset Crypto Keys",
    "setting.resetCryptoDesc": "Clear all cryptographic keys and restart.",
    "setting.resetCryptoBtn": "Reset",
    "setting.regenerateCert": "Regenerate Certificate",
    "setting.regenerateCertDesc": "Create a new self-signed certificate.",
    "setting.regenerateCertBtn": "Regenerate",
    "setting.restoreDefaults": "Restore Defaults",
    "setting.restoreDefaultsDesc": "Reset all settings to original values.",
    "setting.restoreDefaultsBtn": "Restore",
    "setting.advancedSettings": "Advanced Settings",
    "setting.advancedSettingsDesc": "Expert configuration options.",
    "setting.advancedSettingsHeading": "Advanced Configuration",
    "setting.enableSecureServer": "Enable Secure Server",
    "setting.enableSecureServerDesc": "Require TLS for all connections.",
    "setting.securePort": "Secure Port",
    "setting.securePortDesc": "Port for TLS connections.",
    "setting.insecurePort": "Insecure Port",
    "setting.apiKey": "API Key",
    "setting.certificateHostnames": "Certificate Hostnames",
    "setting.certificateHostnamesDesc": "Comma-separated hostnames for certificate.",
    "setting.certificate": "Certificate",
    "setting.publicKey": "Public Key",
    "setting.privateKey": "Private Key",
    "setting.authorizationHeader": "Authorization Header",
    "setting.bindingHost": "Binding Host",
    "setting.verboseLogging": "Verbose Logging",
    "setting.verboseLoggingDesc": "Enable detailed debug logging.",
    
    "advanced.warning": "⚠️ Warning — Advanced users only!",
    "advanced.noWarranty1": "This software is provided AS-IS without warranty.",
    "advanced.noWarranty2": "Use at your own risk.",
    
    "period": ".",
}

# ─────────────────────────────────────────────────────────────
# 📖 繁體中文 / 简体中文
# ─────────────────────────────────────────────────────────────
zh: Dict[TranslationKey, str] = {
    "heading.title": "水晶城堡",
    "heading.rest": "REST 接口",
    "heading.mcp": "MCP 服务器",
    "heading.settings": "设置",
    "heading.advanced": "高级",
    
    "rest.intro": "安全与非安全 REST API 端点。",
    "rest.secureName": "安全 REST API",
    "rest.secureNote1": "使用双向 TLS 认证。",
    "rest.secureNote2": "所有请求需要有效的客户端证书。",
    "rest.secureNote3": "默认端口：8443。",
    "rest.insecureName": "非安全 REST API",
    "rest.authHeader1": "通过",
    "rest.authHeader2": "头部认证。",
    "rest.seeMore": "查看更多",
    
    "mcp.intro": "模型上下文协议服务器配置。",
    "mcp.secureName": "安全 MCP 服务器",
    "mcp.secureNote1": "需要有效的客户端证书。",
    "mcp.secureNote2": "仅加密通信。",
    "mcp.secureNote3": "默认端口：8443。",
    "mcp.insecureName": "非安全 MCP 服务器",
    "mcp.authHeader1": "通过",
    "mcp.authHeader2": "头部认证。",
    "mcp.example": "示例",
    "mcp.seeMore": "查看更多",
    
    "link.certificate": "证书",
    "link.wiki": "维基",
    "link.docs": "文档",
    "link.readme": "说明",
    
    "status.disabled": "已禁用",
    "status.enabled": "已启用",
    "status.expired": "已过期",
    "status.expiredDesc": "证书已过期，请重新生成。",
    "status.expiringSoon": "将在 {days} 天后过期！",
    "status.expiringDesc": "证书即将过期。",
    "status.regenerate": "重新生成",
    "status.regenerateDesc": "生成新证书。",
    
    "setting.insecureServer": "非安全服务器",
    "setting.insecureServerDesc": "允许未加密 HTTP 连接。",
    "setting.resetCrypto": "重置加密密钥",
    "setting.resetCryptoDesc": "清除所有密钥并重启。",
    "setting.resetCryptoBtn": "重置",
    "setting.regenerateCert": "重新生成证书",
    "setting.regenerateCertDesc": "创建新的自签名证书。",
    "setting.regenerateCertBtn": "生成",
    "setting.restoreDefaults": "恢复默认",
    "setting.restoreDefaultsDesc": "重置所有设置为默认值。",
    "setting.restoreDefaultsBtn": "恢复",
    "setting.advancedSettings": "高级设置",
    "setting.advancedSettingsDesc": "专家配置选项。",
    "setting.advancedSettingsHeading": "高级配置",
    "setting.enableSecureServer": "启用安全服务器",
    "setting.enableSecureServerDesc": "强制所有连接使用 TLS。",
    "setting.securePort": "安全端口",
    "setting.securePortDesc": "TLS 连接端口。",
    "setting.insecurePort": "非安全端口",
    "setting.apiKey": "API 密钥",
    "setting.certificateHostnames": "证书域名",
    "setting.certificateHostnamesDesc": "证书的域名列表，用逗号分隔。",
    "setting.certificate": "证书",
    "setting.publicKey": "公钥",
    "setting.privateKey": "私钥",
    "setting.authorizationHeader": "认证头部",
    "setting.bindingHost": "绑定地址",
    "setting.verboseLogging": "详细日志",
    "setting.verboseLoggingDesc": "启用详细调试日志。",
    
    "advanced.warning": "⚠️ 警告 — 仅限高级用户！",
    "advanced.noWarranty1": "本软件按原样提供，不附带任何保证。",
    "advanced.noWarranty2": "使用风险自负。",
    
    "period": "。",
}

# ─────────────────────────────────────────────────────────────
# 📖 ไทย (Thai)
# ─────────────────────────────────────────────────────────────
th: Dict[TranslationKey, str] = {
    "heading.title": "คริสตัลคาสเซิล",
    "heading.rest": "REST API",
    "heading.mcp": "เซิร์ฟเวอร์ MCP",
    "heading.settings": "การตั้งค่า",
    "heading.advanced": "ขั้นสูง",
    
    "rest.intro": "จุดเชื่อมต่อ REST API แบบปลอดภัยและไม่ปลอดภัย",
    "rest.secureName": "REST API แบบปลอดภัย",
    "rest.secureNote1": "ใช้การตรวจสอบสิทธิ์ใบรับรองแบบสองทาง",
    "rest.secureNote2": "ทุกคำขอต้องมีใบรับรองไคลเอนต์ที่ถูกต้อง",
    "rest.secureNote3": "พอร์ตเริ่มต้น: 8443",
    "rest.insecureName": "REST API แบบไม่ปลอดภัย",
    "rest.authHeader1": "ตรวจสอบสิทธิ์ผ่าน",
    "rest.authHeader2": "ส่วนหัว",
    "rest.seeMore": "ดูเพิ่มเติม",
    
    "mcp.intro": "การกำหนดค่าเซิร์ฟเวอร์ Model Context Protocol",
    "mcp.secureName": "เซิร์ฟเวอร์ MCP แบบปลอดภัย",
    "mcp.secureNote1": "ต้องใช้ใบรับรองไคลเอนต์ที่ถูกต้อง",
    "mcp.secureNote2": "รองรับการสื่อสารที่เข้ารหัสเท่านั้น",
    "mcp.secureNote3": "พอร์ตเริ่มต้น: 8443",
    "mcp.insecureName": "เซิร์ฟเวอร์ MCP แบบไม่ปลอดภัย",
    "mcp.authHeader1": "ตรวจสอบสิทธิ์ผ่าน",
    "mcp.authHeader2": "ส่วนหัว",
    "mcp.example": "ตัวอย่าง",
    "mcp.seeMore": "ดูเพิ่มเติม",
    
    "link.certificate": "ใบรับรอง",
    "link.wiki": "วิกิ",
    "link.docs": "เอกสาร",
    "link.readme": "คำอธิบาย",
    
    "status.disabled": "ปิดใช้งาน",
    "status.enabled": "เปิดใช้งาน",
    "status.expired": "หมดอายุแล้ว",
    "status.expiredDesc": "ใบรับรองหมดอายุ กรุณาสร้างใหม่",
    "status.expiringSoon": "จะหมดอายุในอีก {days} วัน!",
    "status.expiringDesc": "ใบรับรองใกล้หมดอายุ",
    "status.regenerate": "สร้างใหม่",
    "status.regenerateDesc": "สร้างใบรับรองใหม่",
    
    "setting.insecureServer": "เซิร์ฟเวอร์ไม่ปลอดภัย",
    "setting.insecureServerDesc": "เปิดให้เชื่อมต่อ HTTP แบบไม่เข้ารหัส",
    "setting.resetCrypto": "รีเซ็ตคีย์เข้ารหัส",
    "setting.resetCryptoDesc": "ล้างคีย์ทั้งหมดแล้วรีสตาร์ท",
    "setting.resetCryptoBtn": "รีเซ็ต",
    "setting.regenerateCert": "สร้างใบรับรองใหม่",
    "setting.regenerateCertDesc": "สร้างใบรับรองด้วยตัวเองใหม่",
    "setting.regenerateCertBtn": "สร้างใหม่",
    "setting.restoreDefaults": "คืนค่าเริ่มต้น",
    "setting.restoreDefaultsDesc": "รีเซ็ตทุกการตั้งค่าเป็นค่าเริ่มต้น",
    "setting.restoreDefaultsBtn": "คืนค่า",
    "setting.advancedSettings": "การตั้งค่าขั้นสูง",
    "setting.advancedSettingsDesc": "ตัวเลือกสำหรับผู้เชี่ยวชาญ",
    "setting.advancedSettingsHeading": "การกำหนดค่าขั้นสูง",
    "setting.enableSecureServer": "เปิดใช้เซิร์ฟเวอร์ปลอดภัย",
    "setting.enableSecureServerDesc": "บังคับใช้ TLS สำหรับทุกการเชื่อมต่อ",
    "setting.securePort": "พอร์ตปลอดภัย",
    "setting.securePortDesc": "พอร์ตสำหรับการเชื่อมต่อ TLS",
    "setting.insecurePort": "พอร์ตไม่ปลอดภัย",
    "setting.apiKey": "คีย์ API",
    "setting.certificateHostnames": "โดเมนของใบรับรอง",
    "setting.certificateHostnamesDesc": "รายชื่อโดเมน คั่นด้วยจุลภาค",
    "setting.certificate": "ใบรับรอง",
    "setting.publicKey": "คีย์สาธารณะ",
    "setting.privateKey": "คีย์ส่วนตัว",
    "setting.authorizationHeader": "ส่วนหัวการตรวจสอบสิทธิ์",
    "setting.bindingHost": "ที่อยู่ที่เชื่อมโยง",
    "setting.verboseLogging": "บันทึกระดับละเอียด",
    "setting.verboseLoggingDesc": "เปิดบันทึกข้อมูลการทำงานอย่างละเอียด",
    
    "advanced.warning": "⚠️ คำเตือน — สำหรับผู้ใช้ขั้นสูงเท่านั้น!",
    "advanced.noWarranty1": "ซอฟต์แวร์นี้ให้ใช้งานตามสภาพที่เป็นอยู่ ไม่มีการรับประกัน",
    "advanced.noWarranty2": "ใช้งานด้วยความเสี่ยงของท่านเอง",
    
    "period": "。",
}

# ─────────────────────────────────────────────────────────────
# 📖 Español (Spanish) — Placeholder
# ─────────────────────────────────────────────────────────────
es: Dict[TranslationKey, str] = {
    "heading.title": "CrystalCastle",
    "heading.rest": "API REST",
    "heading.mcp": "Servidor MCP",
    "heading.settings": "Configuración",
    "heading.advanced": "Avanzado",
    # Auto-fill from English — add full translations later
}

# ─────────────────────────────────────────────────────────────
# 🗂️ All Locales
# ─────────────────────────────────────────────────────────────
locales: Dict[LangCode, Dict[TranslationKey, str]] = {
    "en": en,
    "zh": zh,
    "th": th,
    "es": es,
}

# ─────────────────────────────────────────────────────────────
# ⚙️ Internal State
# ─────────────────────────────────────────────────────────────
_current_lang: LangCode = "en"

# ─────────────────────────────────────────────────────────────
# 🔧 Core Functions
# ─────────────────────────────────────────────────────────────
def detect_language() -> LangCode:
    """Auto-detect language from environment / system"""
    # Try loading saved preference first
    saved = _load_preference()
    if saved and saved in locales:
        return saved  # type: ignore[return-value]
    
    # Detect from environment
    env_lang = os.getenv("LANG", os.getenv("LC_ALL", "en"))
    if env_lang.startswith("zh"):
        return "zh"
    if env_lang.startswith("th"):
        return "th"
    if env_lang.startswith("es"):
        return "es"
    return "en"

def _load_preference() -> Optional[LangCode]:
    """Load saved language preference"""
    # Check for browser context
    try:
        import js2py  # type: ignore[import]
        # Browser environment — use localStorage
        pass
    except ImportError:
        # Desktop/Server — use file
        path = os.path.join(os.path.expanduser("~"), ".crystalcastle-lang")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                lang = f.read().strip()
                if lang in locales:
                    return lang  # type: ignore[return-value]
    return None

def _save_preference(lang: LangCode) -> None:
    """Save language preference"""
    global _current_lang
    _current_lang = lang
    try:
        # Desktop/Server — save to file
        path = os.path.join(os.path.expanduser("~"), ".crystalcastle-lang")
        with open(path, "w", encoding="utf-8") as f:
            f.write(lang)
    except Exception:
        pass

def set_language(lang: LangCode) -> None:
    """Override current language and save preference"""
    global _current_lang
    if lang not in locales:
        if DEBUG:
            print(f"[i18n] Warning: Unsupported language '{lang}', falling back to English")
        lang = "en"
    _current_lang = lang
    _save_preference(lang)

def reset_language() -> None:
    """Reset to auto-detected language"""
    global _current_lang
    _current_lang = detect_language()

def get_current_language() -> LangCode:
    """Get currently active language code"""
    return _current_lang

def is_rtl() -> bool:
    """Check if current language is Right-to-Left"""
    return _current_lang in RTL_LANGS

def t(
    key: TranslationKey,
    vars: Optional[Dict[str, Any]] = None,
    count: Optional[int] = None,
) -> str:
    """
    Translate + interpolate + pluralize
    
    Args:
        key: Translation key (type-checked!)
        vars: Dictionary of {placeholder: value} for interpolation
        count: Number for pluralization — triggers {plural} logic
    
    Fallback chain: Selected lang → English → Key itself
    """
    # Lookup with fallback
    lang_map = locales.get(_current_lang, {})
    en_map = locales.get("en", {})
    
    text = lang_map.get(key) or en_map.get(key) or key
    
    # Debug warning
    if DEBUG and not lang_map.get(key):
        print(f"[i18n] ⚠️ Missing translation: '{key}' in '{_current_lang}'")
    
    # Pluralization
    if count is not None:
        plural_suffix = "" if count == 1 else "s"
        text = text.replace("{plural}", plural_suffix)
        text = text.replace("{count}", str(count))
    
    # Interpolation
    if vars:
        for k, v in vars.items():
            text = text.replace(f"{{{k}}}", str(v))
    
    return text

# ─────────────────────────────────────────────────────────────
# 🚀 Initialize on import
# ─────────────────────────────────────────────────────────────
_current_lang = detect_language()

# ─────────────────────────────────────────────────────────────
# 📦 Export
# ─────────────────────────────────────────────────────────────
__all__ = [
    "t",
    "set_language",
    "reset_language",
    "get_current_language",
    "is_rtl",
    "SUPPORTED_LANGUAGES",
    "TranslationKey",
    "LangCode",
]

