import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/cloudflare";

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

export const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/health", (c) => {
  return c.json({ ok: true, service: "color-swipe" });
});

app.get("/api/debug-sentry", (c) => {
  if (c.env.SENTRY_DEBUG_ENABLED !== "true") {
    return c.notFound();
  }

  throw new Error("Testing Sentry integration from Cloudflare Worker");
});

app.get("/api/colors", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json([], 200);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from("colors")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.post("/api/vote", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json({ ok: true });
  }

  const { colorId, direction } = await c.req.json<{
    colorId: string;
    direction: "up" | "down";
  }>();

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const column = direction === "up" ? "upvotes" : "downvotes";

  const { error } = await supabase.rpc("increment_vote", {
    color_id: colorId,
    column_name: column,
  });

  if (error) {
    const { data: current } = await supabase
      .from("colors")
      .select("*")
      .eq("id", colorId)
      .single();

    if (!current) return c.json({ error: "Color not found" }, 404);

    const count = (current as Record<string, number>)[column] + 1;
    const { error: updateError } = await supabase
      .from("colors")
      .update({ [column]: count })
      .eq("id", colorId);

    if (updateError) return c.json({ error: updateError.message }, 500);
    return c.json({ ok: true });
  }

  return c.json({ ok: true });
});

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
      ...(VIBE_SEARCH_API_KEY ? { "X-API-Key": VIBE_SEARCH_API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
});

app.get("/api/results", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json([], 200);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from("colors")
    .select("*")
    .order("upvotes", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.get("/api/images/:key", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) return c.notFound();

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase.storage
    .from("color-swipe-images")
    .download(`colors/${c.req.param("key")}`);

  if (error || !data) return c.notFound();

  return new Response(data, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
});

const handler = {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Bindings>;

export default Sentry.withSentry<Bindings>(
  (env) => {
    if (!env.SENTRY_DSN) return undefined;

    return {
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT ?? "production",
      tracesSampleRate: 0.1,
    };
  },
  handler,
);
