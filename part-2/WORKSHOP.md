# Part 2: Testing, CI/CD, Containers, and Monitoring

This guide walks you through every hands-on step of Part 2. Use it as a reference if you get stuck during the live session.

## Prerequisites

- Completed Part 1 (Color Swipe app deployed to Cloudflare Workers)
- Node.js + pnpm installed
- Docker Desktop or OrbStack installed
- GitHub account with your fork of this repository synced to upstream (see [Get Part 2 updates](../README.md#get-part-2-updates))
- [Render](https://render.com/) account (free tier)
- [Sentry](https://sentry.io/) account (free tier)

---

## Step 1: Set up the Part 2 workspace

```bash
cd part-2/apps/web
pnpm install
```

This installs the new test dependencies (Vitest, Playwright) alongside the existing app dependencies.

Verify the app still runs:

```bash
pnpm dev
```

Checkpoint:

- The React app opens at `localhost:5173`
- Colors load from Supabase (if you completed Part 1 Step 3+)

---

## Step 2: Write API unit tests

We use **Vitest** to test the Hono API routes. Tests run in Node.js with no server needed.

### 2a. Test the health endpoint

Open `tests/api/worker.test.ts`. The first test checks the `/api/health` route:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import { app } from "../../src/worker";

// Mock Supabase so tests don't need a real database
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockFrom = vi.fn(() => ({
  select: mockSelect,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

describe("GET /api/health", () => {
  it("returns ok status and service name", async () => {
    const res = await app.request("/api/health");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true, service: "color-swipe" });
  });
});
```

Key concepts:

- `app.request()` is Hono's built-in test helper. It simulates an HTTP request without starting a server.
- `vi.mock()` replaces the Supabase client with a mock so tests run fast and don't need network access.
- `describe` and `it` group and define individual test cases.

### 2b. Test the colors endpoint

Add a second `describe` block to the same file:

```ts
describe("GET /api/colors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns colors from Supabase", async () => {
    const mockColors = [
      { id: "1", name: "Red", hex: "#FF0000", upvotes: 5, downvotes: 2 },
      { id: "2", name: "Blue", hex: "#0000FF", upvotes: 3, downvotes: 1 },
    ];

    mockOrder.mockResolvedValue({ data: mockColors, error: null });
    mockSelect.mockReturnValue({ order: mockOrder });

    const res = await app.request("/api/colors", {}, {
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_KEY: "test-key",
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(mockColors);
  });

  it("returns empty array when Supabase is not configured", async () => {
    const res = await app.request("/api/colors", {}, {});
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });
});
```

Key concepts:

- The third argument to `app.request()` passes environment bindings (like `c.env` in the worker).
- `beforeEach` + `vi.clearAllMocks()` resets mock state between tests.
- We test both the happy path (Supabase configured) and the edge case (no credentials).

### 2c. Run the tests

```bash
pnpm test
```

Checkpoint:

- All 3 tests pass
- Output shows `✓ GET /api/health > returns ok status and service name`
- Output shows `✓ GET /api/colors > returns colors from Supabase`
- Output shows `✓ GET /api/colors > returns empty array when Supabase is not configured`

---

## Step 3: Write API client tests

The `src/lib/api.ts` file has helper functions that the React components use to call the API. Let's test the simplest one: `imageUrl`.

Open `tests/client/api.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { imageUrl } from "../../src/lib/api";

describe("imageUrl", () => {
  it("returns the correct API path for a given key", () => {
    const url = imageUrl("red.svg");
    expect(url).toBe("/api/images/red.svg");
  });

  it("handles keys with subdirectories", () => {
    const url = imageUrl("colors/blue.svg");
    expect(url).toBe("/api/images/colors/blue.svg");
  });
});
```

Run all tests again:

```bash
pnpm test
```

Checkpoint:

- The tests you wrote so far all pass (3 API + 2 client)
- The completed repo includes more tests (12 total) for colors, Vibe Search, and Sentry

---

## Step 4: Write a Playwright E2E smoke test

Playwright runs a real browser against a real server. Our smoke test:

1. Opens the app
2. Waits for a color card to appear
3. Swipes right (like) once

Open `tests/e2e/smoke.test.ts`:

```ts
import { test, expect } from "@playwright/test";

test("smoke test: load page, verify color card, swipe once", async ({ page }) => {
  await page.goto("/");

  await page.waitForSelector(".card", { timeout: 10_000 });

  const card = page.locator(".deck .card").first();
  await expect(card).toBeVisible();

  const box = await card.boundingBox();
  if (!box) throw new Error("Card not found");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width + 300, box.y + box.height / 2, {
    steps: 10,
  });
  await page.mouse.up();

  await page.waitForTimeout(500);
});
```

Key concepts:

- `page.goto("/")` navigates to the app
- `waitForSelector(".card")` waits for a color card to render before interacting
- `boundingBox` + mouse actions simulate a real drag/swipe gesture
- The `webServer` config in `playwright.config.ts` automatically starts `pnpm dev` before tests

### 4a. Install Playwright browsers

```bash
pnpm exec playwright install --with-deps chromium
```

### 4b. Run the E2E test

```bash
pnpm test:e2e
```

Checkpoint:

- Playwright opens a browser window
- The Color Swipe app loads
- A color card is swiped off-screen
- Test passes

---

## Step 5: Set up CI/CD with GitHub Actions

Now let's automate all of this. Every time you push code, GitHub Actions will run your tests and deploy to Cloudflare.

### 5a. Open the workflow template

Open `.github/workflows/deploy-color-swipe.yml` in the repo root. It has `____` blanks for you to fill in.

### 5b. Fill in the triggers

Replace the `____` in the `on:` section:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

This means:
- **Push to main**: runs tests + deploys
- **Pull request**: runs tests only (deploy is gated later)

### 5c. Fill in the test steps

Replace the `____` in the test job:

```yaml
      - name: Run tests
        run: pnpm test

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run E2E tests
        run: pnpm test:e2e
```

### 5d. Fill in the deploy condition and step

Replace the `____` in the deploy job:

```yaml
    if: github.ref == 'refs/heads/main'
```

This ensures the deploy job only runs on pushes to `main`, not on PRs.

```yaml
      - name: Deploy
        run: pnpm deploy
```

### 5e. Commit and push the workflow

```bash
git add .github/workflows/deploy-color-swipe.yml
git commit -m "ci: add CI/CD pipeline for color-swipe"
git push
```

---

## Step 6: Configure GitHub secrets

Your workflow needs credentials to deploy. Add them as repository secrets:

1. Go to your fork on GitHub > **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret** and add each one:

| Secret name | Value | Where to get it |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | API token with Workers deploy permissions | [Cloudflare dashboard > My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens) > Create Token > Edit Cloudflare Workers > Use template |
| `SUPABASE_URL` | Your Supabase project URL | Supabase dashboard > Settings > API |
| `SUPABASE_KEY` | Your Supabase publishable key | Supabase dashboard > Settings > API |

Checkpoint:

- All three secrets are configured in GitHub

---

## Step 7: Trigger the pipeline

Push a change to `main` (or merge a PR):

```bash
git add -A
git commit -m "feat: add tests and CI/CD pipeline"
git push origin main
```

Then go to your fork on GitHub > **Actions** tab.

Checkpoint:

- The workflow appears in the Actions tab
- The `test` job runs and all tests pass
- The `deploy` job runs and deploys to Cloudflare Workers
- Your app is live at the same `workers.dev` URL from Part 1

---

## Step 8: Build and run the Vibe Search container

Now we switch to the Python microservice. Vibe Search accepts a sentence and returns the colors whose names best match that sentence, powered by the `all-MiniLM-L6-v2` sentence transformer model.

### 8a. Build the Docker image

```bash
cd part-2/apps/vibe-search
docker build -t color-vibe-search .
docker run -p 8000:8000 color-vibe-search
```

Open <http://localhost:8000/docs> in your browser.

Test the endpoint:

```bash
curl -X POST http://localhost:8000/api/vibe-search \
  -H "Content-Type: application/json" \
  -d '{"query": "ocean breeze"}'
```

The first search is slower because the service lazily downloads and loads the model at runtime.

Checkpoint:

- FastAPI docs page loads at `http://localhost:8000/docs`
- The `curl` command returns ranked color results
- The first response takes a few seconds while the model downloads

### 8b. Pre-load the model (optional)

The starter Dockerfile downloads the model on the first request. You can shift that cost to build time instead.

Compare the starter and preloaded Dockerfiles:

```bash
diff -u Dockerfile Dockerfile.preload
```

Build the preloaded image:

```bash
docker build -f Dockerfile.preload -t color-vibe-search:preload .
docker run -p 8000:8000 color-vibe-search:preload
```

In this version, the model download happens during `docker build`, so the first request is fast and predictable. The tradeoff is a larger image.

---

## Step 9: Deploy Vibe Search to Render

1. Go to [render.com](https://render.com) > **New** > **Web Service**
2. Connect your GitHub repo
3. Set **Language** to **Docker**
4. Set **Root Directory** to `part-2/apps/vibe-search`
5. Instance type: **Free**
6. Deploy

Render builds the image from the Dockerfile in your repo and redeploys when you push changes.

Checkpoint:

- Render gives you a public URL
- `https://<your-service>.onrender.com/docs` loads the FastAPI Swagger UI
- `POST /api/vibe-search` returns results

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after spindown takes around 30 seconds. This is a container cold start.

---

## Step 10: Connect Vibe Search to Color Swipe

The Color Swipe frontend already has a Vibe Search input box. It calls `POST /api/vibe-search` on the Worker, but that route does nothing useful until the Worker proxies the request to Render.

### 10a. Set Worker secrets

Generate an internal API key and configure both services:

```bash
cd part-2/apps/web

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# copy this value for both Render and Cloudflare

pnpm wrangler secret put VIBE_SEARCH_URL
# paste: https://<your-service>.onrender.com

pnpm wrangler secret put VIBE_SEARCH_API_KEY
# paste the generated value
```

### 10b. Add the bindings type

Add the new bindings to the Worker `Bindings` type in `src/worker.ts`:

```ts
type Bindings = {
  ASSETS: { fetch: typeof fetch };
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
  VIBE_SEARCH_URL?: string;
  VIBE_SEARCH_API_KEY?: string;
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
  SENTRY_DEBUG_ENABLED?: string;
};
```

### 10c. Add the proxy route

Add this route in `src/worker.ts`:

```ts
app.post("/api/vibe-search", async (c) => {
  const { VIBE_SEARCH_URL, VIBE_SEARCH_API_KEY } = c.env;
  if (!VIBE_SEARCH_URL) {
    return c.json({ error: "Vibe Search is not configured" }, 503);
  }

  const body = await c.req.json();
  const res = await fetch(`${VIBE_SEARCH_URL}/api/vibe-search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(VIBE_SEARCH_API_KEY
        ? { "X-Internal-Api-Key": VIBE_SEARCH_API_KEY }
        : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return c.json({ error: "Search service unavailable" }, 502);
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
});
```

### 10d. Redeploy Color Swipe

```bash
cd part-2/apps/web
pnpm run deploy
```

The browser never talks to Render directly. The Worker acts as a proxy.

Checkpoint:

- Vibe Search works in the deployed Color Swipe app
- Typing a phrase like "ocean breeze" returns matching colors

---

## Step 11: Lock down Vibe Search

The Vibe Search service is still publicly accessible if someone knows the Render URL. Let's fix that.

Add the same generated API key as an environment variable in Render:

1. Open your Render service dashboard
2. Go to **Environment**
3. Add `VIBE_SEARCH_API_KEY` with the same value you generated earlier
4. Save and redeploy

The route in `app/api/routes.py` already enforces the key via a dependency:

```python
from fastapi import APIRouter, Depends

from app.api.dependencies import require_internal_api_key
from app.models import VibeSearchRequest, VibeSearchResponse
from app.services.vibe_search import search_colors

router = APIRouter(prefix="/api")


@router.post("/vibe-search", dependencies=[Depends(require_internal_api_key)])
def vibe_search(request: VibeSearchRequest) -> VibeSearchResponse:
    return search_colors(request.query)
```

Once `VIBE_SEARCH_API_KEY` is set, requests without a matching `X-Internal-Api-Key` header are rejected with a 401.

Checkpoint:

- Direct `curl` to the Render URL without the header returns 401
- Vibe Search still works through the Color Swipe app (the Worker sends the header)

---

## Step 12: Docker Compose for local dev

You now have two services running locally: `pnpm dev` for the Worker and `docker run` for the FastAPI container. Docker Compose lets you define and run multiple containers with one command.

```bash
cd part-2
docker compose up
```

This starts the Vibe Search service and a local Postgres instance together. The `docker-compose.yaml` defines both services, their ports, and a named volume for Postgres data.

Checkpoint:

- Both services start from one command
- `http://localhost:8000/docs` loads
- Postgres is reachable at `localhost:5432`

---

## Step 13: Set up Sentry for error monitoring

### 13a. Create Sentry projects

Go to [sentry.io](https://sentry.io) and sign in or create an account.

Create **two projects**:

| App | Platform | Suggested project name |
| --- | --- | --- |
| Cloudflare Worker | Cloudflare Workers | `color-swipe-worker` |
| FastAPI service | Python / FastAPI | `vibe-search-api` |

Copy the **DSN** from each project (Settings > Client Keys).

### 13b. Set up Sentry for FastAPI

In the vibe-search service, Sentry initialization goes in your FastAPI app entry point:

```python
import os
import sentry_sdk
from fastapi import FastAPI

if os.environ.get("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.environ["SENTRY_DSN"],
        environment=os.environ.get("SENTRY_ENVIRONMENT", "production"),
        traces_sample_rate=0.1,
    )

app = FastAPI()
```

Store the DSN locally and on Render:

**Local** (in `part-2/apps/vibe-search/.env`):

```text
SENTRY_DSN=<your vibe-search-api DSN>
SENTRY_ENVIRONMENT=development
```

**Render:**

1. Open your Render service > **Environment**
2. Add `SENTRY_DSN` (from the `vibe-search-api` project)
3. Add `SENTRY_ENVIRONMENT=production`
4. Save and redeploy

### 13c. Set up Sentry for Cloudflare Workers

Install the Sentry packages:

```bash
cd part-2/apps/web
pnpm add @sentry/cloudflare @sentry/hono
```

Add to `wrangler.jsonc`:

```jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "upload_source_maps": true
}
```

Add Hono middleware as the **first** middleware on your app in `src/worker.ts`:

```ts
import * as Sentry from "@sentry/cloudflare";
import { sentry } from "@sentry/hono/cloudflare";

app.use(
  sentry(app, (env) => ({
    dsn: env.SENTRY_DSN ?? "",
    enabled: Boolean(env.SENTRY_DSN),
    environment: env.SENTRY_ENVIRONMENT ?? "production",
    tracesSampleRate: 0.1,
  })),
);

export default app;
```

Store the DSN locally and in production:

**Local** (add to `part-2/apps/web/.dev.vars`):

```text
SENTRY_DSN=<your color-swipe-worker DSN>
SENTRY_ENVIRONMENT=development
```

**Production:**

```bash
cd part-2/apps/web
pnpm wrangler secret put SENTRY_DSN
pnpm wrangler secret put SENTRY_ENVIRONMENT
# paste "production" when prompted
```

Then redeploy:

```bash
pnpm run deploy
```

Checkpoint:

- Worker errors appear in the `color-swipe-worker` Sentry project
- FastAPI errors appear in the `vibe-search-api` Sentry project

---

## Step 14: Test Sentry with a deliberate bug

### 14a. Break Vibe Search on purpose

In `src/worker.ts`, find the proxy response at the end of the `/api/vibe-search` route:

```ts
return new Response(res.body, {
  status: res.status,
  headers: {
    "Content-Type": res.headers.get("Content-Type") ?? "application/json",
  },
});
```

Replace it with this buggy version that reads the wrong field name:

```ts
const data = (await res.json()) as {
  query: string;
  model: string;
  matches: unknown[];
  results: unknown[];
};
const topMatch = data.matches[0];

return c.json({
  ...data,
  results: [topMatch],
});
```

Deploy the broken code:

```bash
cd part-2/apps/web
pnpm run deploy
```

### 14b. Trigger the bug

Open your deployed Color Swipe app and type `ocean breeze` in the Vibe Search box.

What happens:

- The search starts but no result appears
- The UI falls back to a "not available" message

Now open Sentry > `color-swipe-worker` > **Issues**. You should see an error like `Cannot read properties of undefined` pointing at the `data.matches[0]` line.

### 14c. Fix and verify

Change the code back to returning the upstream response directly:

```ts
return new Response(res.body, {
  status: res.status,
  headers: {
    "Content-Type": res.headers.get("Content-Type") ?? "application/json",
  },
});
```

Redeploy:

```bash
cd part-2/apps/web
pnpm run deploy
```

Checkpoint:

- Vibe Search works again
- No new Sentry issue for the fixed request
- The old issue can be marked **Resolved** in Sentry

---

## Scripts reference

### Web app (`part-2/apps/web/`)

| Command | What it does | Needs |
|---|---|---|
| `pnpm test` | Run Vitest (API + client tests) | - |
| `pnpm test:watch` | Run Vitest in watch mode | - |
| `pnpm test:e2e` | Run Playwright E2E tests | Playwright browsers installed |
| `pnpm exec playwright install --with-deps chromium` | Install Playwright browsers | - |
| `pnpm dev` | Start Vite dev server | - |
| `pnpm deploy` | Build + deploy to Workers | wrangler logged in |

### Vibe Search (`part-2/apps/vibe-search/`)

| Command | What it does | Needs |
|---|---|---|
| `uv sync` | Install Python dependencies | uv installed |
| `uv run uvicorn app.main:app --reload` | Start FastAPI dev server | uv installed |
| `uv run pytest` | Run Python unit tests | uv installed |
| `docker build -t color-vibe-search .` | Build the Docker image | Docker |
| `docker run -p 8000:8000 color-vibe-search` | Run the container locally | Docker |
| `docker compose up` (from `part-2/`) | Run vibe-search + Postgres together | Docker |
