const fs = require('fs');

// โหลดคำถามจากไฟล์ JSON
const questions = JSON.parse(fs.readFileSync('quiz_questions.json', 'utf8'));

// สุ่มคำถาม 5 ข้อ
const selected = questions.sort(() => 0.5 - Math.random()).slice(0, 5);

// จำลองการตอบ (ในระบบจริงอาจเชื่อมต่อ Copilot หรือ Agent)
const answers = selected.map(q => {
  return {
    question: q.question,
    chosen: q.options[0], // ตรงนี้คุณสามารถปรับให้รับ input จริง
    correct: q.answer,
    result: q.options[0] === q.answer ? '✅' : '❌'
  };
});

// สร้าง Markdown log
let log = `# Quiz Log - ${new Date().toISOString().split('T')[0]}\n\n`;
log += `| ข้อ | คำถาม | คำตอบที่เลือก | คำตอบที่ถูกต้อง | ผลลัพธ์ |\n`;
log += `|-----|--------|---------------|------------------|----------|\n`;

answers.forEach((a, i) => {
  log += `| ${i + 1} | ${a.question} | ${a.chosen} | ${a.correct} | ${a.result} |\n`;
});

// เขียนไฟล์ log
fs.writeFileSync('quiz_log.md', log);

console.log('Quiz log updated!');