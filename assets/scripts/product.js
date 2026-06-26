/**
 * Generate a product filename from the selected category and brand, display it in the page, and record it in artifacts and history.
 *
 * Reads values from #categorySelect and #brandInput, builds a filename in the format `YYYYMMDD-category-brand` (using the current date), sets that string as the textContent of #output, calls saveToLocalStorage(filename), and calls saveToHistory(...) with `{ name, category, brand, createdAt }` where `createdAt` is the current locale timestamp.
 */
function generateProduct() {
  const category = document.getElementById("categorySelect").value;
  const brand = document.getElementById("brandInput").value;
  const date = new Date();
  const formattedDate = date.toISOString().slice(0,10).replace(/-/g,"");

  const filename = `${formattedDate}-${category}-${brand}`;

  // แสดงผลลัพธ์บนหน้า product.html
  document.getElementById("output").textContent = filename;

  // ✅ Save ลง LocalStorage
  saveToLocalStorage(filename);

  // ✅ Save ลง History
  saveToHistory({
    name: filename,
    category,
    brand,
    createdAt: new Date().toLocaleString()
  });
}

/**
 * Appends an artifact record to the "artifacts" entry in localStorage.
 *
 * Adds an object with `name` set to the provided filename and `createdAt` set to the current locale timestamp to the stored "artifacts" array, creating the array if it does not exist.
 * @param {string} filename - The artifact filename to record (e.g., formatted as `YYYYMMDD-category-brand`).
 */
function saveToLocalStorage(filename) {
  let artifacts = JSON.parse(localStorage.getItem("artifacts")) || [];

  artifacts.push({
    name: filename,
    createdAt: new Date().toLocaleString()
  });

  localStorage.setItem("artifacts", JSON.stringify(artifacts));
}

/**
 * Persist a new history entry to the "studio_history" list in localStorage.
 *
 * Prepends the provided entry to the stored history, keeps only the most recent 50 entries,
 * and writes the updated list back under the "studio_history" key.
 *
 * @param {{name: string, category?: string, brand?: string, createdAt?: string}} data - History entry to add. Expected properties: `name` (filename), optional `category`, optional `brand`, and optional `createdAt` (localized timestamp).
 */
function saveToHistory(data) {
  let history = JSON.parse(localStorage.getItem("studio_history")) || [];
  history.unshift(data); // เพิ่มข้อมูลใหม่ไว้บนสุด
  localStorage.setItem("studio_history", JSON.stringify(history.slice(0, 50))); // เก็บแค่ 50 รายการล่าสุด
}
