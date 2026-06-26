import { NextResponse } from 'next/server'

const GITHUB_API = 'https://api.github.com'
const VERCEL_API = 'https://api.vercel.com'

function headers(token?: string) {
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

function calcRate(runs: any[]) {
  const total = runs.length || 1
  const success = runs.filter(r => r.conclusion === 'success').length
  return Math.round((success / total) * 100)
}

export async function GET() {
  try {
    const repo = process.env.GH_REPO! // "1napz/crystalcastle"
    const ghToken = process.env.GITHUB_TOKEN
    const vercelToken = process.env.VERCEL_TOKEN
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const vercelTeamId = process.env.VERCEL_TEAM_ID // optional

    // --- GitHub: workflow runs ---
    const runsRes = await fetch(
      `${GITHUB_API}/repos/${repo}/actions/runs?per_page=20`,
      { headers: headers(ghToken), cache: 'no-store' }
    )
    const runsJson = await runsRes.json()
    const runs = runsJson.workflow_runs || []
    const latest = runs[0]

    // --- GitHub: open PRs ---
    const prsRes = await fetch(
      `${GITHUB_API}/repos/${repo}/pulls?state=open&per_page=5`,
      { headers: headers(ghToken), cache: 'no-store' }
    )
    const prs = await prsRes.json()

    // --- Vercel: deployments ---
    const vercelUrl = new URL(`${VERCEL_API}/v6/deployments`)
    if (vercelProjectId) vercelUrl.searchParams.set('projectId', vercelProjectId)
    if (vercelTeamId) vercelUrl.searchParams.set('teamId', vercelTeamId)

    const vercelRes = await fetch(vercelUrl.toString(), {
      headers: headers(vercelToken),
      cache: 'no-store'
    })
    const vercelJson = await vercelRes.json()
    const deployments = vercelJson.deployments || []
    const latestDeploy = deployments[0]

    return NextResponse.json({
      ci: {
        status: latest?.conclusion ?? 'unknown',
        branch: latest?.head_branch,
        commit: latest?.head_commit?.message,
        url: latest?.html_url,
        totalRuns: runs.length,
        successRate: calcRate(runs),
        recent: runs.slice(0, 5).map((r: any) => ({
          id: r.id,
          status: r.conclusion,
          branch: r.head_branch,
          url: r.html_url
        }))
      },
      prs: prs.map((pr: any) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        url: pr.html_url
      })),
      vercel: {
        status: latestDeploy?.state ?? 'unknown', // READY / ERROR / BUILDING
        url: latestDeploy?.url ? `https://${latestDeploy.url}` : null,
        createdAt: latestDeploy?.createdAt
      }
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to load DevOps data', detail: e?.message },
      { status: 500 }
    )
  }
}