"""
Credit Note Manifest + SandboxAgent Integration
พร้อมระบบ Retry อัตโนมัติ + ตรวจสอบผลลัพธ์ละเอียด
"""

import os
import re
import time
from pathlib import Path
from typing import Optional, Dict, Any

from agents.sandbox import Manifest, SandboxAgent, SandboxRunConfig
from agents.sandbox.entries import LocalDir, File, GitRepo, Dir


# ... [ฟังก์ชัน ensure_core_task_files และ ensure_test_directory คงเดิม] ...
def ensure_core_task_files(repo_dir: Path) -> None:
    # (โค้ดเดิม)
    pass

def ensure_test_directory(repo_dir: Path) -> None:
    # (โค้ดเดิม)
    pass


class CreditNoteManifest:
    # ... (โค้ดเดิมของคลาส) ...
    pass


# ====================== ระบบตรวจสอบผลลัพธ์ ======================
def analyze_test_results(output: str) -> Dict[str, Any]:
    """วิเคราะห์ผลลัพธ์การทดสอบแบบละเอียด"""
    analysis = {
        "success": False,
        "passed_count": 0,
        "total_tests": 0,
        "details": []
    }

    passed_match = re.search(r'(\d+)\s+passed', output)
    if passed_match:
        analysis["passed_count"] = int(passed_match.group(1))

    if analysis["passed_count"] >= 2 or "2 passed" in output:
        analysis["success"] = True
        analysis["details"].append("✅ ผ่านเกณฑ์สำเร็จ (2 passed)")
    else:
        analysis["details"].append("❌ ยังไม่ผ่านเกณฑ์")

    if "Error" in output or "Traceback" in output:
        analysis["details"].append("⚠️ พบข้อผิดพลาด")
    if "AssertionError" in output:
        analysis["details"].append("⚠️ ทดสอบล้มเหลว")

    return analysis


def print_detailed_result(result: Any, attempt: int = 1) -> None:
    """แสดงผลลัพธ์แบบละเอียด"""
    print("\n" + "="*80)
    print(f"📊 รายงานผลการทำงาน (Attempt #{attempt})")
    print("="*80)

    output = getattr(result, 'final_output', '') or str(result)
    analysis = analyze_test_results(output)

    print(f"สถานะ           : {'✅ สำเร็จ' if analysis['success'] else '❌ ล้มเหลว'}")
    print(f"Passed           : {analysis['passed_count']}")
    
    for detail in analysis["details"]:
        print(detail)

    print("\n📋 Output สุดท้าย:")
    print("-" * 50)
    print(output.strip()[-700:])


# ====================== ระบบ Retry อัตโนมัติ ======================
def run_with_automatic_retry(max_retries: int = 5, max_steps_per_run: int = 25):
    """
    รัน Sandbox Agent พร้อมระบบ Retry อัตโนมัติ
    
    Parameters:
        max_retries (int): จำนวนครั้งสูงสุดที่จะลองใหม่
        max_steps_per_run (int): จำนวนขั้นตอนสูงสุดต่อการรันหนึ่งครั้ง
    """
    print(f"🚀 เริ่มระบบ Retry อัตโนมัติ (สูงสุด {max_retries} ครั้ง)\n")

    manifest_builder = CreditNoteManifest()
    manifest = manifest_builder.create(use_git=False)

    for attempt in range(1, max_retries + 1):
        print(f"\n🔄 Attempt #{attempt}/{max_retries}")

        agent = SandboxAgent(
            name=f"CreditNoteFixerAgent-Attempt{attempt}",
            manifest=manifest,
            instructions="""
            คุณคือ Senior Bug Fixing Engineer
            - อ่าน task.md และ AGENTS.md ก่อน
            - ใช้ skill $credit-note-fixer
            - หลังแก้ไขต้องรัน `sh tests/test_credit_note.sh` ทันที
            - เป้าหมายคือให้ได้ "2 passed"
            """,
            capabilities=["shell", "filesystem", "patch", "skills"],
        )

        config = SandboxRunConfig(
            max_steps=max_steps_per_run,
            timeout_seconds=900,
            auto_approve=False,
        )

        result = agent.run(
            task="แก้ไข bug การคำนวณ Credit Note ให้ผ่านการทดสอบทั้ง 2 เคส",
            config=config
        )

        # ตรวจสอบผลลัพธ์
        output = getattr(result, 'final_output', '') or str(result)
        analysis = analyze_test_results(output)

        print_detailed_result(result, attempt)

        if analysis["success"]:
            print(f"\n🎉 **สำเร็จในครั้งที่ {attempt}** - Credit Note Fixer ทำงานเสร็จสมบูรณ์!")
            return result
        else:
            if attempt < max_retries:
                wait_time = attempt * 2  # เพิ่มเวลา wait ทีละครั้ง
                print(f"⏳ กำลัง retry ใน {wait_time} วินาที...\n")
                time.sleep(wait_time)
            else:
                print(f"\n❌ ล้มเหลวหลังพยายาม {max_retries} ครั้ง")
                print("💡 คำแนะนำ: ตรวจสอบโค้ดหรือเพิ่ม Skill ให้ Agent")

    return result


# ====================== ตัวอย่างการใช้งาน ======================
if __name__ == "__main__":
    # รันด้วยระบบ Retry อัตโนมัติ
    final_result = run_with_automatic_retry(
        max_retries=5,           # สามารถปรับได้
        max_steps_per_run=30
    )