// /api/generate
export default async function handler(req, res) {
  const jobId = await createJob(req.body);

  res.json({
    jobId,
    status: "queued"
  });
}