import { useCallback, useState } from "react";
import { searchVibes, type VibeSearchResult } from "../lib/api";

type Status = "idle" | "loading" | "ready" | "unavailable";

export function VibeSearch() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<VibeSearchResult | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      setStatus("loading");
      setResult(null);

      try {
        const data = await searchVibes(trimmedQuery);
        const [topResult] = data.results;
        if (!topResult) {
          setStatus("unavailable");
          return;
        }

        setResult(topResult);
        setStatus("ready");
      } catch {
        setStatus("unavailable");
      }
    },
    [query],
  );

  return (
    <section className="vibe-search" aria-label="Vibe Search">
      <form className="vibe-search-form" onSubmit={handleSubmit}>
        <input
          className="vibe-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="rainy cyberpunk night"
          aria-label="Search for a color by vibe"
        />
        <button
          className="vibe-search-button"
          type="submit"
          disabled={status === "loading" || query.trim().length === 0}
        >
          {status === "loading" ? "Searching" : "Vibe Search"}
        </button>
      </form>

      {status === "idle" && (
        <p className="vibe-search-status">Comes online after Part 2.</p>
      )}

      {status === "unavailable" && (
        <p className="vibe-search-status">
          Vibe Search comes online after Part 2.
        </p>
      )}

      {status === "ready" && result && (
        <div className="vibe-search-result">
          <div
            className="vibe-search-swatch"
            style={{ backgroundColor: result.hex }}
          />
          <div className="vibe-search-copy">
            <span className="vibe-search-label">Best vibe match</span>
            <strong>{result.name}</strong>
            <span>{result.hex}</span>
          </div>
          <span className="vibe-search-score">
            {(result.score * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </section>
  );
}
