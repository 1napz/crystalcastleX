import os
import asyncio
from playwright.async_api import async_playwright

async def check_affiliate_links():
    async with async_playwright() as p:
        # เปิด Browser แบบเบื้องหลัง (Headless) ตามที่ตั้งค่าใน GitHub Actions
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # ใส่ URL หน้าเว็บหลักของคุณที่ต้องการทดสอบ
        target_url = "https://1napz.github.io/FeedFashionTH/" 
        print(f"🔍 กำลังตรวจสอบระบบที่: {target_url}")
        
        try:
            await page.goto(target_url, timeout=60000)
            
            # ดึงลิงก์ทั้งหมดในหน้าเว็บมาตรวจสอบ
            links = await page.eval_on_selector_all("a", "elements => elements.map(e => e.href)")
            print(f"🔗 พบลึงก์ทั้งหมด {len(links)} ลิงก์ กำลังเริ่มตรวจสอบ...")
            
            for link in links:
                if "shopee" in link or "tokopedia" in link or "instagram" in link:
                    # จำลองการคลิกดูว่าลิงก์ยังใช้งานได้ไหม
                    response = await page.request.get(link)
                    if response.status >= 400:
                        print(f"❌ [ลิงก์มีปัญหา] Status {response.status}: {link}")
                    else:
                        print(f"✅ [ปกติ] Status {response.status}: {link}")
                        
        except Exception as e:
            print(f"⚠️ เกิดข้อผิดพลาดระหว่างรันบอท: {e}")
            # เซฟรูปภาพหน้าจอเก็บไว้ดูหลักฐาน (จะถูกอัปโหลดขึ้น GitHub Artifacts อัตโนมัติ)
            os.makedirs("failure-screenshots", exist_ok=True)
            await page.screenshot(path="failure-screenshots/error-report.png")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(check_affiliate_links())

