// api/tasks.js (รวม create-task ทั้งหมด)
export default async function handler(req, res) {
  const { platform, ...data } = req.body;
  
  switch(platform) {
    case 'clickup':
      // สร้าง ClickUp task
      break;
    case 'asana':
      // สร้าง Asana task
      break;
    default:
      return res.status(400).json({ error: 'Unknown platform' });
  }
}
