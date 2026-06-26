# src/client.py
import os
import time
import requests
from typing import Optional

API_BASE = os.getenv("API_BASE", "http://localhost:8000")
API_KEY = os.getenv("X_API_KEY", "local-dev-key")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "3"))
POLL_TIMEOUT = int(os.getenv("POLL_TIMEOUT", "120"))  # seconds

HEADERS = {
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY,
}

def start_generation(product_id: str, image_url: str, platform: str = "tiktok", style: Optional[str] = None) -> str:
    payload = {
        "product_id": product_id,
        "image_url": image_url,
        "platform": platform,
    }
    if style:
        payload["style"] = style
    resp = requests.post(f"{API_BASE}/v1/generate", json=payload, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data.get("job_id")

def poll_job(job_id: str, timeout: int = POLL_TIMEOUT, interval: int = POLL_INTERVAL) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        resp = requests.get(f"{API_BASE}/v1/generate/{job_id}", headers=HEADERS, timeout=15)
        if resp.status_code == 404:
            raise RuntimeError("Job not found")
        resp.raise_for_status()
        data = resp.json()
        status = data.get("status")
        if status == "completed":
            return data
        if status == "failed":
            raise RuntimeError(f"Job failed: {data}")
        time.sleep(interval)
    raise TimeoutError("Polling timed out")

def main():
    # example values — replace or read from args
    product_id = os.getenv("EXAMPLE_PRODUCT_ID", "sku-123")
    image_url = os.getenv("EXAMPLE_IMAGE_URL", "https://cdn.example.com/p1.jpg")
    style = os.getenv("EXAMPLE_STYLE", "streetwear-retro")
    job_id = start_generation(product_id, image_url, platform="tiktok", style=style)
    print(f"Job queued: {job_id}")
    result = poll_job(job_id)
    print("Result:", result)
    artifact = result.get("artifact_url")
    if artifact:
        print("Artifact URL:", artifact)

if __name__ == "__main__":
    main()
