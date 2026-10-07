"""
test_claude_client.py
Tests Claude API connectivity โ€” works with direct Anthropic or FIG/ZyntroAI endpoints
"""

import os
from typing import Optional
from dotenv import load_dotenv
import anthropic

# Load .env if present
load_dotenv()


def get_client(
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    timeout: float = 30.0,
) -> anthropic.Anthropic:
    """Initialize Claude client with env fallback"""
    key = api_key or os.getenv("CLAUDE_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
    if not key:
        raise ValueError("Missing API key. Set CLAUDE_API_KEY or ANTHROPIC_API_KEY.")
        
    return anthropic.Anthropic(
        api_key=key,
        base_url=base_url or os.getenv("CLAUDE_BASE_URL"),
        timeout=timeout,
    )


def test_smoke(
    prompt: str = "Reply with exactly: OK",
    model: str = "claude-3-5-sonnet-20241022",
    max_tokens: int = 100,
) -> str:
    """Basic connectivity & response test"""
    client = get_client()

    resp = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )

    text = "\n".join(blk.text for blk in resp.content if blk.type == "text")
    return text


if __name__ == "__main__":
    try:
        result = test_smoke()
        print(f"โ… Success โ€” response: {result}")
    except Exception as e:
        print(f"โ Failed โ€” {type(e).__name__}: {e}")
        raise SystemExit(1)