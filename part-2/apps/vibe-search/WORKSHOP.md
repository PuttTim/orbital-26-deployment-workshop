# Vibe Search

This is the standalone FastAPI service for the Part 2 container demo. It accepts
a sentence and returns the colors whose names and vibe descriptions are closest
to that sentence.

## Run locally

```bash
cd part-2/apps/vibe-search
uv sync
uv run uvicorn app.main:app --reload
```

Open <http://localhost:8000/docs>.

Test the endpoint:

```bash
curl -X POST http://localhost:8000/api/vibe-search \
  -H "Content-Type: application/json" \
  -d '{"query": "ocean breeze"}'
```

The first search is slower because the service lazily downloads and loads
`all-MiniLM-L6-v2`.

## Docker: lazy model loading

```bash
docker build -t color-vibe-search .
docker run -p 8000:8000 color-vibe-search
```

Open <http://localhost:8000/docs>, then run the same `curl` command above.

## Docker: preloaded model reference

Compare the starting Dockerfile with the preloaded version:

```bash
diff -u Dockerfile Dockerfile.preload
```

Build the preloaded image:

```bash
docker build -f Dockerfile.preload -t color-vibe-search:preload .
docker run -p 8000:8000 color-vibe-search:preload
```

In this version, the model download happens during `docker build`, so the first
request is more predictable.

## Tests

```bash
uv run pytest
```

Tests use a fake embedding model so they do not need to download PyTorch or the
sentence transformer model.

## GitHub Actions

This repo includes `.github/workflows/test-vibe-search.yaml`. It runs the same
unit tests on pushes and pull requests that touch `part-2/apps/vibe-search/**`.
The workflow installs `uv`, syncs dependencies from `uv.lock`, and runs:

```bash
uv run pytest
```

There is also an optional manual deploy workflow at
`.github/workflows/deploy-vibe-search.yaml`. It runs tests first, then builds
and pushes a `linux/amd64` Docker image to GHCR, then triggers a Render deploy
hook.

To use it:

1. Create an image-backed Render service that points at
   `ghcr.io/<your-github-username>/color-vibe-search:latest`.
   If the GHCR package is private, either make it public or configure private
   registry credentials in Render.
2. Add the service's deploy hook URL as a GitHub Actions secret named
   `RENDER_DEPLOY_HOOK_URL`.
3. Run **Deploy Vibe Search** manually from the GitHub Actions tab.

The workflow includes a commented `push` trigger. Uncomment it when you want
pushes to `main` or `master` to deploy automatically.

## Lockdown patch

The starter service is intentionally public so the first local and Render demos
can call it directly. Later, add the internal API key check from the slides:

```python
from fastapi import Depends

from app.api.dependencies import require_internal_api_key


@app.post("/api/vibe-search", dependencies=[Depends(require_internal_api_key)])
def vibe_search(request: VibeSearchRequest):
    ...
```
