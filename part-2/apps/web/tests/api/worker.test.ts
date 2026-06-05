import { describe, expect, it, vi, beforeEach } from "vitest";
import app from "../../src/worker";

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
		expect(mockFrom).toHaveBeenCalledWith("colors");
		expect(mockSelect).toHaveBeenCalledWith("*");
		expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: true });
	});

	it("returns empty array when Supabase is not configured", async () => {
		const res = await app.request("/api/colors", {}, {});
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual([]);
	});
});

describe("POST /api/vibe-search", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns unavailable when Vibe Search is not configured", async () => {
		const res = await app.request(
			"/api/vibe-search",
			{
				method: "POST",
				body: JSON.stringify({ query: "ocean sunrise" }),
				headers: { "Content-Type": "application/json" },
			},
			{},
		);
		const body = await res.json();

		expect(res.status).toBe(503);
		expect(body).toEqual({ error: "Vibe Search is not configured" });
	});

	it("forwards Vibe Search requests to the configured service", async () => {
		const vibeResponse = {
			query: "ocean sunrise",
			model: "test-model",
			results: [{ name: "Blue", hex: "#0000FF", score: 0.91 }],
		};
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(vibeResponse), {
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const res = await app.request(
			"/api/vibe-search",
			{
				method: "POST",
				body: JSON.stringify({ query: "ocean sunrise" }),
				headers: { "Content-Type": "application/json" },
			},
			{
				VIBE_SEARCH_URL: "https://vibe-search.example.com",
				VIBE_SEARCH_API_KEY: "secret-key",
			},
		);
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual(vibeResponse);
		expect(fetchMock).toHaveBeenCalledWith(
			"https://vibe-search.example.com/api/vibe-search",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": "secret-key",
				},
				body: JSON.stringify({ query: "ocean sunrise" }),
			},
		);

		vi.unstubAllGlobals();
	});

	it("supports no-auth Vibe Search services", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					query: "forest trail",
					model: "test-model",
					results: [{ name: "Green", hex: "#00FF00", score: 0.88 }],
				}),
				{ headers: { "Content-Type": "application/json" } },
			),
		);
		vi.stubGlobal("fetch", fetchMock);

		const res = await app.request(
			"/api/vibe-search",
			{
				method: "POST",
				body: JSON.stringify({ query: "forest trail" }),
				headers: { "Content-Type": "application/json" },
			},
			{
				VIBE_SEARCH_URL: "https://vibe-search.example.com",
			},
		);

		expect(res.status).toBe(200);
		expect(fetchMock).toHaveBeenCalledWith(
			"https://vibe-search.example.com/api/vibe-search",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query: "forest trail" }),
			},
		);

		vi.unstubAllGlobals();
	});
});
