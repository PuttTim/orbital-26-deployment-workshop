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

<img src="slides/public/qr/orbital-deployment-slides-qr-code.webp" alt="Slide deck QR code" width="160" />

## Schedule

- **Part 1:** Saturday, 30 May 2026, 1:00pm to 3:00pm — deploy from localhost to the internet ([`part-1/WORKSHOP.md`](part-1/WORKSHOP.md))
- **Part 2:** Saturday, 6 June 2026, 10:00am to 12:00pm — CI/CD, testing, Docker, and production-ready deployment (builds on Part 1)

Missed Part 1 live? You can catch up on-demand via [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) before Part 2.

**Important:** Part 2 code and slides are not in the repo yet. If you fork during Part 1, you will need to **sync your fork with upstream** before Part 2 to get the new materials. See [Get Part 2 updates](#get-part-2-updates) below.

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

For Part 2 of the workshop, we will build on the deployed app from Part 1 and focus on making deployment more reliable and production-ready.

We will cover:

- Testing deployed applications
- Unit testing
- CI/CD with GitHub Actions
- Containerisation with Docker
- Deploying a containerised backend
- Optional: Monitoring and telemetry

You must complete Part 1 on your own fork before Part 2. Part 2 exercises are not in the repo yet; sync your fork with upstream before the session to get them.

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
- **Synced your fork with upstream** so Part 2 code is present locally (see [Get Part 2 updates](#get-part-2-updates))
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or equivalent) installed
- Same fork from Part 1 (CI/CD needs your repo)

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

- [`part-1/`](part-1/) — Color Swipe app and all Part 1 commands (`pnpm dev`, `pnpm deploy`, etc.)
- [`slides/`](slides/) — Slidev deck (presenters only; participants use the [hosted deck](https://hckr.cc/orbital-deployment-slides))
- [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) — follow this during Part 1

#### Step D: Install and run Part 1

```bash
cd part-1
pnpm install
pnpm dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

**Checkpoint:** App loads (empty state is expected until Supabase is set up).

Continue with [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) for deploy, Supabase, and storage steps.

#### Get Part 2 updates

Part 2 exercises and repo changes will land on the upstream workshop repo ([`nushackers/orbital-26-deployment-workshop`](https://github.com/nushackers/orbital-26-deployment-workshop)) after Part 1. Your fork does not update automatically.

Sync **on the morning of Part 2** (or the night before), and again if the presenter announces a last-minute push during the session.

**Option 1: Sync on GitHub (easiest)**

1. Open your fork on GitHub (`github.com/<your-username>/orbital-26-deployment-workshop`)
2. If GitHub shows **"This branch is X commits behind nushackers/orbital-26-deployment-workshop"**, click **Sync fork** → **Update branch**
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

**Slides:** The hosted deck at [hckr.cc/orbital-deployment-slides](https://hckr.cc/orbital-deployment-slides) will be redeployed when Part 2 slides are ready. You do not need to run the slides locally unless you want to.

**Checkpoint:** You see new Part 2 files (e.g. `part-2/` or updated docs) after syncing.

Reference: [GitHub: Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

### How to follow along

During the live session:

1. **Slides:** [hckr.cc/orbital-deployment-slides](https://hckr.cc/orbital-deployment-slides) (or scan the QR above). Part 2 slides will appear here when published; no local slide setup needed.
2. **Code:** terminal open in your cloned fork (`part-1/` for Part 1; `part-2/` once synced for Part 2)
3. **Steps:** switch to [`part-1/WORKSHOP.md`](part-1/WORKSHOP.md) (Part 1) or the Part 2 guide when available
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
