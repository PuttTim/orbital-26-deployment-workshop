import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { imageUrl, searchVibes } from "../../src/lib/api";

beforeEach(() => {
	vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

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

describe("searchVibes", () => {
	it("posts the query to the vibe search API route", async () => {
		const response = {
			query: "rainy cyberpunk night",
			model: "test-model",
			results: [{ name: "Neon Blue", hex: "#00f5ff", score: 0.92 }],
		};

		vi.mocked(fetch).mockResolvedValue(
			new Response(JSON.stringify(response), {
				headers: { "Content-Type": "application/json" },
			}),
		);

		await expect(searchVibes("rainy cyberpunk night")).resolves.toEqual(
			response,
		);
		expect(fetch).toHaveBeenCalledWith("/api/vibe-search", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: "rainy cyberpunk night" }),
		});
	});
});
