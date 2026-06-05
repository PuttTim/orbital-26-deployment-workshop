import { describe, expect, it, vi, beforeEach } from "vitest";
import type { MiddlewareHandler } from "hono";
import { app } from "../../src/worker";
import * as Sentry from "@sentry/cloudflare";

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

const sentryScope = vi.hoisted(() => ({
	setTag: vi.fn(),
	setContext: vi.fn(),
}));

vi.mock("@sentry/cloudflare", () => ({
	captureException: vi.fn(),
	withScope: vi.fn((callback) =>
		callback({
			setTag: sentryScope.setTag,
			setContext: sentryScope.setContext,
		}),
	),
}));

vi.mock("@sentry/hono/cloudflare", () => ({
	sentry: vi.fn(
		(): MiddlewareHandler => async (_c, next) => {
			await next();
		},
	),
}));

describe("GET /api/health", () => {
	it("returns ok status and service name", async () => {
		const res = await app.request("/api/health");
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual({ ok: true, service: "color-swipe" });
	});
});

describe("GET /api/debug-sentry", () => {
	it("is disabled by default", async () => {
		const res = await app.request("/api/debug-sentry", {}, {});

		expect(res.status).toBe(404);
	});

	it("returns a server error when explicitly enabled", async () => {
		const res = await app.request(
			"/api/debug-sentry",
			{},
			{ SENTRY_DEBUG_ENABLED: "true" },
		);

		expect(res.status).toBe(500);
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
		sentryScope.setTag.mockClear();
		sentryScope.setContext.mockClear();
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
					"X-Internal-Api-Key": "secret-key",
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

	it("captures upstream failures and returns a safe error", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ detail: "Invalid API key" }), {
				status: 401,
				statusText: "Unauthorized",
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const res = await app.request(
			"/api/vibe-search",
			{
				method: "POST",
				body: JSON.stringify({ query: "ocean breeze" }),
				headers: { "Content-Type": "application/json" },
			},
			{
				VIBE_SEARCH_URL: "https://vibe-search.example.com",
				VIBE_SEARCH_API_KEY: "secret-key",
			},
		);
		const body = await res.json();

		expect(res.status).toBe(502);
		expect(body).toEqual({ error: "Search service unavailable" });
		expect(Sentry.captureException).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Vibe Search upstream request failed",
			}),
		);
		expect(sentryScope.setTag).toHaveBeenCalledWith(
			"upstream_service",
			"vibe-search",
		);
		expect(sentryScope.setTag).toHaveBeenCalledWith("upstream_status", "401");
		expect(sentryScope.setContext).toHaveBeenCalledWith(
			"vibe_search",
			expect.objectContaining({
				request_path: "/api/vibe-search",
				upstream_status: 401,
				query: "ocean breeze",
			}),
		);

		vi.unstubAllGlobals();
	});
});
