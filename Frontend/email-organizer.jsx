import { useState, useRef, useCallback } from "react";

const GMAIL_MCP_URL = "https://gmailmcp.googleapis.com/mcp/v1";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #080810; min-height: 100vh; font-family: 'Syne', sans-serif; }

  /* ── Layout ── */
  .app {
    min-height: 100vh;
    background: #080810;
    color: #e8e4dc;
    padding: 40px 24px 60px;
    max-width: 680px;
    margin: 0 auto;
    position: relative;
  }

  /* Subtle grid */
  .grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,200,80,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,200,80,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .content { position: relative; z-index: 1; }

  /* ── Header ── */
  .header { margin-bottom: 40px; }

  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    color: #ffc850; background: rgba(255,200,80,0.08);
    border: 1px solid rgba(255,200,80,0.18);
    padding: 5px 12px; border-radius: 100px; margin-bottom: 18px;
  }
  .dot {
    width: 5px; height: 5px; border-radius: 50%; background: #ffc850;
    animation: pulse 2.4s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.25;transform:scale(0.8)} }

  h1 {
    font-size: clamp(30px, 6vw, 42px); font-weight: 800;
    line-height: 1.08; letter-spacing: -0.03em; color: #f0ebe0;
    margin-bottom: 10px;
  }
  h1 span { color: #ffc850; }

  .subtitle {
    font-size: 13px; color: rgba(232,228,220,0.4);
    font-weight: 400; max-width: 420px; line-height: 1.6;
  }

  /* ── Stats bar ── */
  .stats-bar {
    display: flex; gap: 16px; margin-bottom: 28px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
  }
  .stat {
    display: flex; flex-direction: column; gap: 2px;
    font-family: 'JetBrains Mono', monospace;
  }
  .stat-val { font-size: 18px; font-weight: 500; color: #f0ebe0; }
  .stat-val.ok { color: #6ee7b7; }
  .stat-val.err { color: #f87171; }
  .stat-label { font-size: 9px; letter-spacing: 0.1em; color: rgba(232,228,220,0.3); text-transform: uppercase; }
  .stat-sep { width: 1px; background: rgba(255,255,255,0.07); align-self: stretch; margin: 0 4px; }

  /* ── Input area ── */
  .input-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .input-row { display: flex; gap: 8px; margin-bottom: 10px; }
  .input-wrap { flex: 1; }
  .input-wrap input {
    width: 100%; padding: 11px 14px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #e8e4dc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; outline: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .input-wrap input:focus {
    border-color: rgba(255,200,80,0.45);
    background: rgba(255,200,80,0.03);
  }
  .input-wrap input::placeholder { color: rgba(232,228,220,0.2); }
  .input-wrap input:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-add {
    padding: 11px 18px; border-radius: 8px;
    background: rgba(255,200,80,0.12);
    border: 1px solid rgba(255,200,80,0.25);
    color: #ffc850; cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 13px;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .btn-add:hover:not(:disabled) { background: rgba(255,200,80,0.2); transform: translateY(-1px); }
  .btn-add:active:not(:disabled) { transform: translateY(0); }
  .btn-add:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Bulk import textarea */
  .bulk-area textarea {
    width: 100%; padding: 10px 14px; resize: vertical; min-height: 72px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #e8e4dc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; outline: none; line-height: 1.6;
    transition: border-color 0.15s;
  }
  .bulk-area textarea:focus { border-color: rgba(255,200,80,0.35); }
  .bulk-area textarea::placeholder { color: rgba(232,228,220,0.18); }
  .bulk-hint {
    font-size: 10px; color: rgba(232,228,220,0.25);
    font-family: 'JetBrains Mono', monospace; margin-top: 6px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .btn-bulk-add {
    padding: 5px 12px; border-radius: 6px; cursor: pointer;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(232,228,220,0.5);
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    transition: background 0.15s, color 0.15s;
  }
  .btn-bulk-add:hover { background: rgba(255,255,255,0.1); color: #e8e4dc; }

  /* ── Section header ── */
  .section-hd {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .section-label {
    font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(232,228,220,0.28); font-family: 'JetBrains Mono', monospace;
  }
  .sort-note {
    font-size: 9px; color: rgba(232,228,220,0.22);
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
  }

  /* ── Item list ── */
  .list { display: flex; flex-direction: column; gap: 5px; margin-bottom: 24px; }

  .item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 9px;
    transition: border-color 0.15s, background 0.15s;
    animation: fadeSlide 0.18s ease;
  }
  @keyframes fadeSlide {
    from { opacity:0; transform:translateY(-5px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .item:hover { border-color: rgba(255,200,80,0.15); background: rgba(255,200,80,0.015); }
  .item.is-done { border-color: rgba(110,231,183,0.15); }
  .item.is-error { border-color: rgba(248,113,113,0.15); }

  .item-left { display: flex; align-items: center; gap: 11px; }
  .item-icon {
    width: 30px; height: 30px; border-radius: 7px;
    background: rgba(255,200,80,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #ffc850;
    flex-shrink: 0; font-family: 'Syne', sans-serif;
  }
  .item.is-done .item-icon { background: rgba(110,231,183,0.1); color: #6ee7b7; }
  .item.is-error .item-icon { background: rgba(248,113,113,0.1); color: #f87171; }

  .item-name { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #e8e4dc; }
  .item-sub { font-size: 10px; color: rgba(232,228,220,0.28); margin-top: 2px; letter-spacing: 0.02em; }

  .item-right { display: flex; align-items: center; gap: 6px; }

  .item-status {
    font-size: 9px; font-family: 'JetBrains Mono', monospace;
    padding: 3px 9px; border-radius: 100px;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .s-pending  { color: rgba(232,228,220,0.3);  background: rgba(255,255,255,0.04); }
  .s-creating { color: #ffc850; background: rgba(255,200,80,0.1); }
  .s-done     { color: #6ee7b7; background: rgba(110,231,183,0.1); }
  .s-error    { color: #f87171; background: rgba(248,113,113,0.1); }

  .btn-remove {
    background: none; border: none; cursor: pointer;
    color: rgba(232,228,220,0.18); font-size: 15px;
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    border-radius: 4px; transition: color 0.15s, background 0.15s;
  }
  .btn-remove:hover { color: #f87171; background: rgba(248,113,113,0.08); }

  .empty {
    text-align: center; padding: 32px 20px;
    color: rgba(232,228,220,0.18);
    font-size: 12px; font-family: 'JetBrains Mono', monospace;
    border: 1px dashed rgba(255,255,255,0.07); border-radius: 10px;
    line-height: 1.7;
  }
  .empty strong { color: rgba(232,228,220,0.35); display: block; margin-bottom: 4px; font-size: 13px; }

  /* ── Progress bar ── */
  .progress-wrap {
    height: 3px; background: rgba(255,255,255,0.06);
    border-radius: 100px; margin-bottom: 20px; overflow: hidden;
  }
  .progress-bar {
    height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, #ffc850, #ff9500);
    transition: width 0.3s ease;
  }

  /* ── Actions ── */
  .actions { display: flex; gap: 8px; }

  .btn-run {
    flex: 1; padding: 14px 20px;
    background: linear-gradient(135deg, #ffc850 0%, #ff9500 100%);
    color: #080810; border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 14px; letter-spacing: 0.02em;
    cursor: pointer; transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 20px rgba(255,200,80,0.2);
  }
  .btn-run:hover:not(:disabled) {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(255,200,80,0.3);
  }
  .btn-run:active:not(:disabled) { transform: translateY(0); }
  .btn-run:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-secondary {
    padding: 14px 16px; border-radius: 10px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: rgba(232,228,220,0.5);
    transition: background 0.15s, color 0.15s;
  }
  .btn-secondary:hover:not(:disabled) {
    background: rgba(255,255,255,0.08);
    color: rgba(232,228,220,0.8);
  }
  .btn-secondary:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-danger {
    padding: 14px 16px; border-radius: 10px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px;
    border: 1px solid rgba(248,113,113,0.2);
    background: rgba(248,113,113,0.06);
    color: rgba(248,113,113,0.7);
    transition: background 0.15s, color 0.15s;
  }
  .btn-danger:hover:not(:disabled) {
    background: rgba(248,113,113,0.12);
    color: #f87171;
  }
  .btn-danger:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── Log ── */
  .log-box {
    margin-top: 18px; padding: 14px 16px;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px; max-height: 200px; overflow-y: auto;
    scroll-behavior: smooth;
  }
  .log-box::-webkit-scrollbar { width: 4px; }
  .log-box::-webkit-scrollbar-track { background: transparent; }
  .log-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .log-line {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; line-height: 1.9;
    color: rgba(232,228,220,0.4);
  }
  .log-line.ok   { color: #6ee7b7; }
  .log-line.err  { color: #f87171; }
  .log-line.info { color: rgba(255,200,80,0.8); }

  /* Spinner */
  .spin { display: inline-block; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .divider {
    height: 1px; background: rgba(255,255,255,0.06);
    margin: 24px 0;
  }
`;

// ── helpers ──────────────────────────────────────────────────────────
const initial = (name) => name.trim().charAt(0).toUpperCase() || "?";
const toLabel  = (name) => name.trim().replace(/\s+/g, " ");

const STATUS_LABEL = { pending: "pendente", creating: "criando…", done: "OK", error: "falhou" };
const STATUS_CLASS  = { pending: "s-pending", creating: "s-creating", done: "s-done", error: "s-error" };
const ITEM_CLASS    = { pending: "", creating: "", done: "is-done", error: "is-error" };

// ── component ─────────────────────────────────────────────────────────
export default function EmailOrganizer() {
  const [input,   setInput]   = useState("");
  const [bulkVal, setBulkVal] = useState("");
  const [items,   setItems]   = useState([]);
  const [running, setRunning] = useState(false);
  const [logs,    setLogs]    = useState([]);
  const [progress, setProgress] = useState(0);
  const logRef = useRef(null);

  const addLog = useCallback((msg, type = "info") => {
    setLogs(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 50);
  }, []);

  const sortedAdd = (prev, newItem) =>
    [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name));

  const handleAdd = () => {
    const val = input.trim();
    if (!val) return;
    if (items.find(i => i.name.toLowerCase() === val.toLowerCase())) {
      setInput("");
      return;
    }
    setItems(prev => sortedAdd(prev, { id: Date.now(), name: val, status: "pending" }));
    setInput("");
  };

  const handleBulkAdd = () => {
    const names = bulkVal
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (!names.length) return;
    setItems(prev => {
      let next = [...prev];
      for (const name of names) {
        if (!next.find(i => i.name.toLowerCase() === name.toLowerCase())) {
          next = sortedAdd(next, { id: Date.now() + Math.random(), name, status: "pending" });
        }
      }
      return next;
    });
    setBulkVal("");
  };

  const handleRemove = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const setStatus = (id, status) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));

  const handleRun = async () => {
    if (!items.length) return;
    setRunning(true);
    setLogs([]);
    setProgress(0);
    const total = items.length;
    addLog(`🚀 เริ่มสร้าง ${total} label(s)…`, "info");

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      setStatus(item.id, "creating");
      addLog(`📁 "${toLabel(item.name)}"`, "info");

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            mcp_servers: [{ type: "url", url: GMAIL_MCP_URL, name: "gmail-mcp" }],
            messages: [{
              role: "user",
              content: `Create a Gmail label exactly named "${toLabel(item.name)}".
If it already exists, confirm it exists and return its id.
Reply ONLY with valid JSON — no markdown, no backticks:
{"success":true,"label_id":"...","message":"..."}
or {"success":false,"message":"error reason"}`
            }],
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Extract text from MCP-aware response
        const textBlocks = (data.content || [])
          .filter(b => b.type === "text")
          .map(b => b.text || "")
          .join("");

        let parsed = null;
        try {
          const clean  = textBlocks.replace(/```[a-z]*|```/gi, "").trim();
          const match  = clean.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
        } catch { /* ignore */ }

        if (parsed?.success) {
          setStatus(item.id, "done");
          addLog(`✅ "${item.name}" — สำเร็จ${parsed.label_id ? ` (${parsed.label_id})` : ""}`, "ok");
        } else {
          setStatus(item.id, "error");
          addLog(`❌ "${item.name}" — ${parsed?.message || textBlocks.slice(0, 100)}`, "err");
        }
      } catch (e) {
        setStatus(item.id, "error");
        addLog(`❌ "${item.name}" — ${e.message}`, "err");
      }

      setProgress(Math.round(((idx + 1) / total) * 100));
      await new Promise(r => setTimeout(r, 350));
    }

    addLog("─── เสร็จสิ้น ───", "info");
    setRunning(false);
  };

  const handleClear = () => { setItems([]); setLogs([]); setProgress(0); };
  const handleRetry = () => {
    setItems(prev => prev.map(i => i.status === "error" ? { ...i, status: "pending" } : i));
    setLogs([]);
    setProgress(0);
  };

  // stats
  const doneCount  = items.filter(i => i.status === "done").length;
  const errCount   = items.filter(i => i.status === "error").length;
  const totalCount = items.length;
  const hasErrors  = errCount > 0 && !running;

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="grid-bg" />
        <div className="content">

          {/* Header */}
          <div className="header">
            <div className="badge"><span className="dot" />Gmail Label Organizer</div>
            <h1>จัดระเบียบ<br /><span>Gmail Labels</span></h1>
            <p className="subtitle">
              เพิ่มชื่อ label → เรียงอัตโนมัติ → สร้างใน Gmail ทีเดียว ผ่าน Claude + Gmail MCP
            </p>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-val">{totalCount}</span>
                <span className="stat-label">รายการ</span>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <span className={`stat-val ${doneCount > 0 ? "ok" : ""}`}>{doneCount}</span>
                <span className="stat-label">สำเร็จ</span>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <span className={`stat-val ${errCount > 0 ? "err" : ""}`}>{errCount}</span>
                <span className="stat-label">ล้มเหลว</span>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <span className="stat-val">{totalCount - doneCount - errCount}</span>
                <span className="stat-label">รอ</span>
              </div>
            </div>
          )}

          {/* Input card */}
          <div className="input-card">
            {/* Single add */}
            <div className="input-row">
              <div className="input-wrap">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  placeholder="เช่น  Work · Finance · Newsletter · GitHub"
                  disabled={running}
                />
              </div>
              <button className="btn-add" onClick={handleAdd} disabled={running || !input.trim()}>
                + เพิ่ม
              </button>
            </div>

            {/* Bulk add */}
            <div className="bulk-area">
              <textarea
                value={bulkVal}
                onChange={e => setBulkVal(e.target.value)}
                placeholder={"Work\nFinance\nNewsletter, GitHub, DevOps"}
                disabled={running}
              />
              <div className="bulk-hint">
                <span>วางหลายชื่อ แยกด้วย Enter หรือ comma</span>
                <button className="btn-bulk-add" onClick={handleBulkAdd} disabled={running || !bulkVal.trim()}>
                  เพิ่มทั้งหมด
                </button>
              </div>
            </div>
          </div>

          {/* Item list */}
          <div className="section-hd">
            <span className="section-label">Labels ({totalCount})</span>
            {totalCount > 1 && <span className="sort-note">⇅ A → Z</span>}
          </div>

          <div className="list">
            {totalCount === 0 ? (
              <div className="empty">
                <strong>ยังไม่มี label</strong>
                พิมพ์ชื่อแล้วกด Enter หรือวางหลายชื่อในช่องด้านบน
              </div>
            ) : items.map(item => (
              <div className={`item ${ITEM_CLASS[item.status]}`} key={item.id}>
                <div className="item-left">
                  <div className="item-icon">{initial(item.name)}</div>
                  <div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-sub">Gmail · Inbox/{item.name}</div>
                  </div>
                </div>
                <div className="item-right">
                  <span className={`item-status ${STATUS_CLASS[item.status]}`}>
                    {item.status === "creating" && <span className="spin">⟳</span>}{" "}
                    {STATUS_LABEL[item.status]}
                  </span>
                  {!running && (
                    <button className="btn-remove" onClick={() => handleRemove(item.id)} title="ลบ">
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {(running || progress > 0) && (
            <div className="progress-wrap">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Actions */}
          <div className="actions">
            <button
              className="btn-run"
              onClick={handleRun}
              disabled={running || totalCount === 0}
            >
              {running
                ? <><span className="spin">⟳</span> กำลังสร้าง… ({progress}%)</>
                : `🚀 สร้าง ${totalCount} Label${totalCount !== 1 ? "s" : ""}`
              }
            </button>

            {hasErrors && (
              <button className="btn-secondary" onClick={handleRetry} disabled={running}>
                ↺ ลองใหม่
              </button>
            )}

            {!running && totalCount > 0 && (
              <button className="btn-danger" onClick={handleClear} disabled={running}>
                ล้าง
              </button>
            )}
          </div>

          {/* Log */}
          {logs.length > 0 && (
            <div className="log-box" ref={logRef}>
              {logs.map((l, i) => (
                <div key={i} className={`log-line ${l.type}`}>
                  <span style={{ opacity: 0.4, marginRight: 8 }}>[{l.ts}]</span>{l.msg}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
