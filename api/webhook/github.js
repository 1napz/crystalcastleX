export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const event = req.headers['x-github-event'];
  const body = req.body;
  
  // เธชเธเนเธเนเธเน 3 event เธชเธณเธเธฑเธ
  const important = ['secret_scanning_alert', 'deployment_status', 'workflow_run'];
  if (!important.includes(event)) return res.status(200).end();
  
  let emoji = 'โ…';
  let text = '';
  
  if (event === 'secret_scanning_alert') {
    emoji = '๐จ';
    text = `KEY เธซเธฅเธธเธ”! ${body?.alert?.secret_type || ''}`;
  } else if (event === 'deployment_status') {
    if (body?.deployment_status?.state === 'failure') {
      emoji = 'โ';
      text = 'Deploy เธเธฑเธ';
    } else if (body?.deployment_status?.state === 'success') {
      emoji = 'โ…';
      text = 'Deploy เธชเธณเน€เธฃเนเธ';
    } else {
      return res.status(200).end();
    }
  } else if (event === 'workflow_run') {
    const conclusion = body?.workflow_run?.conclusion;
    if (conclusion === 'failure') {
      emoji = 'โ ๏ธ';
      text = `Workflow เธฅเนเธกเน€เธซเธฅเธง: ${body?.workflow_run?.name}`;
    } else {
      return res.status(200).end();
    }
  }
  
  const repo = body?.repository?.full_name || 'crystalcastle';
  const msg = `${emoji} Crystal Castle Alert\n${text}\nRepo: ${repo}\nเน€เธงเธฅเธฒ: ${new Date().toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'})}`;
  
  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: 'HTML'
      })
    });
  } catch (e) {
    console.error('Telegram error', e);
  }
  
  res.status(200).json({ ok: true });
}
