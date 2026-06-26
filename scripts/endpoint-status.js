// /api/status?id=xxx
export default async function handler(req, res) {
  const job = await getJob(req.query.id);

  res.json(job);
}