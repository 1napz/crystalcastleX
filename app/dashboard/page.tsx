// app/dashboard/page.tsx

import Link from 'next/link'

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/devops`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch DevOps data')
    }

    return res.json()
  } catch (err) {
    return null
  }
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'success' || status === 'READY'
      ? 'green'
      : status === 'failure' || status === 'ERROR'
      ? 'red'
      : 'orange'

  return (
    <span style={{ color, fontWeight: 'bold' }}>
      {status}
    </span>
  )
}

export default async function Dashboard() {
  const data = await getData()

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Failed to load DevOps data
      </div>
    )
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🚀 DevOps Dashboard</h1>

      {/* CI */}
      <section>
        <h2>CI Status</h2>
        <StatusBadge status={data.ci.status} />
        <p>{data.ci.commit}</p>
        <p>Branch: {data.ci.branch}</p>
        <p>Success Rate: {data.ci.successRate}%</p>

        {data.ci.url && (
          <Link href={data.ci.url} target="_blank">
            View CI Run →
          </Link>
        )}
      </section>

      <hr />

      {/* Vercel */}
      <section>
        <h2>Deployment</h2>
        <StatusBadge status={data.vercel.status} />

        {data.vercel.url && (
          <p>
            <Link href={data.vercel.url} target="_blank">
              Open Deployment →
            </Link>
          </p>
        )}
      </section>

      <hr />

      {/* PR */}
      <section>
        <h2>Open PRs</h2>
        <ul>
          {data.prs.map((pr: any) => (
            <li key={pr.id}>
              <Link href={pr.url} target="_blank">
                #{pr.number} - {pr.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}