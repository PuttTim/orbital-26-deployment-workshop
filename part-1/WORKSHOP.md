# Color Swipe — Workshop Flow

## Prerequisites

- Node.js + pnpm installed
- Cloudflare account (free)
- Supabase account (free)
- Fork the repo at https://hckr.cc/orbital-deployment-26

---

## Step 1 — Run locally

```bash
cd part-1
pnpm install
pnpm dev
```

**What you see:** An empty state — "No colors found. Set up Supabase and run `pnpm migrate`." No cards yet because there's no data.

---

## Step 2 — Deploy to Cloudflare

```bash
pnpm wrangler login
pnpm wrangler whoami
pnpm deploy
```

**What you get:** A `workers.dev` URL. Open it — same empty state. The app is live on the internet.

**Check the API is live:**

```
https://your-project.your-subdomain.workers.dev/api/health
```

Returns `{ "ok": true, "service": "color-swipe" }`.

`/api/colors` returns `[]` — no database yet.

---

## Step 3 — Add Supabase (database)

### 3a. Get your Supabase keys

Go to **Supabase dashboard → Settings → API Keys** and copy:
- **Project URL** (looks like `https://abc123.supabase.co`)
- **Publishable key** (starts with `sb_publishable_...`)

Paste them into `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars:
#   SUPABASE_URL=https://abc123.supabase.co
#   SUPABASE_KEY=sb_publishable_...
```

### 3b. Create the table and seed data

```bash
pnpm migrate
```

The first time, it prints the SQL + a link to your project's SQL Editor. Copy the SQL, paste into the editor, click **Run**, then re-run `pnpm migrate`. It seeds 20 colors.

### 3c. Set secrets and redeploy

```bash
pnpm wrangler secret put SUPABASE_URL
pnpm wrangler secret put SUPABASE_KEY
pnpm deploy
```

**What changes:** Cards appear with the color name and hex code on a white background. The visual color is NOT rendered — that comes from R2 next. Swiping sends real votes to Supabase.

---

## Step 4 — Add R2 (file storage)

### 4a. Create the bucket

```bash
pnpm wrangler r2 bucket create color-swipe-images
```

### 4b. Add R2 binding to `wrangler.jsonc`

```jsonc
{
  // ... existing config ...
  "r2_buckets": [
    {
      "binding": "FILES",
      "bucket_name": "color-swipe-images"
    }
  ]
}
```

### 4c. Generate images and upload

```bash
pnpm seed-r2
```

Reads colors from Supabase, generates SVGs locally, uploads to the R2 bucket using `pnpm wrangler r2 object put`, then updates the `image_key` in Supabase.

### 4d. Redeploy

```bash
pnpm deploy
```

**What changes:** Cards now show colored SVG images served from R2. The app's color visuals always come from R2, never from CSS.

---

## Scripts reference

| Command | What it does | Needs |
|---|---|---|
| `pnpm dev` | Start Vite dev server | — |
| `pnpm deploy` | Build + deploy to Workers | wrangler logged in |
| `pnpm migrate` | Create table + seed 20 colors | `.dev.vars` with Supabase creds |
| `pnpm seed-r2` | Generate SVGs + upload to R2 | `.dev.vars` + R2 bucket exists |

All scripts read credentials from `.dev.vars` automatically.
