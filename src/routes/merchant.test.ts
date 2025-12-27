import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app.js";
import type { FastifyInstance } from "fastify";

describe("API Routes", () => {
	let app: FastifyInstance;

	beforeAll(async () => {
		app = await buildApp();
	});

	afterAll(async () => {
		await app.close();
	});

	describe("GET /health", () => {
		it("returns status ok", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/health",
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body);
			expect(body.status).toBe("ok");
			expect(typeof body.merchants).toBe("number");
			expect(body.merchants).toBeGreaterThan(0);
		});
	});

	describe("GET /", () => {
		it("returns same as /health", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/",
			});

			expect(response.statusCode).toBe(200);
			const body = JSON.parse(response.body);
			expect(body.status).toBe("ok");
		});
	});

	describe("GET /v1/merchant/resolve", () => {
		describe("successful matches", () => {
			it("resolves amazon", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/merchant/resolve?q=amazon",
				});

				expect(response.statusCode).toBe(200);
				const body = JSON.parse(response.body);
				expect(body.merchant_id).toBe("amazon");
				expect(body.name).toBe("Amazon");
				expect(body.confidence).toBeGreaterThanOrEqual(0.7);
			});

			it("resolves starbucks with noise", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/merchant/resolve?q=pos%20starbucks%20visa",
				});

				expect(response.statusCode).toBe(200);
				const body = JSON.parse(response.body);
				expect(body.merchant_id).toBe("starbucks");
			});

			it("resolves target store", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/merchant/resolve?q=target%20store%20t-3346",
				});

				expect(response.statusCode).toBe(200);
				const body = JSON.parse(response.body);
				expect(body.merchant_id).toBe("target");
			});
		});

		describe("real-world transaction strings", () => {
			const testCases = [
				{ input: "media markt tv-hifi-el", expected: "media-markt" },
				{ input: "micro center", expected: "micro-center" },
				{ input: "foot locker", expected: "foot-locker" },
				{ input: "anthropic", expected: "anthropic" },
				{ input: "openai *chatgpt subscr", expected: "openai" },
				{ input: "cursor usage aug", expected: "cursor" },
				{ input: "elevenlabs.io", expected: "elevenlabs" },
				{ input: "greptile", expected: "greptile" },
				{ input: "www.perplexity.ai", expected: "perplexity" },
				{ input: "cloudflare", expected: "cloudflare" },
				{ input: "hetzner online gmbh", expected: "hetzner" },
				{ input: "planetscale inc.", expected: "planetscale" },
				{ input: "upstash", expected: "upstash" },
				{ input: "vercel inc.", expected: "vercel" },
				{ input: "t3 chat", expected: "t3-chat" },
				{ input: "7-eleven 17635", expected: "7-eleven" },
				{ input: "narvesen 626 tromso lu", expected: "narvesen" },
			];

			testCases.forEach(({ input, expected }) => {
				it(`resolves "${input}" to ${expected}`, async () => {
					const response = await app.inject({
						method: "GET",
						url: `/v1/merchant/resolve?q=${encodeURIComponent(input)}`,
					});

					expect(response.statusCode).toBe(200);
					const body = JSON.parse(response.body);
					expect(body.merchant_id).toBe(expected);
				});
			});
		});

		describe("no match scenarios", () => {
			it("returns low confidence for unknown merchant", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/merchant/resolve?q=qqqwwweeerrrttt",
				});

				expect(response.statusCode).toBe(200);
				const body = JSON.parse(response.body);
				// Even with low confidence matches, the API may return a best guess
				// What matters is that the confidence is below threshold (0.70)
				expect(typeof body.confidence).toBe("number");
				if (body.merchant_id !== null) {
					expect(body.confidence).toBeLessThan(0.7);
				}
			});
		});

		describe("validation", () => {
			it("returns 400 for missing q parameter", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/merchant/resolve",
				});

				expect(response.statusCode).toBe(400);
			});

			it("returns 400 for empty q parameter", async () => {
				const response = await app.inject({
					method: "GET",
					url: "/v1/merchant/resolve?q=",
				});

				expect(response.statusCode).toBe(400);
			});
		});
	});
});
