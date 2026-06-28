// ข้อมูลตัวอย่าง - เปลี่ยนตรงนี้ได้
const dashboardData = {
  promptsUsed: 1247,
  successRate: 94.2,
  activeTasks: 8,
  weeklyUsage: [
    { day: 'Mon', value: 120 },
    { day: 'Tue', value: 190 },
    { day: 'Wed', value: 150 },
    { day: 'Thu', value: 220 },
    { day: 'Fri', value: 180 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 60 }
  ],
  knowledgeBase: [
    {
      id: 1,
      title: "Prompt Engineering Best Practices",
      category: "Guide",
      desc: "วิธีเขียน prompt ให้ได้ผลลัพธ์แม่นยำขึ้น",
      content: "1. กำหนด Role ให้ชัดเจน เช่น 'คุณเป็น Senior Dev' <br>2. ใส่ Context และตัวอย่าง <br>3. บอก Format ที่ต้องการ <br>4. ใช้ Chain-of-Thought สำหรับงานซับซ้อน"
    },
    {
      id: 2,
      title: "API Rate Limits",
      category: "Docs",
      desc: "ข้อจำกัดการเรียกใช้ API ต่อนาที",
      content: "Free Tier: 60 req/min <br>Pro Tier: 300 req/min <br>Enterprise: Unlimited <br>ถ้าเกินจะได้ 429 Too Many Requests"
    },
    {
      id: 3,
      title: "ทำไม AI ตอบผิดบ้าง",
      category: "FAQ",
      desc: "สาเหตุที่โมเดลอาจ hallucinate",
      content: "AI เทรนจากข้อมูลในอดีต ไม่มีข้อมูล real-time ถ้าไม่มีใน training data อาจเดาคำตอบขึ้นมา ควรใส่ข้อมูลอ้างอิงใน prompt เพื่อลดปัญหา"
    },
    {
      id: 4,
      title: "Temperature Parameter",
      category: "Guide",
      desc: "ค่าควบคุมความสร้างสรรค์ของคำตอบ",
      content: "Temperature = 0: ตอบเหมือนเดิมทุกครั้ง เหมาะกับงานที่ต้องการความแม่น <br>Temperature = 1: สร้างสรรค์สูง เหมาะกับงานไอเดีย <br>ค่าแนะนำ: 0.7 สำหรับงานทั่วไป"
    }
  ]
};

// ฟังก์ชัน animate ตัวเลข
function animateValue(id, start, end, duration, suffix = '') {
  const element = document.getElementById(id);
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    
    if (suffix === '%') {
      element.textContent = current.toFixed(1) + suffix;
    } else {
      element.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 16);
}

// สร้างกราฟแท่ง
function createBarChart() {
  const chartEl = document.getElementById('chart');
  const maxValue = Math.max(...dashboardData.weeklyUsage.map(d => d.value));
  
  dashboardData.weeklyUsage.forEach((item, index) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.setAttribute('data-value', item.value);
    
    const heightPercent = (item.value / maxValue) * 100;
    bar.style.height = '0%';
    
    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = item.day;
    bar.appendChild(label);
    
    chartEl.appendChild(bar);
    
    setTimeout(() => {
      bar.style.height = heightPercent + '%';
    }, index * 100);
  });
}

// สร้างรายการ Knowledge
function renderKnowledge(items) {
  const listEl = document.getElementById('knowledgeList');
  listEl.innerHTML = '';
  
  if (items.length === 0) {
    listEl.innerHTML = '<div class="no-results">ไม่เจอข้อมูลที่ค้นหา</div>';
    return;
  }
  
  items.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'knowledge-item';
    itemEl.innerHTML = `
      <div class="knowledge-title">
        ${item.title}
        <span class="knowledge-category">${item.category}</span>
      </div>
      <div class="knowledge-desc">${item.desc}</div>
      <div class="knowledge-content">${item.content}</div>
    `;
    
    itemEl.addEventListener('click', () => {
      itemEl.classList.toggle('active');
    });
    
    listEl.appendChild(itemEl);
  });
}

// ฟังก์ชันค้นหา Knowledge
function setupKnowledgeSearch() {
  const searchEl = document.getElementById('knowledgeSearch');
  searchEl.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = dashboardData.knowledgeBase.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    renderKnowledge(filtered);
  });
}

// โหลดข้อมูลตอนเปิดหน้า
document.addEventListener('DOMContentLoaded', () => {
  animateValue('prompts', 0, dashboardData.promptsUsed, 1500);
  animateValue('success', 0, dashboardData.successRate, 1500, '%');
  animateValue('tasks', 0, dashboardData.activeTasks, 1500);
  createBarChart();
  renderKnowledge(dashboardData.knowledgeBase);
  setupKnowledgeSearch();
});