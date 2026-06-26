const imageInput = document.getElementById('product-image');
const previewImg = document.getElementById('image-preview');
const saveBtn = document.getElementById('save-btn');
const statusBox = document.getElementById('status-box');
const statusText = document.getElementById('status-text');
const inputCategory = document.getElementById('input-category');
const inputBrand = document.getElementById('input-brand');
const inputFilename = document.getElementById('input-filename');
const productList = document.getElementById('product-list');
const clearBtn = document.getElementById('clear-btn');
// วางต่อจาก const ตัวอื่นๆ
const promptInput = document.getElementById('promptInput');
const genPromptBtn = document.getElementById('genPromptBtn');
const filenameInput = document.getElementById('filenameInput');

// Template Prompt ตาม Category
const promptTemplates = {
  'Menswear': 'A male model confidently walking on a fashion runway, wearing this {item}, cinematic lighting, 4k, high fashion, smooth fabric movement',
  'Womenswear': 'A female model strutting on a catwalk, wearing this {item}, elegant pose, studio lighting, 4k, vogue style, fabric flowing naturally',
  'Accessories': 'Close-up product shot of this {item} on rotating platform, luxury studio lighting, 4k, slow motion, detailed texture',
  'Shoes': 'Model walking in this {item}, focus on footwear, runway floor reflection, 4k, dynamic camera movement',
  'default': 'A professional model showcasing this {item}, clean studio background, 4k, commercial photography style'
};

// กดปุ่ม Gen Prompt
genPromptBtn.addEventListener('click', () => {
  const filename = filenameInput.value.trim();

  if (!filename) {
    alert('ใส่ชื่อไฟล์ก่อนนะ จะได้รู้ว่าเป็นสินค้าอะไร');
    return;
  }

  // แยก Category จากชื่อไฟล์ 20260422-Menswear-Brand
  const parts = filename.split('-');
  const category = parts[1] || 'default';
  const brand = parts[2] || 'item';

  // เลือก Template
  let template = promptTemplates[category] || promptTemplates['default'];
  template = template.replace('{item}', brand.toLowerCase());

  // ใส่ในช่อง + เอฟเฟกต์
  promptInput.value = template;
  promptInput.classList.add('ring-2', 'ring-green-400');
  setTimeout(() => promptInput.classList.remove('ring-2', 'ring-green-400'), 1000);

  genPromptBtn.textContent = '✅ Gen แล้ว!';
  setTimeout(() => genPromptBtn.textContent = '✨ Gen Prompt', 2000);
});
let currentImageHash = null;
let currentFileExt = '.jpg';

async function getImageHash(base64) {
  const msgBuffer = new TextEncoder().encode(base64);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        function getSavedProducts() {
          return JSON.parse(localStorage.getItem('crystal_products') || '[]');
          }

          function generateFilename() {
            const today = new Date();
              const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
                const category = inputCategory.value || 'Category';
                  const brand = inputBrand.value.trim().replace(/\s+/g, '-') || 'Brand';
                    inputFilename.value = `${dateStr}-${category}-${brand}${currentFileExt}`;
                    }

                    function renderList() {
                      const products = getSavedProducts();
                        if (products.length === 0) {
                            productList.innerHTML = 'ยังไม่มี Product';
                                return;
                                  }
                                    productList.innerHTML = products.map(p =>
                                        `<div style="padding:6px 0; border-bottom:1px solid #eee;">
                                              <b>${p.filename}</b><br>
                                                    <span style="color:#999; font-size:12px;">บันทึกเมื่อ: ${new Date(p.date).toLocaleString('th-TH')}</span>
                                                        </div>`
                                                          ).join('');
                                                          }

                                                          imageInput.addEventListener('change', async (e) => {
                                                            const file = e.target.files[0];
                                                              if (!file) return;
                                                                currentFileExt = '.' + file.name.split('.').pop().toLowerCase();

                                                                  const reader = new FileReader();
                                                                    reader.onload = async (event) => {
                                                                        const base64 = event.target.result;
                                                                            currentImageHash = await getImageHash(base64);

                                                                                const products = getSavedProducts();
                                                                                    const isDuplicate = products.some(p => p.hash === currentImageHash);

                                                                                        statusBox.style.display = 'block';
                                                                                            if (isDuplicate) {
                                                                                                  const oldProduct = products.find(p => p.hash === currentImageHash);
                                                                                                        statusText.innerHTML = `⚠️ <b>รูปซ้ำ!</b><br>เคยบันทึกเป็น: ${oldProduct.filename}`;
                                                                                                              statusText.style.color = '#f59e0b';
                                                                                                                    inputFilename.value = oldProduct.filename;
                                                                                                                        } else {
                                                                                                                              statusText.textContent = '✅ รูปใหม่ พร้อมตั้งชื่อ Product';
                                                                                                                                    statusText.style.color = '#22c55e';
                                                                                                                                          generateFilename();
                                                                                                                                              }

                                                                                                                                                  previewImg.src = base64;
                                                                                                                                                      previewImg.style.display = 'block';
                                                                                                                                                        };
                                                                                                                                                          reader.readAsDataURL(file);
                                                                                                                                                          });

                                                                                                                                                          inputCategory.addEventListener('change', generateFilename);
                                                                                                                                                          inputBrand.addEventListener('input', generateFilename);

                                                                                                                                                          saveBtn.addEventListener('click', () => {
                                                                                                                                                            if (!currentImageHash) return alert('เลือกรูปก่อน');
                                                                                                                                                              if (!inputCategory.value) return alert('เลือก Category ก่อน');
                                                                                                                                                                const filename = inputFilename.value.trim();
                                                                                                                                                                  if (!filename) return alert('ใส่ชื่อไฟล์ก่อน');

                                                                                                                                                                    const products = getSavedProducts();
                                                                                                                                                                      const existingIndex = products.findIndex(p => p.hash === currentImageHash);

                                                                                                                                                                        if (existingIndex!== -1) {
                                                                                                                                                                            products[existingIndex].filename = filename;
                                                                                                                                                                                products[existingIndex].date = new Date().toISOString();
                                                                                                                                                                                  } else {
                                                                                                                                                                                      products.unshift({ hash: currentImageHash, filename, date: new Date().toISOString() });
                                                                                                                                                                                        }

                                                                                                                                                                                          localStorage.setItem('crystal_products', JSON.stringify(products));
                                                                                                                                                                                            renderList();
                                                                                                                                                                                              alert('บันทึก Product แล้ว: ' + filename);
                                                                                                                                                                                                statusBox.style.display = 'none';
                                                                                                                                                                                                });

                                                                                                                                                                                                clearBtn.addEventListener('click', () => {
                                                                                                                                                                                                  if (confirm('ลบ Product ทั้งหมด?')) {
                                                                                                                                                                                                      localStorage.removeItem('crystal_products');
                                                                                                                                                                                                          renderList();
                                                                                                                                                                                                            }
                                                                                                                                                                                                            });

                                                                                                                                                                                                            renderList();
