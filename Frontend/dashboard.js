async function loadLicenseStatus() {
  try {
    const res = await fetch('/frontend/license-status.json');
    const status = await res.json();

    document.getElementById('license-root').textContent = status.root.status === "present" ? "🟢 Present" : "🔴 Missing";
    document.getElementById('license-frontend').textContent = status.frontend.status === "forbidden" ? "🔴 Forbidden" : "🟢 OK";
    document.getElementById('license-docs').textContent = status.docs.status === "present" ? "🟢 Present" : "🟡 Optional";
    document.getElementById('license-archive').textContent = status.archive.status === "archived" ? "⚪ Archived" : "🟢 None";
  } catch (err) {
    console.error("Failed to load license status:", err);
  }
}
loadLicenseStatus();
