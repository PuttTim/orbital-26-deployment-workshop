import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";

type Bindings = {
  ASSETS: { fetch: typeof fetch };
  FILES?: R2Bucket;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/health", (c) => {
  return c.json({ ok: true, service: "color-swipe" });
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
  if (!c.env.FILES) return c.notFound();

  const key = c.req.param("key");
  const object = await c.env.FILES.get(`colors/${key}`);

  if (!object) return c.notFound();

  return new Response(object.body, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
});

app.post("/api/seed-images", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY, FILES } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json({ error: "Supabase not configured" }, 500);
  }
  if (!FILES) {
    return c.json({ error: "R2 bucket not bound" }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: colors, error } = await supabase
    .from("colors")
    .select("id, name, hex");

  if (error) return c.json({ error: error.message }, 500);
  if (!colors || colors.length === 0) {
    return c.json({ error: "No colors in database. Run pnpm migrate first." }, 400);
  }

  const results: string[] = [];
  for (const color of colors as { id: string; name: string; hex: string }[]) {
    const svg = generateSvg(color.name, color.hex);
    const filename = `${color.id}.svg`;

    await FILES.put(`colors/${filename}`, svg, {
      httpMetadata: { contentType: "image/svg+xml" },
    });

    const { error: updateError } = await supabase
      .from("colors")
      .update({ image_key: filename })
      .eq("id", color.id);

    if (updateError) {
      results.push(`FAILED: ${color.name} — ${updateError.message}`);
    } else {
      results.push(`✓ ${color.name} (${color.hex})`);
    }
  }

  return c.json({ ok: true, count: colors.length, results });
});

export default app;

function generateSvg(name: string, hex: string): string {
  const textColor = isLight(hex) ? "#1a1a1a" : "#ffffff";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="${hex}" rx="20"/>
  <text x="200" y="520" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="${textColor}">${name}</text>
  <text x="200" y="555" text-anchor="middle" font-family="monospace" font-size="16" fill="${textColor}" opacity="0.7">${hex}</text>
</svg>`;
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}
