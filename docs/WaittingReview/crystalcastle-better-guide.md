This is a fairly complete “AI content automation + affiliate commerce pipeline” project. It’s essentially trying to turn product feeds (Shopee affiliate links + images) into automated short-form video content with monitoring and distribution.

Here’s a grounded breakdown.


---

What this system actually is

At a systems level, Crystal Castle is a workflow orchestration stack:

1. Input layer: product images + affiliate URLs


2. State layer: Supabase (tracks links, campaigns, status)


3. AI layer: Groq (captions) + image → video generation (not fully specified how)


4. Automation layer: GitHub Actions (scheduled + event-driven jobs)


5. Notification layer: Line Notify alerts


6. Output layer: GitHub Pages / Vercel / social platforms



So the core idea is:

> “Affiliate product → AI-generated marketing content → automated distribution + monitoring”




---

What’s strong here

1. Clear pipeline thinking

The flow is well-defined and production-minded:

ingestion → transformation → distribution → monitoring


That’s already more structured than most “AI content tools” which stop at generation.

2. Event + state separation

Using Supabase as a source of truth for link state is good design.
It avoids GitHub Actions becoming stateless and fragile.

3. Automation-first architecture

GitHub Actions as scheduler + CI + pipeline engine is pragmatic and low-cost.

4. Multi-channel output strategy

Mapping content formats per platform (Shopee, X, Threads, Line) shows you’re thinking in distribution constraints, not just generation.


---

Main architectural gaps / risks

1. “AI video generation” is underspecified

This is the biggest gap.

Right now it says:

> Product image → cinematic short video



But nothing defines:

tool (Runway? Pika? ffmpeg templates? image-to-video model?)

latency expectations

cost model per render

failure handling


Without this, the pipeline is conceptually complete but operationally fragile.


---

2. GitHub Actions as orchestration engine (scaling limit)

It works early-stage, but:

no queueing system

no retry orchestration beyond basic workflow retries

no concurrency control for AI jobs

risk of hitting usage limits (you already mention this)


If this grows, you’ll likely need:

Redis queue / BullMQ

or serverless queue (Cloud Tasks / SQS equivalent)



---

3. Supabase is doing too many roles implicitly

It’s being used for:

state tracking

probably scheduling triggers

possibly logs


But there’s no explicit separation of:

operational DB vs analytics vs logs


This can become messy as scale increases.


---

4. No explicit observability layer

You have:

Line Notify alerts (good for incidents)


But missing:

structured logs

job tracing (per product → per video run ID)

failure analytics

retry visibility dashboard


Right now debugging will likely be “read logs in Actions”.


---

5. Security model is incomplete (typical for early builds)

You mention GitHub Secrets, which is good, but:

no mention of key rotation strategy

no rate-limit protection on APIs (Groq, Line, Supabase)

no abuse protection if pipeline is triggered maliciously



---

Design improvements (high impact)

1. Introduce a job model (very important)

Instead of “scripts running”, formalize:

Job:
- id
- type (caption/video/monitor)
- input payload
- status (queued/running/success/failed)
- retry_count
- timestamps

This alone makes debugging 10x easier.


---

2. Add a queue abstraction

Even a lightweight one helps:

Supabase queue table OR

Redis queue OR

GitHub Actions dispatch wrapper with deduplication



---

3. Separate pipelines into 3 services mentally

Right now it’s mixed:

A. Content generation

caption generation

video generation


B. Commerce intelligence

link monitoring

campaign expiry detection


C. Distribution

posting / formatting / link-in-bio


This separation will prevent future spaghetti workflows.


---

4. Add cost controls (critical for AI systems)

You should explicitly track:

cost per video

cost per caption batch

daily budget cap


Otherwise Groq / video APIs can silently scale expenses.


---

5. Introduce deterministic fallback content

If AI fails:

fallback caption templates

static image post

retry queue instead of hard failure


This is key for “always-on” affiliate systems.


---

One strategic observation

This project is closer to a:

> “programmatic content factory for affiliate commerce”



not just an “AI tool”.

That means your real bottleneck is not model quality—it’s:

throughput

reliability

cost per output

distribution efficiency



---

If you want to push this further

The next evolution would be:

dashboard (campaign performance + generated content history)

automated A/B testing captions

conversion tracking (click → sale feedback loop)

model selection layer (cheap vs high-quality generation modes)



---

If you want, I can map this into:

a production-grade architecture (AWS/GCP equivalent)

or a minimal “v2 refactor plan” to make it scalable without rewriting everything

or identify exactly where it will break first under load


Just tell me which direction you care about.