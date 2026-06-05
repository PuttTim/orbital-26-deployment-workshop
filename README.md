# Orbital 26 Deployment Workshop

> You: Hey bro, I just finished building my Orbital app! Check it out at http://localhost:5173/
> Friend: Damn, your project looks exactly like my Orbital project 💀

You've built your app. Only problem? It's stuck on your laptop.

In this two-part workshop, we'll take an app from localhost to the real internet. You'll learn how to deploy your project, set up a database, store files, and manage secrets properly. Then we'll set up CI/CD with GitHub Actions, automated testing, and monitoring so you can ship with confidence instead of crossing your fingers after every push.

## Workshop materials

| Resource | Link |
| --- | --- |
| Starter repo | [hckr.cc/orbital-deployment-26](https://hckr.cc/orbital-deployment-26) |
| Slide deck | [hckr.cc/orbital-deployment-slides](https://hckr.cc/orbital-deployment-slides) |
| Part 1 step-by-step | [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) |
| Part 2 step-by-step | [`part-2/WORKSHOP.md`](part-2/WORKSHOP.md) |

<img src="slides/public/qr/orbital-deployment-slides-qr-code.webp" alt="Slide deck QR code" width="160" />

## Schedule

- **Part 1:** Saturday, 30 May 2026, 1:00pm to 3:00pm. Deploy from localhost to the internet ([`part-1/WORKSHOP.md`](part-1/WORKSHOP.md))
- **Part 2:** Saturday, 6 June 2026, 10:00am to 12:00pm. Testing, CI/CD, Docker, and monitoring (builds on Part 1)

Missed Part 1 live? Catch up via [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) before Part 2.

If you forked during Part 1, **sync your fork with upstream** so you have the latest `part-2/` materials. See [Get Part 2 updates](#get-part-2-updates).

## Part 1

For Part 1 of the workshop, we will focus on deploying a web application from localhost to the internet. You will deploy and extend the pre-built **Color Swipe** app.

We will cover:

- Introduction to deployment concepts
- Cloudflare Workers and serverless deployment
- Deploying a React app (starter provided)
- Hono API backend (already in starter)
- Supabase database and storage

Hands-on guide: [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md)

## Part 2

Part 2 builds on your deployed Color Swipe app from Part 1. You keep the Cloudflare Worker + Supabase stack, then add automated testing, CI/CD, a containerised Python microservice, and error monitoring.

We will cover:

- **Testing:** Vitest unit tests, Playwright E2E smoke tests
- **CI/CD:** GitHub Actions to test and deploy on every push
- **Containers:** Docker images for a FastAPI vibe-search service
- **Deploy:** Render for the Python service, Worker proxy for the frontend
- **Local dev:** Docker Compose for multiple services
- **Monitoring:** Sentry for Worker and FastAPI errors

### What you build

```
Browser -> Cloudflare Worker (React + Hono API) -> Supabase
                    |
              Render (FastAPI vibe-search + ML model)
```

- [`part-2/apps/web/`](part-2/apps/web/) -- Color Swipe with tests, GitHub Actions workflow template, Vibe Search UI, and Sentry on the Worker
- [`part-2/apps/vibe-search/`](part-2/apps/vibe-search/) -- FastAPI service that ranks colors by sentence similarity (`all-MiniLM-L6-v2`)
- [`part-2/docker-compose.yaml`](part-2/docker-compose.yaml) -- run vibe-search + local Postgres together

Hands-on guide: [`part-2/WORKSHOP.md`](part-2/WORKSHOP.md)

You must complete Part 1 on your own fork before Part 2.

## Getting started

### Before Part 1

- [Git](https://wiki.nushackers.org/orbital/git/setup) and a GitHub account
- [Node.js](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- [Cloudflare account](https://dash.cloudflare.com/login)
- [Supabase account](https://supabase.com/login)

`wrangler` is installed via `pnpm install` in `part-1/`; no separate global install needed.

### Before Part 2

- Completed Part 1 on **your fork** (deployed Worker + Supabase wired up)
- **Synced your fork with upstream** so `part-2/` is present locally (see [Get Part 2 updates](#get-part-2-updates))
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [OrbStack](https://orbstack.dev/) installed
- [Render](https://render.com/) account (free tier) for deploying vibe-search
- [Sentry](https://sentry.io/) account (free tier) for error monitoring
- Same fork from Part 1 (CI/CD pushes to your GitHub repo)

Optional for local Python dev: [uv](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`). Docker covers the container sections without a local Python install.

### Setup checklist

#### Step A: Fork (required for Part 2)

1. Open [hckr.cc/orbital-deployment-26](https://hckr.cc/orbital-deployment-26)
2. Click **Fork** (create your own copy under your GitHub account)
3. **Uncheck** "Copy the `main` branch only"
4. Do **not** clone the upstream workshop repo directly; you need **your fork** so Part 2 CI/CD can push to your GitHub repo

Not sure how to fork? Follow the [GitHub fork guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

**Checkpoint:** You see `github.com/<your-username>/orbital-26-deployment-workshop`.

#### Step B: Clone your fork

Copy the clone URL from the green **Code** button on your fork, then run:

```bash
git clone https://github.com/<your-username>/orbital-26-deployment-workshop.git
cd orbital-26-deployment-workshop
```

**Checkpoint:** `git remote -v` shows your fork as `origin`.

#### Step C: Repo layout

- [`part-1/`](part-1/) -- Color Swipe app and all Part 1 commands (`pnpm dev`, `pnpm deploy`, etc.)
- [`part-2/apps/web/`](part-2/apps/web/) -- Part 2 Color Swipe app (tests, CI/CD, Vibe Search proxy)
- [`part-2/apps/vibe-search/`](part-2/apps/vibe-search/) -- FastAPI container service
- [`part-2/docker-compose.yaml`](part-2/docker-compose.yaml) -- local multi-container setup
- [`slides/`](slides/) -- Slidev deck (presenters only; participants use the [hosted deck](https://hckr.cc/orbital-deployment-slides))
- [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) -- follow this during Part 1
- [`part-2/WORKSHOP.md`](part-2/WORKSHOP.md) -- follow this during Part 2

#### Step D: Install and run Part 1

```bash
cd part-1
pnpm install
pnpm dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

**Checkpoint:** App loads (empty state is expected until Supabase is set up).

Continue with [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) for deploy, Supabase, and storage steps.

#### Step E: Install and run Part 2

After Part 1 and a fork sync, set up the Part 2 web app:

```bash
cd part-2/apps/web
pnpm install
pnpm dev
```

Run tests:

```bash
pnpm test                              # Vitest (12 tests in the completed repo)
pnpm exec playwright install --with-deps chromium
pnpm test:e2e                          # Playwright smoke test
```

For the vibe-search service (containers section):

```bash
cd part-2/apps/vibe-search
docker build -t color-vibe-search .
docker run -p 8000:8000 color-vibe-search
```

Or start vibe-search + Postgres together:

```bash
cd part-2
docker compose up
```

**Checkpoint:** App loads at `http://localhost:5173`, `pnpm test` passes, and `http://localhost:8000/docs` loads after the container starts.

Continue with [`part-2/WORKSHOP.md`](part-2/WORKSHOP.md) for the full Part 2 walkthrough.

#### Get Part 2 updates

Part 2 lives in [`part-2/`](part-2/) on the upstream workshop repo ([`nushackers/orbital-26-deployment-workshop`](https://github.com/nushackers/orbital-26-deployment-workshop)). Your fork does not update automatically.

Sync before Part 2 (and again if the presenter announces a last-minute push during the session).

**Option 1: Sync on GitHub (easiest)**

1. Open your fork on GitHub (`github.com/<your-username>/orbital-26-deployment-workshop`)
2. If GitHub shows **"This branch is X commits behind nushackers/orbital-26-deployment-workshop"**, click **Sync fork** > **Update branch**
3. On your machine, pull the updated fork:

```bash
cd orbital-26-deployment-workshop
git pull origin main
```

**Option 2: Sync from the terminal**

One-time setup (add the workshop repo as `upstream`):

```bash
git remote add upstream https://github.com/nushackers/orbital-26-deployment-workshop.git
```

Before Part 2 (repeat whenever we publish new materials):

```bash
git fetch upstream
git merge upstream/main
git push origin main
```

**Slides:** Part 2 slides are on the hosted deck at [hckr.cc/orbital-deployment-slides](https://hckr.cc/orbital-deployment-slides). You do not need to run the slides locally unless you want to.

**Checkpoint:** After syncing, you see `part-2/apps/web/`, `part-2/apps/vibe-search/`, and `part-2/WORKSHOP.md`.

Reference: [GitHub: Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

### How to follow along

During the live session:

1. **Slides:** [hckr.cc/orbital-deployment-slides](https://hckr.cc/orbital-deployment-slides) (or scan the QR above)
2. **Code:** terminal open in your cloned fork (`part-1/` for Part 1, `part-2/apps/web/` for Part 2)
3. **Steps:** [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) (Part 1) or [`part-2/WORKSHOP.md`](part-2/WORKSHOP.md) (Part 2)
4. **Before Part 2:** sync your fork with upstream ([Get Part 2 updates](#get-part-2-updates))
5. **Help:** Zoom chat during session; [Padlet](#got-stuck) after

Keep `.dev.vars`, `.env`, and API keys out of Git.

### Got stuck?

If you get stuck, we recommend the following:

1. If you are currently in the workshop, ask for help in the Zoom chat
2. Otherwise, add a question to our [Padlet](https://padlet.com/tiencheng/orbital-26-deployment-workshop-gvj2qzmooyaoxk1o); we monitor it after each session and answer asynchronously
3. Part 1 feedback: [hckr.cc/orb26-deployment-p1-feedback](https://hckr.cc/orb26-deployment-p1-feedback)

## Credits

Built with Love by [NUS Hackers](https://www.nushackers.org/) 🦆
