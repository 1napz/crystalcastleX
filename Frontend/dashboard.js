/**
 * Loads and displays license status information from the backend API.
 * Fetches license data and updates the dashboard UI elements with the current status.
 *
 * @async
 * @returns {Promise<void>} Resolves when status is loaded and displayed, or logs error on failure.
 * @throws {Error} Throws if the fetch request fails or returns a non-OK HTTP status.
 */
async function loadLicenseStatus() {
  try {
    const res = await fetch('/frontend/license-status.json');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
    }
    const status = await res.json();

    const licenseRoot = document.getElementById('license-root');
    const licenseFrontend = document.getElementById('license-frontend');
    const licenseDocs = document.getElementById('license-docs');
    const licenseArchive = document.getElementById('license-archive');

    if (licenseRoot) {
      licenseRoot.textContent = status.root.status === "present" ? "🟢 Present" : "🔴 Missing";
    }
    if (licenseFrontend) {
      licenseFrontend.textContent = status.frontend.status === "forbidden" ? "🔴 Forbidden" : "🟢 OK";
    }
    if (licenseDocs) {
      licenseDocs.textContent = status.docs.status === "present" ? "🟢 Present" : "🟡 Optional";
    }
    if (licenseArchive) {
      licenseArchive.textContent = status.archive.status === "archived" ? "⚪ Archived" : "🟢 None";
    }
  } catch (err) {
    console.error("Failed to load license status:", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLicenseStatus);
} else {
  loadLicenseStatus();
}
