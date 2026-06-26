import { useState, useRef } from "react";

const GMAIL_MCP_URL = "https://gmailmcp.googleapis.com/mcp/v1";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0f;
    min-height: 100vh;
    font-family: 'Syne', sans-serif;
  }

  .app {
    min-height: 100vh;
    background: #0a0a0f;
    color: #e8e4dc;
    padding: 32px 24px;
    max-width: 700px;
    margin: 0 auto;
    position: relative;
  }

  .grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,200,80,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,200,80,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .content { position: relative; z-index: 1; }

  .header { margin-bottom: 36px; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.1em;
    color: #ffc850; background: rgba(255,200,80,0.08);
    border: 1px solid rgba(255,200,80,0.2);
    padding: 4px 10px; border-radius: 4px;
    margin-bottom: 16px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #ffc850; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  h1 {
    font-size: 36px; font-weight: 800; line-height: 1.1;
    letter-spacing: -0.02em; color: #f0ebe0;
  }
  h1 span { color: #ffc850; }

  .subtitle {
    margin-top: 8px; font-size: 14px;
    color: rgba(232,228,220,0.45); font-weight: 400;
  }

  /* Stats bar */
  .stats-bar {
    display: flex; gap: 12px; margin-bottom: 24px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }
  .stat-item { display: flex; align-items: center; gap: 6px; }
  .stat-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .stat-label { color: rgba(232,228,220,0.4); }
  .stat-val { color: #e8e4dc; font-weight: 500; }

  .input-row {
    display: flex; gap: 10px; margin-bottom: 8px;
  }

  .input-wrap { flex: 1; position: relative; }
  .input-wrap input {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; color: #e8e4dc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .input-wrap input:focus {
    border-color: rgba(255,200,80,0.5);
    background: rgba(255,200,80,0.04);
  }
  .input-wrap input::placeholder { color: rgba(232,228,220,0.25); }

  .btn-add {
    padding: 12px 20px; border-radius: 8px;
    background: #ffc850; color: #0a0a0f;
    border: none; cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 13px;
    letter-spacing: 0.02em;
    transition: transform 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .btn-add:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-add:active { transform: translateY(0); }
  .btn-add:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* Bulk import */
  .bulk-hint {
    font-size: 11px; color: rgba(232,228,220,0.3);
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 20px; margin-top: 4px;
  }
  .bulk-hint span { color: rgba(255,200,80,0.6); cursor: pointer; }
  .bulk-hint span:hover { color: #ffc850; }

  .bulk-area {
    margin-bottom: 20px; animation: fadeIn 0.2s ease;
  }
  .bulk-area textarea {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,200,80,0.3);
    border-radius: 8px; color: #e8e4dc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; outline: none; resize: vertical;
    min-height: 72px;
    transition: border-color 0.2s;
  }
  .bulk-area textarea:focus { border-color: rgba(255,200,80,0.6); }
  .bulk-area textarea::placeholder { color: rgba(232,228,220,0.2); }
  .bulk-import-btn {
    margin-top: 6px; padding: 7px 14px;
    background: rgba(255,200,80,0.1); color: #ffc850;
    border: 1px solid rgba(255,200,80,0.25); border-radius: 6px;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
  }
  .bulk-import-btn:hover { background: rgba(255,200,80,0.2); }

  .section-label {
    font-size: 10px; letter-spacing: 0.15em;
    color: rgba(232,228,220,0.3);
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; margin-bottom: 12px;
  }

  .list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 28px; min-height: 40px; }

  .item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    transition: border-color 0.2s, background 0.2s;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
  .item:hover { border-color: rgba(255,200,80,0.2); background: rgba(255,200,80,0.02); }
  .item.error-item { border-color: rgba(248,113,113,0.2); }

  .item-left { display: flex; align-items: center; gap: 12px; }
  .item-icon {
    width: 32px; height: 32px; border-radius: 6px;
    background: rgba(255,200,80,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }
  .item-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; color: #e8e4dc;
  }
  .item-sub {
    font-size: 11px; color: rgba(232,228,220,0.35);
    margin-top: 2px;
  }

  .item-status {
    font-size: 10px; font-family: 'JetBrains Mono', monospace;
    padding: 3px 8px; border-radius: 4px;
    letter-spacing: 0.08em;
  }
  .status-pending { color: rgba(232,228,220,0.4); background: rgba(255,255,255,0.05); }
  .status-creating { color: #ffc850; background: rgba(255,200,80,0.1); }
  .status-done { color: #6ee7b7; background: rgba(110,231,183,0.1); }
  .status-error { color: #f87171; background: rgba(248,113,113,0.1); }

  .btn-remove {
    background: none; border: none; cursor: pointer;
    color: rgba(232,228,220,0.2); font-size: 16px;
    padding: 4px; line-height: 1;
    transition: color 0.2s; margin-left: 8px;
  }
  .btn-remove:hover { color: #f87171; }

  .empty {
    text-align: center; padding: 28px;
    color: rgba(232,228,220,0.2);
    font-size: 13px; font-family: 'JetBrains Mono', monospace;
    border: 1px dashed rgba(255,255,255,0.08); border-radius: 8px;
  }

  .actions { display: flex; gap: 10px; align-items: center; }

  .btn-run {
    flex: 1; padding: 14px;
    background: linear-gradient(135deg, #ffc850, #ff9500);
    color: #0a0a0f; border: none; border-radius: 8px;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 14px; letter-spacing: 0.03em;
    cursor: pointer; transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-run:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .btn-run:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-retry {
    padding: 14px 18px; border-radius: 8px;
    background: rgba(255,200,80,0.08);
    border: 1px solid rgba(255,200,80,0.2);
    color: #ffc850; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 600;
    font-size: 13px; transition: background 0.2s;
    white-space: nowrap;
  }
  .btn-retry:hover { background: rgba(255,200,80,0.15); }

  .btn-clear {
    padding: 14px 18px; border-radius: 8px;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    color: #f87171; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 600;
    font-size: 13px; transition: background 0.2s;
  }
  .btn-clear:hover { background: rgba(248,113,113,0.15); }

  .log-box {
    margin-top: 20px; padding: 16px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px; max-height: 200px; overflow-y: auto;
  }
  .log-line {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; line-height: 1.8;
    color: rgba(232,228,220,0.5);
  }
  .log-line.ok { color: #6ee7b7; }
  .log-line.err { color: #f87171; }
  .log-line.info { color: #ffc850; }

  .sort-note {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: rgba(232,228,220,0.3);
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 10px;
  }

  .progress-bar {
    height: 2px; border-radius: 2px;
    background: rgba(255,255,255,0.06);
    margin-bottom: 20px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, #ffc850, #ff9500);
    transition: width 0.4s ease;
  }

  .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function toFolderName(name) {
  return name.trim().replace(/\s+/g, " ");
}

// FIX: iterate ALL content blocks, join text fields — more reliable than .find()
function extractTextFromContent(content) {
  if (!Array.isArray(content)) return "";
  return content
    .filter(block => block.type === "text")
    .map(block => block.text || "")
    .join("\n");
}

export default function EmailOrganizer() {
  const [input, setInput] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [items, setItems] = useState([]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  const addLog = (msg, type = "info") => {
    setLogs(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]);
    setTimeout(() => logRef.current?.scrollTo(0, 99999), 50);
  };

  const addItem = (name) => {
    const val = name.trim();
    if (!val) return false;
    setItems(prev => {
      if (prev.find(i => i.name.toLowerCase() === val.toLowerCase())) return prev;
      return [...prev, { id: Date.now() + Math.random(), name: val, status: "pending" }]
        .sort((a, b) => a.name.localeCompare(b.name));
    });
    return true;
  };

  const handleAdd = () => {
    if (addItem(input)) setInput("");
  };

  const handleBulkImport = () => {
    const names = bulkText
      .split(/[,\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
    let added = 0;
    names.forEach(n => { if (addItem(n)) added++; });
    setBulkText("");
    setBulkOpen(false);
    addLog(`📥 นำเข้า ${added}/${names.length} label สำเร็จ`, "info");
  };

  const handleRemove = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const setStatus = (id, status) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));

  const stats = {
    total: items.length,
    done: items.filter(i => i.status === "done").length,
    error: items.filter(i => i.status === "error").length,
    pending: items.filter(i => i.status === "pending").length,
  };

  const progress = stats.total > 0
    ? Math.round(((stats.done + stats.error) / stats.total) * 100)
    : 0;

  const processItem = async (item) => {
    setStatus(item.id, "creating");
    addLog(`📁 กำลังสร้าง: "${toFolderName(item.name)}"`, "info");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // FIX: correct model string
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          mcp_servers: [{ type: "url", url: GMAIL_MCP_URL, name: "gmail-mcp" }],
          messages: [{
            role: "user",
            content: `Create a Gmail label exactly named "${toFolderName(item.name)}".
If it already exists, just confirm it exists.
Reply ONLY with JSON: {"success": true, "label_id": "...", "message": "..."}
or {"success": false, "message": "error reason"}`
          }],
        }),
      });

      const data = await res.json();

      // FIX: iterate ALL text blocks, not just .find()
      const raw = extractTextFromContent(data.content);

      let parsed = null;
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch { /* ignore */ }

      if (parsed?.success) {
        setStatus(item.id, "done");
        addLog(`✅ "${item.name}" — สร้างสำเร็จ`, "ok");
        return true;
      } else {
        setStatus(item.id, "error");
        addLog(`❌ "${item.name}" — ${parsed?.message || raw.slice(0, 100) || "ไม่ทราบสาเหตุ"}`, "err");
        return false;
      }
    } catch (e) {
      setStatus(item.id, "error");
      addLog(`❌ "${item.name}" — ${e.message}`, "err");
      return false;
    }
  };

  const handleRun = async (onlyFailed = false) => {
    const targets = onlyFailed
      ? items.filter(i => i.status === "error")
      : items;

    if (!targets.length) return;
    setRunning(true);
    if (!onlyFailed) setLogs([]);

    addLog(`🚀 เริ่มสร้าง ${targets.length} label(s)${onlyFailed ? " (retry)": ""}...`, "info");

    for (const item of targets) {
      await processItem(item);
      await new Promise(r => setTimeout(r, 350)); // rate-limit buffer
    }

    const newStats = {
      done: items.filter(i => i.status === "done").length,
      error: items.filter(i => i.status === "error").length,
    };
    addLog(`─── เสร็จสิ้น ✅ ${newStats.done} สำเร็จ  ❌ ${newStats.error} ล้มเหลว ───`, "info");
    setRunning(false);
  };

  const handleClear = () => { setItems([]); setLogs([]); };

  const statusLabel = { pending: "รอ", creating: "กำลังสร้าง...", done: "สำเร็จ", error: "ล้มเหลว" };
  const statusClass = { pending: "status-pending", creating: "status-creating", done: "status-done", error: "status-error" };
  const hasErrors = items.some(i => i.status === "error");

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="grid-bg" />
        <div className="content">
          <div className="header">
            <div className="badge"><span className="dot" />Gmail Organizer</div>
            <h1>จัดระเบียบ<br /><span>โฟลเดอร์ Email</span></h1>
            <p className="subtitle">กรอกชื่อ → เรียงอัตโนมัติ → สร้าง Label ใน Gmail ทีเดียว</p>
          </div>

          {/* Stats */}
          {items.length > 0 && (
            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-dot" style={{ background: "rgba(232,228,220,0.3)" }} />
                <span className="stat-label">ทั้งหมด</span>
                <span className="stat-val">{stats.total}</span>
              </div>
              <div className="stat-item">
                <div className="stat-dot" style={{ background: "#6ee7b7" }} />
                <span className="stat-label">สำเร็จ</span>
                <span className="stat-val">{stats.done}</span>
              </div>
              <div className="stat-item">
                <div className="stat-dot" style={{ background: "#f87171" }} />
                <span className="stat-label">ล้มเหลว</span>
                <span className="stat-val">{stats.error}</span>
              </div>
              <div className="stat-item">
                <div className="stat-dot" style={{ background: "rgba(255,200,80,0.5)" }} />
                <span className="stat-label">รอ</span>
                <span className="stat-val">{stats.pending}</span>
              </div>
            </div>
          )}

          {/* Progress bar (show only when running) */}
          {running && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Input */}
          <div className="input-row">
            <div className="input-wrap">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="เช่น  Work, Finance, Newsletter, GitHub..."
                disabled={running}
              />
            </div>
            <button className="btn-add" onClick={handleAdd} disabled={running || !input.trim()}>
              + เพิ่ม
            </button>
          </div>

          <div className="bulk-hint">
            หรือ&nbsp;
            <span onClick={() => !running && setBulkOpen(o => !o)}>
              {bulkOpen ? "ปิด" : "นำเข้าหลายชื่อพร้อมกัน"}
            </span>
            &nbsp;(คั่นด้วย , หรือขึ้นบรรทัดใหม่)
          </div>

          {bulkOpen && (
            <div className="bulk-area">
              <textarea
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder={"Work\nFinance\nNewsletter\nGitHub, Receipts, Travel"}
                disabled={running}
              />
              <button className="bulk-import-btn" onClick={handleBulkImport} disabled={!bulkText.trim()}>
                📥 นำเข้าทั้งหมด
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="sort-note">
              <span>⇅</span> เรียงตามตัวอักษร A → Z ({items.length} รายการ)
            </div>
          )}

          {/* List */}
          <div className="list">
            {items.length === 0 ? (
              <div className="empty">ยังไม่มีโฟลเดอร์ — กรอกชื่อแล้วกด Enter</div>
            ) : (
              items.map(item => (
                <div
                  className={`item${item.status === "error" ? " error-item" : ""}`}
                  key={item.id}
                >
                  <div className="item-left">
                    <div className="item-icon">{getInitial(item.name)}</div>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-sub">Gmail Label · Inbox/{item.name}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span className={`item-status ${statusClass[item.status]}`}>
                      {item.status === "creating" ? <span className="spinner">⟳</span> : null}
                      {" "}{statusLabel[item.status]}
                    </span>
                    {!running && (
                      <button className="btn-remove" onClick={() => handleRemove(item.id)}>×</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="actions">
            <button
              className="btn-run"
              onClick={() => handleRun(false)}
              disabled={running || items.length === 0}
            >
              {running
                ? <><span className="spinner">⟳</span> กำลังสร้าง... ({progress}%)</>
                : `🚀 สร้าง ${items.length} Label ใน Gmail`}
            </button>
            {!running && hasErrors && (
              <button className="btn-retry" onClick={() => handleRun(true)}>
                ↺ Retry {stats.error}
              </button>
            )}
            {!running && items.length > 0 && (
              <button className="btn-clear" onClick={handleClear}>ล้าง</button>
            )}
          </div>

          {/* Log */}
          {logs.length > 0 && (
            <div className="log-box" ref={logRef}>
              {logs.map((l, i) => (
                <div key={i} className={`log-line ${l.type}`}>
                  [{l.ts}] {l.msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}