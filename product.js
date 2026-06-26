// เมื่อ User กด Generate
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
}

function saveToLocalStorage(filename) {
  // ดึงข้อมูลเดิมจาก LocalStorage
  let artifacts = JSON.parse(localStorage.getItem("artifacts")) || [];

  // เพิ่มไฟล์ใหม่เข้าไป
  artifacts.push({
    name: filename,
    createdAt: new Date().toLocaleString()
  });

  // บันทึกกลับลง LocalStorage
 

function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('studio_history') || '[]');
    history.unshift(data); // เพิ่มข้อมูลใหม่ไว้บนสุด
    localStorage.setItem('studio_history', JSON.stringify(history.slice(0, 50))); // เก็บแค่ 50 รายการล่าสุด
}
 localStorage.setItem("artifacts", JSON.stringify(artifacts));
}

