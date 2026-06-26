# ๐ฌ Crystal Castle Lite v1.3

**เน€เธเธฃเธทเนเธญเธเน€เธเธตเธขเธฃเธฐเนเธ Lite** โ€” เธญเธฑเธเธฃเธนเธเธชเธดเธเธเนเธฒ โ’ AI เนเธ•เนเธ Prompt โ’ เน€เธเธเธงเธดเธ”เธตเนเธญ โ’ เธชเธฃเนเธฒเธเนเธเธเธเธฑเนเธเธญเธฑเธ•เนเธเธกเธฑเธ•เธด

Live: https://crystalcastle-pi.vercel.app/index.html  
Mission Control: https://5-1napzs-projects.vercel.app (Realtime Status)

---

## โจ เธกเธตเธญเธฐเนเธฃเนเธซเธกเนเนเธ v1.3

- โ… **UI เธกเธทเธญเธ–เธทเธญเนเธเนเนเธฅเนเธง** - textarea เนเธกเนเธเธตเธเธเธธเนเธกเธเธเธเธญเน€เธฅเนเธ
- โ… **Gen Prompt เธ”เนเธงเธข Groq (Llama 3.3 70B)** - เน€เธฃเนเธง 2-3 เธงเธด เธเธฃเธต
- โ… **Generate Post เธญเธฑเธ•เนเธเธกเธฑเธ•เธด** - เนเธ”เนเนเธเธเธเธฑเนเธเนเธ—เธข + hashtag เธเธฃเนเธญเธกเนเธเธชเธ•เน
- โ… **2 Engines**: FAL Kling (เน€เธฃเนเธง 1.8 เธเธฒเธ—) / Magic Hour (เธเธฃเธตเธ—เธ”เธชเธญเธ)
- โ… **Auto filename** เธ•เธฒเธกเธงเธฑเธเธ—เธตเนเธเธฃเธดเธ `YYYYMMDD-Category-Brand`
- โ… **Mission Control v1.0** - เธ”เธนเธชเธ–เธฒเธเธฐเธฃเธฐเธเธ realtime
- โ… **Telegram Alerts** - เนเธเนเธเน€เธ•เธทเธญเธเธ—เธฑเธเธ—เธตเน€เธกเธทเนเธญ key เธซเธฅเธธเธ”, deploy เธเธฑเธ, API 500

---

## ๐€ เธงเธดเธเธตเนเธเนเธเธฒเธ

### 1. เน€เธ•เธฃเธตเธขเธกเธฃเธนเธ
เธ•เธฑเนเธเธเธทเนเธญเนเธเธฅเน: `YYYYMMDD-Category-Brand.jpg`
เธ•เธฑเธงเธญเธขเนเธฒเธ: `20260422-Bag-Gucci.jpg`

### 2. เน€เธเนเธฒเน€เธเธฃเธทเนเธญเธเน€เธเธตเธขเธฃเธฐเนเธ
1. เธญเธฑเธเธฃเธนเธ โ’ เธเธ” "โจ Gen Prompt"
2. AI เธเธฐเนเธ•เนเธ prompt เธงเธดเธ”เธตเนเธญเนเธเธเธฑเนเธเนเธซเน
3. เน€เธฅเธทเธญเธ Engine โ’ เธเธ” Generate

### 3. เนเธ”เนเธงเธดเธ”เธตเนเธญ + เนเธเธเธเธฑเนเธ
เธฃเธฐเธเธเธชเธฃเนเธฒเธเธงเธดเธ”เธตเนเธญ 5 เธงเธด + Generate Post เธญเธฑเธ•เนเธเธกเธฑเธ•เธด

---

## ๐ ๏ธ เธ•เธดเธ”เธ•เธฑเนเธ

### 1. Clone
```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
```

### 2. เธ•เธฑเนเธเธเนเธฒ Environment Variables (Vercel)
เนเธเธ—เธตเน Vercel โ’ Settings โ’ Environment Variables โ’ เธ•เธดเนเธ **Production + Preview + Development**

| Variable | เนเธเนเธ—เธณเธญเธฐเนเธฃ |
|----------|-----------|
| `GROQ_API_KEY` | Gen Prompt |
| `FAL_KEY` | FAL Kling |
| `MAGIC_HOUR_API_KEY` | Magic Hour |
| `SUPABASE_URL` | เน€เธเนเธเธเนเธญเธกเธนเธฅ |
| `SUPABASE_ANON_KEY` | เน€เธเนเธเธเนเธญเธกเธนเธฅ |
| `TELEGRAM_BOT` | เนเธเนเธเน€เธ•เธทเธญเธ Telegram |
| `TELEGRAM_CHAT_ID` | เนเธเนเธเน€เธ•เธทเธญเธ Telegram |

### 3. Deploy
```bash
vercel --prod
```

---

## ๐“ก เธฃเธฐเธเธเนเธเนเธเน€เธ•เธทเธญเธ

Webhook: `/api/webhook/github`
- เนเธเนเธเน€เธ•เธทเธญเธเน€เธกเธทเนเธญ: workflow เธฅเนเธกเน€เธซเธฅเธง, deploy เธเธฑเธ, API key เธเธดเธ”, Magic Hour 500
- เธชเนเธเธ•เธฃเธเน€เธเนเธฒ Telegram @crystalcastle_alert_bot

เธ•เธฑเนเธเธเนเธฒ GitHub Webhook:
```
Payload URL: https://your-domain.vercel.app/api/webhook/github
Content type: application/json
Events: workflow_run, deployment_status
```

---

## ๐งฉ เนเธเธฃเธเธชเธฃเนเธฒเธเนเธเธฃเน€เธเธเธ•เน

```
/
โ”โ”€โ”€ api/
โ”   โ””โ”€โ”€ webhook/
โ”       โ””โ”€โ”€ github.js          # Telegram alerts
โ”โ”€โ”€ index.html                 # เธซเธเนเธฒเน€เธเธฃเธทเนเธญเธเน€เธเธตเธขเธฃเธฐเนเธ
โ”โ”€โ”€ mission-control.html       # เธซเธเนเธฒ Mission Control
โ”โ”€โ”€ app.js                     # Logic เธซเธฅเธฑเธ
โ”โ”€โ”€ config.example.js          # เธ•เธฑเธงเธญเธขเนเธฒเธ config
โ”โ”€โ”€ supabase-client.js
โ””โ”€โ”€ style.css
```

---

## ๐”’ Security

- เธซเนเธฒเธก commit `config.js` เธซเธฃเธทเธญ `.env` โ€” เนเธเน `.gitignore` เนเธฅเนเธง
- Key เธ—เธฑเนเธเธซเธกเธ”เน€เธเนเธเนเธ Vercel Environment Variables เน€เธ—เนเธฒเธเธฑเนเธ
- GitHub Secret Scanning เน€เธเธดเธ”เธญเธขเธนเน

เธ”เธน `SECURITY.md` เธชเธณเธซเธฃเธฑเธเธฃเธฒเธขเธเธฒเธเธเนเธญเธเนเธซเธงเน

---

## ๐“ Mission Control Status

เน€เธเนเธเธชเธ–เธฒเธเธฐ realtime:
- Gen Prompt: โ…
- Generate Post: โ…
- FAL Kling: โ…
- Magic Hour: เธ•เธฃเธงเธเธชเธญเธ API key
- Upload: โ…

---

## ๐“ License

Private project - 1napz ยฉ 2026

---

**Crystal Castle AI Factory ยท Realtime Status v1.0**  
เธญเธฑเธเน€เธ”เธ•เธฅเนเธฒเธชเธธเธ”: 22 เน€เธก.เธข. 2026
