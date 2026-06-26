---

🛡 Knowledge Document – Security Best Practices

🇹🇭 ภาษาไทย

แนวทางปฏิบัติด้านความปลอดภัย
1. Supabase RLS (Row Level Security)  
   - ต้องเปิดใช้งาน RLS ทุกตาราง  
   - ใช้ Policy ที่ชัดเจน เช่น auth.uid() = user_id  

2. Environment Variables  
   - ห้าม hardcode API keys หรือ secrets ใน client-side code  
   - ต้องใช้ ${{ secrets.* }} ใน GitHub Actions  

3. Content Security Policy (CSP)  
   - กำหนด CSP headers ใน vercel.json  
   - ตัวอย่าง:  
     `json
     {
       "headers": [
         {
           "source": "/(.*)",
           "headers": [
             { "key": "Content-Security-Policy", "value": "default-src 'self'" }
           ]
         }
       ]
     }
     `

4. Rate Limiting  
   - ใช้ Upstash หรือ Redis สำหรับจำกัด request  
   - Reviewer ต้องตรวจว่า API มีการป้องกัน brute force  

5. Error Handling  
   - ทุก API ต้องมี try-catch และส่ง status code ที่ถูกต้อง  
   - Reviewer ต้อง reject PR ที่ไม่มี error handling  

---

🇬🇧 English

Security Best Practices
1. Supabase RLS (Row Level Security)  
   - Must enable RLS on all tables  
   - Use clear policies such as auth.uid() = user_id  

2. Environment Variables  
   - No hardcoded API keys or secrets in client-side code  
   - Must use ${{ secrets.* }} in GitHub Actions  

3. Content Security Policy (CSP)  
   - Configure CSP headers in vercel.json  
   - Example:  
     `json
     {
       "headers": [
         {
           "source": "/(.*)",
           "headers": [
             { "key": "Content-Security-Policy", "value": "default-src 'self'" }
           ]
         }
       ]
     }
     `

4. Rate Limiting  
   - Use Upstash or Redis for request limiting  
   - Reviewer must check API protection against brute force  

5. Error Handling  
   - All APIs must include try-catch and proper status codes  
   - Reviewer must reject PRs without error handling  

---

📌 Reviewer Enforcement Note  
- Reviewer ต้องตรวจว่า commit message bilingual และใช้ conventional commit format เช่น docs: add security best practices knowledge doc  
- Reviewer ต้อง reject PR ที่ไม่ปฏิบัติตามแนวทางความปลอดภัยนี้  

---