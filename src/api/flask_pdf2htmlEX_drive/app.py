import subprocess
import io
from flask import Flask, request, jsonify
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = Flask(__name__)

# โหลด Service Account Credentials
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = 'service_account.json'
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

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
    html_path = pdf_path.replace(".pdf", ".html")
    subprocess.run(["pdf2htmlEX", pdf_path, html_path], check=True)

    # อ่านไฟล์ HTML ที่แปลงแล้ว
    with open(html_path, "rb") as f:
        html_content = f.read()

    # อัปโหลดไป Google Drive
    file_metadata = {
        'name': f"{file.filename}_converted.html",
        'mimeType': 'text/html',
        'parents': ['YOUR_FOLDER_ID']  # ใส่โฟลเดอร์ที่แชร์กับ Service Account
    }
    uploaded_file = drive_service.files().create(
        body=file_metadata,
        media_body=io.BytesIO(html_content),
        media_mime_type='text/html',
        fields='id, webViewLink'
    ).execute()

    return jsonify({
        "message": "✅ Conversion successful",
        "file_link": uploaded_file.get("webViewLink")
    })

if __name__ == "__main__":
    app.run(debug=True)