import { useState } from "react";

const capabilities = [
  { name: "Native UI/UX", desc: "Build native mobile interfaces & user experience" },
  { name: "Cross-platform Development", desc: "Support for both iOS and Android platforms" },
  { name: "Local Storage", desc: "Offline data storage and cache management" },
  { name: "User Authentication", desc: "Mobile login, authentication" },
  { name: "Push Notifications", desc: "Local and remote push messaging" },
  { name: "Backend Endpoint", desc: "API key protected endpoint such as Claude" },
  { name: "Device Features Integration", desc: "Camera, GPS, sensors and hardware access" },
  { name: "APK/AAB Download", desc: "Download Android APK/AAB" },
  { name: "App Store Distribution", desc: "Publish to App Store (Apple)" },
  { name: "Custom Domain Publishing", desc: "Publish to your own custom domain" },
  { name: "Web Content Extraction", desc: "Extract specific information from web pages" },
  { name: "Team Collaboration", desc: "Sync data across users in real-time" },
];

const cards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Start Building Now",
    desc: "From Idea to Full-Stack App",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <rect x="2" y="7" width="20" height="15" rx="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
    title: "Tutorials",
    desc: "Watch videos to learn AI coding with OnSpace.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Fee Plan",
    desc: "Understanding Fee Plan Options",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "FAQ",
    desc: "Frequently Asked Questions",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Features",
    desc: "AI-powered coding tools and assistance",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <rect x="2" y="7" width="9" height="9" rx="1" />
        <rect x="13" y="2" width="9" height="9" rx="1" />
        <rect x="13" y="13" width="9" height="9" rx="1" />
        <path d="M11 11.5h2M11 12.5h2" />
      </svg>
    ),
    title: "Integrations",
    desc: "Connect with GitHub, Supabase, and more.",
  },
];

const SocialIcon = ({ children, href = "#" }) => (
  <a
    href={href}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 36,
      height: 36,
      borderRadius: 8,
      color: "#9ca3af",
      border: "1px solid #2a2a2a",
      background: "#161616",
      transition: "color 0.2s, border-color 0.2s",
      textDecoration: "none",
    }}
    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#444"; }}
    onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
  >
    {children}
  </a>
);

export default function DocsPage() {
  const [helpful, setHelpful] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      background: "#0d0d0d",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      fontSize: 16,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #7c3aed33; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
        .card-hover {
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .card-hover:hover {
          border-color: #5b21b6 !important;
          background: #1a1028 !important;
        }
        .btn-helpful {
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          cursor: pointer;
        }
        .btn-helpful:hover {
          background: #1e1e2e !important;
          border-color: #7c3aed !important;
        }
        .cta-link {
          color: #a78bfa;
          text-decoration: none;
          transition: color 0.2s;
        }
        .cta-link:hover { color: #c4b5fd; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.5s ease both; }
        .fade-in-1 { animation-delay: 0.05s; }
        .fade-in-2 { animation-delay: 0.12s; }
        .fade-in-3 { animation-delay: 0.2s; }
        .fade-in-4 { animation-delay: 0.28s; }
      `}</style>

      {/* Top Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0d0d0dcc",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e1e1e",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 56,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, letterSpacing: -0.5,
            }}>O</div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.5, textTransform: "uppercase" }}>
              ONSPACE
            </span>
          </div>

          {/* Icons */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Breadcrumb bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "0 20px", height: 44,
          borderTop: "1px solid #1a1a1a",
          background: "#111",
        }}>
          <button
            onClick={() => setMenuOpen(m => !m)}
            style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: "4px 2px" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Welcome</span>
        </div>
      </nav>

      {/* Sidebar drawer (simple) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "#000000aa",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 260,
              background: "#111", borderRight: "1px solid #1e1e1e",
              padding: "24px 16px",
              display: "flex", flexDirection: "column", gap: 6,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Navigation
            </div>
            {["Welcome", "Features", "Tutorials", "Fee Plan", "FAQ", "Integrations"].map(item => (
              <button key={item} onClick={() => setMenuOpen(false)} style={{
                background: "none", border: "none", color: "#d1d5db",
                textAlign: "left", padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                fontSize: 14, fontFamily: "inherit",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >{item}</button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Hero Text */}
        <div className="fade-in fade-in-1" style={{ marginBottom: 36 }}>
          <p style={{
            fontSize: 18, lineHeight: 1.75, color: "#d1d5db",
            borderLeft: "3px solid #7c3aed",
            paddingLeft: 16,
          }}>
            The <strong style={{ color: "#fff" }}>OnSpace</strong> app, built with{" "}
            <strong style={{ color: "#fff" }}>React Native and Expo</strong>, demonstrates this
            capability — integrating popular third-party libraries to deliver seamless
            cross-platform performance across <em>iOS, Android, and Web</em> environments.
          </p>
        </div>

        {/* Capabilities Table */}
        <div className="fade-in fade-in-2" style={{ marginBottom: 48 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                <th style={{ textAlign: "left", padding: "10px 0", color: "#fff", fontWeight: 600, fontSize: 14, width: "42%" }}>
                  Capability
                </th>
                <th style={{ textAlign: "left", padding: "10px 0", color: "#fff", fontWeight: 600, fontSize: 14 }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((cap, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 0", verticalAlign: "top" }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#f9fafb" }}>{cap.name}</span>
                  </td>
                  <td style={{ padding: "14px 0 14px 12px", verticalAlign: "top" }}>
                    <span style={{ color: "#9ca3af", fontSize: 14 }}>{cap.desc}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Get Started Section */}
        <div className="fade-in fade-in-3" style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, lineHeight: 1.2 }}>
            Get started with OnSpace
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}>
            {cards.map((card, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: "#161616",
                  border: "1px solid #252525",
                  borderRadius: 12,
                  padding: "20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ color: "#7c3aed" }}>{card.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#f9fafb", marginBottom: 4 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{card.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful */}
        <div className="fade-in fade-in-4" style={{
          borderTop: "1px solid #1e1e1e",
          paddingTop: 28,
          marginBottom: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}>
          <span style={{ color: "#9ca3af", fontSize: 14 }}>Was this page helpful?</span>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Yes", val: "yes", icon: "👍" },
              { label: "No", val: "no", icon: "👎" },
            ].map(btn => (
              <button
                key={btn.val}
                className="btn-helpful"
                onClick={() => setHelpful(btn.val)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 20px", borderRadius: 8, cursor: "pointer",
                  background: helpful === btn.val ? "#2e1065" : "#161616",
                  border: `1px solid ${helpful === btn.val ? "#7c3aed" : "#2a2a2a"}`,
                  color: helpful === btn.val ? "#c4b5fd" : "#d1d5db",
                  fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                }}
              >
                <span>{btn.icon}</span> {btn.label}
              </button>
            ))}
          </div>
          {helpful && (
            <p style={{ color: "#7c3aed", fontSize: 13, animation: "fadeInUp 0.3s ease" }}>
              {helpful === "yes" ? "🎉 Thanks for the feedback!" : "Thanks — we'll work on improving this."}
            </p>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "right" }}>
          <a href="#" className="cta-link" style={{ fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 4 }}>
            Start Building Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1a1a1a",
        padding: "20px 20px",
        maxWidth: 780,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          <SocialIcon>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </SocialIcon>
        </div>
        <span style={{ fontSize: 13, color: "#4b5563" }}>
          Powered by{" "}
          <a href="#" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>mintlify</a>
        </span>
      </footer>
    </div>
  );
}
