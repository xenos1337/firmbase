import { describe, it, expect, beforeAll } from "vitest";
import { resolveMerchant } from "./matcher.js";
import type { Merchant } from "../schemas/merchant.schema.js";

// Create a minimal test merchant set
function createTestMerchants(): Map<string, Merchant> {
	const merchants = new Map<string, Merchant>();

	merchants.set("amazon", {
		id: "amazon",
		name: "Amazon",
		category: "SHOPPING",
		subcategory: "E_COMMERCE",
		website: "https://amazon.com",
		logo_hint: { type: "DOMAIN", value: "amazon.com" },
		merchant_channel: "HYBRID",
		merchant_scope: "GLOBAL",
		subscription_likely: false,
		is_marketplace: true,
		risk_level: "LOW",
		aliases: ["amazon", "amazon com", "amzn", "amzn mktp"],
		regex: ["^amzn", "^amazon"],
	});

	merchants.set("starbucks", {
		id: "starbucks",
		name: "Starbucks",
		category: "FOOD_AND_DRINK",
		subcategory: "CAFE",
		website: "https://starbucks.com",
		logo_hint: { type: "DOMAIN", value: "starbucks.com" },
		merchant_channel: "PHYSICAL",
		merchant_scope: "GLOBAL",
		subscription_likely: false,
		is_marketplace: false,
		risk_level: "LOW",
		aliases: ["starbucks", "starbucks coffee", "sbux"],
	});

	merchants.set("target", {
		id: "target",
		name: "Target",
		category: "SHOPPING",
		subcategory: "DEPARTMENT_STORE",
		website: "https://target.com",
		logo_hint: { type: "DOMAIN", value: "target.com" },
		merchant_channel: "HYBRID",
		merchant_scope: "NATIONAL",
		subscription_likely: false,
		is_marketplace: false,
		risk_level: "LOW",
		aliases: ["target", "target store"],
	});

	return merchants;
}

describe("resolveMerchant", () => {
	let merchants: Map<string, Merchant>;

	beforeAll(() => {
		merchants = createTestMerchants();
	});

	describe("successful matches", () => {
		it("matches exact alias", () => {
			const result = resolveMerchant("amazon", merchants);
			expect(result.merchant_id).toBe("amazon");
			expect(result.confidence).toBeGreaterThanOrEqual(0.7);
		});

		it("matches via regex pattern", () => {
			const result = resolveMerchant("amzn mktp de 12345", merchants);
			expect(result.merchant_id).toBe("amazon");
		});

		it("matches with noise words present", () => {
			const result = resolveMerchant("pos purchase starbucks visa", merchants);
			expect(result.merchant_id).toBe("starbucks");
		});

		it("matches partial alias in longer string", () => {
			const result = resolveMerchant("target store t-3346", merchants);
			expect(result.merchant_id).toBe("target");
		});

		it("returns all expected fields on match", () => {
			const result = resolveMerchant("amazon prime", merchants);
			expect(result.merchant_id).toBe("amazon");
			expect(result.confidence).toBeDefined();

			// Type guard to access success-only fields
			if (result.merchant_id !== null) {
				expect(result.name).toBe("Amazon");
				expect(result.category).toBe("SHOPPING");
				expect(result.subcategory).toBe("E_COMMERCE");
				expect(result.merchant_channel).toBe("HYBRID");
				expect(result.merchant_scope).toBe("GLOBAL");
				expect(result.subscription_likely).toBe(false);
				expect(result.is_marketplace).toBe(true);
				expect(result.risk_level).toBe("LOW");
				expect(result.website).toBe("https://amazon.com");
				expect(result.logo_hint).toEqual({ type: "DOMAIN", value: "amazon.com" });
			}
		});
	});

	describe("no match scenarios", () => {
		it("returns null merchant_id for empty input", () => {
			const result = resolveMerchant("", merchants);
			expect(result.merchant_id).toBeNull();
			expect(result.confidence).toBe(0);
		});

		it("returns null merchant_id for noise-only input", () => {
			const result = resolveMerchant("pending payment visa card", merchants);
			expect(result.merchant_id).toBeNull();
		});

		it("returns null merchant_id for unknown merchant", () => {
			const result = resolveMerchant("random unknown merchant xyz", merchants);
			expect(result.merchant_id).toBeNull();
		});

		it("returns best confidence even when below threshold", () => {
			const result = resolveMerchant("store shop retail", merchants);
			expect(result.merchant_id).toBeNull();
			expect(result.confidence).toBeDefined();
		});
	});

	describe("confidence scoring", () => {
		it("rounds confidence to 2 decimal places", () => {
			const result = resolveMerchant("amazon", merchants);
			const decimalPlaces = (result.confidence.toString().split(".")[1] || "").length;
			expect(decimalPlaces).toBeLessThanOrEqual(2);
		});

		it("returns higher confidence for exact matches", () => {
			const exactMatch = resolveMerchant("starbucks", merchants);
			const partialMatch = resolveMerchant("starbucks coffee shop location", merchants);
			expect(exactMatch.confidence).toBeGreaterThanOrEqual(partialMatch.confidence);
		});
	});

	describe("edge cases", () => {
		it("handles input with only punctuation", () => {
			const result = resolveMerchant("*** --- ...", merchants);
			expect(result.merchant_id).toBeNull();
		});

		it("handles input with only numbers", () => {
			const result = resolveMerchant("123456789", merchants);
			expect(result.merchant_id).toBeNull();
		});

		it("handles empty merchant map", () => {
			const result = resolveMerchant("amazon", new Map());
			expect(result.merchant_id).toBeNull();
			expect(result.confidence).toBe(0);
		});
	});
});
