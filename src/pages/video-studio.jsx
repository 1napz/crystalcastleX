import { useState, useRef, useEffect } from "react";

const TABS = ["Studio", "Automation", "GitHub CI"];

const MODELS = ["Sora", "Runway Gen-3", "Kling 2.0", "Pika 2.1", "Luma Dream"];

const SCRIPT_TEMPLATES = {
  ffmpeg: `#!/bin/bash
# Auto Video Compiler — Zyntro-Media-AI
# Usage: ./compile.sh ./clips/ output.mp4

INPUT_DIR="\${1:-.}"
OUTPUT="\${2:-output.mp4}"
FPS="\${3:-30}"

echo "🎬 Scanning for clips in $INPUT_DIR..."

# Build concat list
find "$INPUT_DIR" -name "*.mp4" -o -name "*.mov" | sort > /tmp/clip_list.txt
while IFS= read -r f; do echo "file '$f'"; done < /tmp/clip_list.txt > /tmp/ffmpeg_input.txt

# Merge with crossfade
ffmpeg -f concat -safe 0 -i /tmp/ffmpeg_input.txt \\
  -vf "fps=$FPS,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \\
  -c:v libx264 -crf 18 -preset slow \\
  -c:a aac -b:a 192k \\
  "$OUTPUT"

echo "✅ Done → $OUTPUT"`,

  python: `#!/usr/bin/env python3
"""
Batch Video Generator — Zyntro-Media-AI
Calls Runway/Sora-compatible endpoints and stitches results.
"""
import asyncio, httpx, os, json
from pathlib import Path

API_KEY = os.environ["VIDEO_API_KEY"]
ENDPOINT = "https://api.runwayml.com/v1/image_to_video"

async def generate_clip(client, prompt: str, index: int) -> Path:
    payload = {
        "model": "gen3a_turbo",
        "promptText": prompt,
        "duration": 5,
        "ratio": "1280:768",
    }
    resp = await client.post(ENDPOINT, json=payload,
                             headers={"Authorization": f"Bearer {API_KEY}"})
    resp.raise_for_status()
    task_id = resp.json()["id"]
    print(f"  [{index}] Task queued: {task_id}")

    # Poll until complete
    while True:
        await asyncio.sleep(8)
        poll = await client.get(f"{ENDPOINT}/{task_id}",
                                headers={"Authorization": f"Bearer {API_KEY}"})
        data = poll.json()
        if data["status"] == "SUCCEEDED":
            url = data["output"][0]
            out = Path(f"clip_{index:03d}.mp4")
            async with client.stream("GET", url) as r:
                out.write_bytes(await r.aread())
            print(f"  [{index}] Saved → {out}")
            return out
        if data["status"] == "FAILED":
            raise RuntimeError(f"Task {task_id} failed: {data}")

async def main():
    prompts = json.loads(Path("prompts.json").read_text())
    async with httpx.AsyncClient(timeout=120) as client:
        tasks = [generate_clip(client, p, i) for i, p in enumerate(prompts)]
        clips = await asyncio.gather(*tasks)
    print(f"\\n🎬 Generated {len(clips)} clips. Run compile.sh to merge.")

if __name__ == "__main__":
    asyncio.run(main())`,

  github_workflow: `# .github/workflows/video-pipeline.yml
# Zyntro-Media-AI — Auto Video CI/CD Pipeline
name: Video Generation Pipeline

on:
  push:
    paths: ["prompts.json", "scenes/**"]
  workflow_dispatch:
    inputs:
      quality:
        description: "Render quality (draft|full)"
        default: "draft"

env:
  VIDEO_API_KEY: \${{ secrets.VIDEO_API_KEY }}
  CLOUDFLARE_R2_TOKEN: \${{ secrets.CF_R2_TOKEN }}

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with: { python-version: "3.12" }

      - name: Install deps
        run: pip install httpx asyncio pathlib

      - name: Generate video clips
        run: python scripts/generate.py

      - name: Install FFmpeg
        run: sudo apt-get install -y ffmpeg

      - name: Compile final video
        run: bash scripts/compile.sh ./clips/ final_\${{ github.sha }}.mp4

      - name: Upload to R2
        run: |
          aws s3 cp final_\${{ github.sha }}.mp4 \\
            s3://zyntro-media/releases/ \\
            --endpoint-url https://\${{ secrets.CF_ACCOUNT }}.r2.cloudflarestorage.com

      - name: Notify Slack
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          payload: '{"text":"✅ New video ready: final_\${{ github.sha }}.mp4"}'
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}`
};

const PROMPTS_JSON = `[
  "Cinematic aerial shot of a neon city at night, rain reflections",
  "Close-up of a crystal castle interior, light refractions",
  "Abstract data streams flowing into a glowing orb",
  "Hero silhouette against a sunrise over mountains"
]`;

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      <button onClick={copy} style={{
        position: "absolute", top: 10, right: 10,
        background: copied ? "#22c55e" : "#2a2a3a",
        border: "1px solid #3a3a5a", color: "#fff",
        borderRadius: 6, padding: "4px 12px", fontSize: 12,
        cursor: "pointer", transition: "background .3s", zIndex: 2
      }}>
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre style={{
        background: "#0d0d1a",
        border: "1px solid #1e1e3a",
        borderRadius: 10,
        padding: "18px 16px",
        overflowX: "auto",
        fontSize: 12,
        lineHeight: 1.7,
        color: "#a0d8ff",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: "pre",
        margin: 0,
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StudioTab() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [duration, setDuration] = useState(5);
  const [ratio, setRatio] = useState("16:9");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setAiResponse("");
    setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a professional video director and AI video generation expert. 
When given a prompt, respond ONLY with a JSON object (no markdown):
{
  "enhanced_prompt": "...",
  "negative_prompt": "...",
  "cinematography": "...",
  "mood": "...",
  "color_palette": ["#hex1","#hex2","#hex3"],
  "estimated_quality_score": 0-100,
  "director_notes": "..."
}`,
          messages: [{ role: "user", content: `Model: ${model}\nDuration: ${duration}s\nAspect: ${ratio}\nPrompt: ${prompt}` }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      try {
        const parsed = JSON.parse(text);
        setResult(parsed);
      } catch {
        setAiResponse(text);
      }
    } catch (e) {
      setError("API error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <p style={{ color: "#7070a0", marginBottom: 20, fontSize: 13 }}>
        Craft prompts, get AI-enhanced directions, and generate scripts for any video model.
      </p>

      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Model</label>
          <select value={model} onChange={e => setModel(e.target.value)} style={selectStyle}>
            {MODELS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Duration (sec)</label>
          <select value={duration} onChange={e => setDuration(+e.target.value)} style={selectStyle}>
            {[3, 5, 10, 15, 30].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Aspect Ratio</label>
          <select value={ratio} onChange={e => setRatio(e.target.value)} style={selectStyle}>
            {["16:9", "9:16", "1:1", "4:3", "21:9"].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <label style={labelStyle}>Video Prompt</label>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe your scene... e.g. Cinematic shot of a crystal castle at dawn, golden light refractions through glass towers"
        rows={4}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "#0a0a18", border: "1px solid #2a2a4a",
          borderRadius: 10, color: "#e0e0ff", padding: "12px 14px",
          fontSize: 14, fontFamily: "inherit", resize: "vertical",
          outline: "none", lineHeight: 1.6,
        }}
        onFocus={e => e.target.style.borderColor = "#6060ff"}
        onBlur={e => e.target.style.borderColor = "#2a2a4a"}
      />

      <button onClick={generate} disabled={loading || !prompt.trim()} style={{
        marginTop: 12,
        background: loading ? "#2a2a5a" : "linear-gradient(135deg, #5050ff, #9020e0)",
        border: "none", color: "#fff", borderRadius: 10,
        padding: "12px 32px", fontSize: 14, fontWeight: 700,
        cursor: loading ? "default" : "pointer",
        transition: "opacity .2s",
        opacity: (!prompt.trim() && !loading) ? 0.5 : 1,
      }}>
        {loading ? "⟳ Generating..." : "✦ Enhance & Direct"}
      </button>

      {error && <p style={{ color: "#ff6060", marginTop: 12, fontSize: 13 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24, background: "#0a0a1e", border: "1px solid #2a2a5a", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: "#c0a0ff", fontSize: 15 }}>✦ Director's Cut</h3>
            <div style={{
              background: `hsl(${result.estimated_quality_score * 1.2},80%,45%)`,
              borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, color: "#fff"
            }}>
              Quality: {result.estimated_quality_score}/100
            </div>
          </div>

          <Grid2>
            <InfoBox label="Enhanced Prompt" value={result.enhanced_prompt} accent="#6060ff" />
            <InfoBox label="Negative Prompt" value={result.negative_prompt} accent="#ff4060" />
            <InfoBox label="Cinematography" value={result.cinematography} accent="#40c0ff" />
            <InfoBox label="Mood" value={result.mood} accent="#c040ff" />
          </Grid2>

          <div style={{ marginTop: 14 }}>
            <label style={{ ...labelStyle, marginBottom: 8 }}>Color Palette</label>
            <div style={{ display: "flex", gap: 8 }}>
              {result.color_palette?.map((c, i) => (
                <div key={i} style={{
                  width: 48, height: 48, borderRadius: 8,
                  background: c, border: "1px solid #ffffff20",
                  display: "flex", alignItems: "flex-end",
                  justifyContent: "center", paddingBottom: 4
                }}>
                  <span style={{ fontSize: 9, color: "#ffffffbb" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {result.director_notes && (
            <div style={{ marginTop: 14, background: "#13132a", borderRadius: 8, padding: 12 }}>
              <span style={{ color: "#7070a0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Director Notes</span>
              <p style={{ margin: "6px 0 0", color: "#d0d0ff", fontSize: 13, lineHeight: 1.6 }}>{result.director_notes}</p>
            </div>
          )}
        </div>
      )}

      {aiResponse && (
        <div style={{ marginTop: 16, background: "#0a0a18", border: "1px solid #2a2a4a", borderRadius: 10, padding: 14 }}>
          <p style={{ color: "#d0d0ff", fontSize: 13, margin: 0, whiteSpace: "pre-wrap" }}>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

function AutomationTab() {
  const [active, setActive] = useState("ffmpeg");

  const scripts = [
    { id: "ffmpeg", label: "🎬 FFmpeg Compiler", lang: "bash", code: SCRIPT_TEMPLATES.ffmpeg, desc: "Merge video clips with crossfade and proper scaling" },
    { id: "python", label: "🐍 Batch Generator", lang: "python", code: SCRIPT_TEMPLATES.python, desc: "Async multi-clip generation via Runway API" },
    { id: "prompts", label: "📋 prompts.json", lang: "json", code: PROMPTS_JSON, desc: "Input prompts for the batch generator" },
  ];

  return (
    <div>
      <p style={{ color: "#7070a0", marginBottom: 20, fontSize: 13 }}>
        Production-ready scripts for automated video pipelines. Drop into your project and run.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {scripts.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            background: active === s.id ? "linear-gradient(135deg,#5050ff,#9020e0)" : "#13132a",
            border: `1px solid ${active === s.id ? "#5050ff" : "#2a2a4a"}`,
            color: "#fff", borderRadius: 8, padding: "8px 16px",
            fontSize: 13, cursor: "pointer", fontWeight: active === s.id ? 700 : 400
          }}>
            {s.label}
          </button>
        ))}
      </div>
      {scripts.filter(s => s.id === active).map(s => (
        <div key={s.id}>
          <p style={{ color: "#9090c0", fontSize: 12, marginBottom: 10 }}>{s.desc}</p>
          <CodeBlock code={s.code} lang={s.lang} />
        </div>
      ))}

      <div style={{ background: "#0a0a1e", border: "1px solid #2a2a4a", borderRadius: 12, padding: 18, marginTop: 10 }}>
        <h4 style={{ margin: "0 0 10px", color: "#a0a0ff", fontSize: 13 }}>📦 Setup Instructions</h4>
        <ol style={{ margin: 0, padding: "0 0 0 18px", color: "#8080b0", fontSize: 12, lineHeight: 2 }}>
          <li>Install deps: <code style={{ color: "#a0d8ff" }}>pip install httpx</code> · <code style={{ color: "#a0d8ff" }}>sudo apt install ffmpeg</code></li>
          <li>Set env var: <code style={{ color: "#a0d8ff" }}>export VIDEO_API_KEY=your_key</code></li>
          <li>Edit <code style={{ color: "#a0d8ff" }}>prompts.json</code> with your scene descriptions</li>
          <li>Run: <code style={{ color: "#a0d8ff" }}>python generate.py && bash compile.sh</code></li>
        </ol>
      </div>
    </div>
  );
}

function GithubTab() {
  return (
    <div>
      <p style={{ color: "#7070a0", marginBottom: 20, fontSize: 13 }}>
        Drop this workflow into <code style={{ color: "#a0d8ff" }}>.github/workflows/</code> for full CI/CD video automation on every push.
      </p>
      <CodeBlock code={SCRIPT_TEMPLATES.github_workflow} lang="yaml" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        {[
          { icon: "🔑", label: "VIDEO_API_KEY", desc: "Runway/Sora API key" },
          { icon: "☁️", label: "CF_R2_TOKEN", desc: "Cloudflare R2 storage token" },
          { icon: "📣", label: "SLACK_WEBHOOK", desc: "Slack notification webhook" },
          { icon: "🏷️", label: "CF_ACCOUNT", desc: "Cloudflare account ID" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0a0a18", border: "1px solid #1e1e3a", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <code style={{ color: "#a0d8ff", fontSize: 12 }}>{s.label}</code>
            <p style={{ color: "#6060a0", fontSize: 11, margin: "4px 0 0" }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <h4 style={{ margin: "0 0 8px", color: "#40c040", fontSize: 13 }}>✅ Pipeline Flow</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {["Push prompts.json", "→", "Generate clips (Python)", "→", "Compile (FFmpeg)", "→", "Upload to R2", "→", "Notify Slack"].map((s, i) => (
            <span key={i} style={{ color: s === "→" ? "#3a5a3a" : "#80c080", fontSize: 12, fontWeight: s === "→" ? 400 : 600 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────
const labelStyle = { display: "block", color: "#6060a0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 };
const selectStyle = { width: "100%", background: "#0a0a18", border: "1px solid #2a2a4a", borderRadius: 8, color: "#e0e0ff", padding: "8px 10px", fontSize: 13, outline: "none", cursor: "pointer" };

function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

function InfoBox({ label, value, accent }) {
  return (
    <div style={{ background: "#0d0d20", border: `1px solid ${accent}30`, borderRadius: 8, padding: 12 }}>
      <span style={{ color: accent, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <p style={{ margin: "6px 0 0", color: "#d0d0ff", fontSize: 12, lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────
export default function VideoStudio() {
  const [tab, setTab] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#06060f",
      fontFamily: "'Syne', 'DM Sans', system-ui, sans-serif",
      color: "#e0e0ff",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0d0d2a 0%, #06060f 100%)",
        borderBottom: "1px solid #1a1a3a",
        padding: "28px 32px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200,
          background: "radial-gradient(circle, #5050ff20 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "pulse 3s ease-in-out infinite",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #5050ff, #9020e0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 0 20px #5050ff50"
          }}>🎬</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              Video Studio
              <span style={{ color: "#5050ff" }}>.</span>
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "#5050a0" }}>Zyntro-Media-AI · crystalcastle</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1a1a3a", padding: "0 32px" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            background: "none", border: "none",
            borderBottom: tab === i ? "2px solid #5050ff" : "2px solid transparent",
            color: tab === i ? "#a0a0ff" : "#4040608",
            padding: "14px 20px", fontSize: 13, fontWeight: tab === i ? 700 : 400,
            cursor: "pointer", transition: "all .2s",
            marginBottom: -1,
          }}>
            {["✦", "⚙", "⚡"][i]} {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 860 }
