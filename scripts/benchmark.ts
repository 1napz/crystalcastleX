import fs from "fs"

async function run() {
  const start = Date.now()

  // 👉 mock AI call (สำคัญ: อย่าใช้ของจริงใน CI)
  await new Promise((r) => setTimeout(r, 800))

  const latency = Date.now() - start

  const metrics = {
    cost: 0.002,
    latency,
    status: latency < 1000 ? "healthy" : "slow",
    timestamp: new Date().toISOString(),
  }

  fs.writeFileSync("metrics.json", JSON.stringify(metrics, null, 2))
}

run()
