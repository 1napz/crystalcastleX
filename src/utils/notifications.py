import requests

def send_line_notify(message, token):
    url = 'https://notify-api.line.me/api/notify'
    headers = {'Authorization': f'Bearer {token}'}
    data = {'message': message}
    
    response = requests.post(url, headers=headers, data=data)
    return response.status_code

# ตัวอย่างการใช้งาน
# token = "ใส่_LINE_TOKEN_ของคุณที่นี่"
# send_line_notify("✅ ทดสอบรัน Playwright สำเร็จแล้ว!", token)
