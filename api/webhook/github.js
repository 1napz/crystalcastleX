export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const event = req.headers['x-github-event'];
  const body = req.body;

  const important = ['secret_scanning_alert', 'deployment_status', 'workflow_run'];
  if (!important.includes(event)) return res.status(200).end();
  
  let emoji = '';
  let text = '';

  if (event === 'secret_scanning_alert') {
    emoji = '🔒';
    text = `KEY ถูกตรวจจับ! ${body?.alert?.secret_type || ''}`;
  } else if (event === 'deployment_status') {
    if (body?.deployment_status?.state === 'failure') {
      emoji = '❌';
      text = 'Deploy พัง';
    } else if (body?.deployment_status?.state === 'success') {
      emoji = '✅';
      text = 'Deploy สำเร็จ';
    } else {
      return res.status(200).end();
    }
  } else if (event === 'workflow_run') {
    const conclusion = body?.workflow_run?.conclusion;
    if (conclusion === 'failure') {
      emoji = '⚠️';
      text = `Workflow ล้มเหลว: ${body?.workflow_run?.name}`;
    } else {
      return res.status(200).end();
    }
  }

  const repo = body?.repository?.full_name || 'crystalcastle';
  const msg = `${emoji} Crystal Castle Alert\n${text}\nRepo: ${repo}\nเวลาบน: ${new Date().toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'})}`;
  
  // Validate Telegram credentials
  const botToken = process.env.TELEGRAM_BOT;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error('Missing TELEGRAM_BOT or TELEGRAM_CHAT_ID env vars');
    return res.status(500).json({ error: 'Telegram not configured' });
  }
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: msg,
        parse_mode: 'HTML'
      })
    });
  } catch (e) {
    console.error('Telegram error', e);
    // Still return 200 to avoid GitHub retries (optional)
  }
  
  res.status(200).json({ ok: true });
}
