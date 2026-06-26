// /app/api/status/route.ts
import { redis } from "@/lib/redis"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get("jobId")

  if (!jobId) {
    return Response.json({ success: false, data: null, error: "Missing jobId" })
  }

  const job = await redis.get(`job:${jobId}`)

  return Response.json({
    success: true,
    data: job,
    error: null
  })
}