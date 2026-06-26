# tests/test_smoke_generation.py
import os
import time
import pytest
import requests
from src.client import start_generation, poll_job

API_BASE = os.getenv("API_BASE", "http://localhost:8000")
X_API_KEY = os.getenv("X_API_KEY", "local-dev-key")

@pytest.fixture(scope="session", autouse=True)
def wait_for_service():
    # wait for the app to be healthy
    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            r = requests.get(f"{API_BASE}/v1/status", timeout=3)
            if r.status_code == 200:
                return
        except requests.RequestException:
            pass
        time.sleep(1)
    pytest.skip("Service did not become healthy in time")

def test_generate_and_poll_success():
    # Minimal inputs; ensure the mock AI or local handler returns a queued->completed flow.
    product_id = f"smoke-{int(time.time())}"
    image_url = os.getenv("SMOKE_IMAGE_URL", "https://cdn.example.com/p1.jpg")
    job_id = start_generation(product_id=product_id, image_url=image_url, platform="tiktok", style="smoke-test")
    assert job_id, "Expected job_id from /v1/generate"

    result = poll_job(job_id, timeout=90, interval=2)
    assert result.get("status") == "completed"
    assert result.get("artifact_url"), "Expected artifact_url on completion"
