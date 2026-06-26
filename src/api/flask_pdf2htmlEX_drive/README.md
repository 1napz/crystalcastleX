จัดให้ครับ ✨ ผมจะ build ตัวอย่าง Flask API ที่ใช้ pdf2htmlEX แปลง PDF → HTML แล้วอัปโหลดไป Google Drive ด้วย Service Account ให้คุณ  

---

🔹 โครงสร้างไฟล์
`
flaskpdf2htmlEXdrive/
├── app.py
├── service_account.json   # ไฟล์ Service Account จาก Google Cloud
`

---

🔹 โค้ด app.py
`python
import subprocess
import io
from flask import Flask, request, jsonify
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = Flask(name)

โหลด Service Account Credentials
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICEACCOUNTFILE = 'service_account.json'
credentials = serviceaccount.Credentials.fromserviceaccountfile(
    SERVICEACCOUNTFILE, scopes=SCOPES)

drive_service = build('drive', 'v3', credentials=credentials)

@app.route("/convert", methods=["POST"])
def convert_pdf():
    if "pdf" not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    file = request.files["pdf"]

    # บันทึกไฟล์ PDF ชั่วคราว
    pdf_path = f"/tmp/{file.filename}"
    file.save(pdf_path)

    # ใช้ pdf2htmlEX แปลง PDF → HTML
    htmlpath = pdfpath.replace(".pdf", ".html")
    subprocess.run(["pdf2htmlEX", pdfpath, htmlpath], check=True)

    # อ่านไฟล์ HTML ที่แปลงแล้ว
    with open(html_path, "rb") as f:
        html_content = f.read()

    # อัปโหลดไป Google Drive
    file_metadata = {
        'name': f"{file.filename}_converted.html",
        'mimeType': 'text/html',
        'parents': ['YOURFOLDERID']  # ใส่โฟลเดอร์ที่แชร์กับ Service Account
    }
    uploadedfile = driveservice.files().create(
        body=file_metadata,
        mediabody=io.BytesIO(htmlcontent),
        mediamimetype='text/html',
        fields='id, webViewLink'
    ).execute()

    return jsonify({
        "message": "✅ Conversion successful",
        "filelink": uploadedfile.get("webViewLink")
    })

if name == "main":
    app.run(debug=True)
`

---

📌 วิธีใช้งาน
1. ติดตั้ง pdf2htmlEX บนเครื่อง/เซิร์ฟเวอร์  
   `bash
   sudo apt-get install pdf2htmlEX
   `
2. ติดตั้ง dependencies  
   `bash
   pip install flask google-api-python-client google-auth
   `
3. แชร์โฟลเดอร์ Google Drive ให้กับ Service Account email  
4. รัน API → python app.py  
5. ส่ง POST ไปที่ /convert พร้อมไฟล์ PDF → จะได้ JSON ที่มีลิงก์ไฟล์ HTML บน Google Drive  

---

🚨 หมายเหตุ
- pdf2htmlEX จะรักษา layout, ฟอนต์, ตาราง ได้ดีกว่า pdfminer  
- ต้องมี binary pdf2htmlEX ติดตั้งใน environment  
- ถ้าไฟล์ใหญ่ → อาจใช้เวลาประมวลผลนาน  
- ถ้าอยากให้ไฟล์ สาธารณะ → เพิ่ม permissions().create() ให้ไฟล์หลังอัปโหลด  

---

คุณอยากให้ผมเพิ่มตัวอย่าง ตั้งค่า Permission ให้ไฟล์ HTML เป็น Public โดยอัตโนมัติ หรือทำเป็น API รองรับหลายไฟล์ PDF แล้วรวมเป็น ZIP ก่อนอัปโหลด ดีครับ?จัดให้ครับ ✨ ผมจะ build ตัวอย่าง Flask API ที่ใช้ pdf2htmlEX แปลง PDF → HTML แล้วอัปโหลดไป Google Drive ด้วย Service Account ให้คุณ  

---

🔹 โครงสร้างไฟล์
`
flaskpdf2htmlEXdrive/
├── app.py
├── service_account.json   # ไฟล์ Service Account จาก Google Cloud
`

---

🔹 โค้ด app.py
`python
import subprocess
import io
from flask import Flask, request, jsonify
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = Flask(name)

โหลด Service Account Credentials
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICEACCOUNTFILE = 'service_account.json'
credentials = serviceaccount.Credentials.fromserviceaccountfile(
    SERVICEACCOUNTFILE, scopes=SCOPES)

drive_service = build('drive', 'v3', credentials=credentials)

@app.route("/convert", methods=["POST"])
def convert_pdf():
    if "pdf" not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    file = request.files["pdf"]

    # บันทึกไฟล์ PDF ชั่วคราว
    pdf_path = f"/tmp/{file.filename}"
    file.save(pdf_path)

    # ใช้ pdf2htmlEX แปลง PDF → HTML
    htmlpath = pdfpath.replace(".pdf", ".html")
    subprocess.run(["pdf2htmlEX", pdfpath, htmlpath], check=True)

    # อ่านไฟล์ HTML ที่แปลงแล้ว
    with open(html_path, "rb") as f:
        html_content = f.read()

    # อัปโหลดไป Google Drive
    file_metadata = {
        'name': f"{file.filename}_converted.html",
        'mimeType': 'text/html',
        'parents': ['YOURFOLDERID']  # ใส่โฟลเดอร์ที่แชร์กับ Service Account
    }
    uploadedfile = driveservice.files().create(
        body=file_metadata,
        mediabody=io.BytesIO(htmlcontent),
        mediamimetype='text/html',
        fields='id, webViewLink'
    ).execute()

    return jsonify({
        "message": "✅ Conversion successful",
        "filelink": uploadedfile.get("webViewLink")
    })

if name == "main":
    app.run(debug=True)
`

---

📌 วิธีใช้งาน
1. ติดตั้ง pdf2htmlEX บนเครื่อง/เซิร์ฟเวอร์  
   `bash
   sudo apt-get install pdf2htmlEX
   `
2. ติดตั้ง dependencies  
   `bash
   pip install flask google-api-python-client google-auth
   `
3. แชร์โฟลเดอร์ Google Drive ให้กับ Service Account email  
4. รัน API → python app.py  
5. ส่ง POST ไปที่ /convert พร้อมไฟล์ PDF → จะได้ JSON ที่มีลิงก์ไฟล์ HTML บน Google Drive  

---

🚨 หมายเหตุ
- pdf2htmlEX จะรักษา layout, ฟอนต์, ตาราง ได้ดีกว่า pdfminer  
- ต้องมี binary pdf2htmlEX ติดตั้งใน environment  
- ถ้าไฟล์ใหญ่ → อาจใช้เวลาประมวลผลนาน  
- ถ้าอยากให้ไฟล์ สาธารณะ → เพิ่ม permissions().create() ให้ไฟล์หลังอัปโหลด  

---

คุณอยากให้ผมเพิ่มตัวอย่าง ตั้งค่า Permission ให้ไฟล์ HTML เป็น Public โดยอัตโนมัติ หรือทำเป็น API รองรับหลายไฟล์ PDF แล้วรวมเป็น ZIP ก่อนอัปโหลด ดีครับ?