export interface Color {
  id: string;
  name: string;
  hex: string;
  image_key: string;
  upvotes: number;
  downvotes: number;
}

export interface VibeSearchResult {
  name: string;
  hex: string;
  score: number;
}

export interface VibeSearchResponse {
  query: string;
  model: string;
  results: VibeSearchResult[];
}

const BASE = "/api";

export async function fetchColors(): Promise<Color[]> {
  const res = await fetch(`${BASE}/colors`);
  if (!res.ok) throw new Error("Failed to fetch colors");
  return res.json();
}

export async function vote(
  colorId: string,
  direction: "up" | "down",
): Promise<void> {
  await fetch(`${BASE}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ colorId, direction }),
  });
}

export async function fetchResults(): Promise<Color[]> {
  const res = await fetch(`${BASE}/results`);
  if (!res.ok) throw new Error("Failed to fetch results");
  return res.json();
}

export async function searchVibes(query: string): Promise<VibeSearchResponse> {
  const res = await fetch(`${BASE}/vibe-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error("Vibe Search is not available yet");
  return res.json();
}

export function imageUrl(key: string): string {
  return `${BASE}/images/${key}`;
}
