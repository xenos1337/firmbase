import { describe, it, expect, beforeAll } from "vitest";
import { loadMerchants } from "./loadMerchants.js";
import type { Merchant } from "../schemas/merchant.schema.js";
import { CATEGORIES } from "../taxonomy/categories.js";
import { SUBCATEGORIES } from "../taxonomy/subcategories.js";
import { MERCHANT_CHANNELS } from "../taxonomy/merchantChannel.js";
import { MERCHANT_SCOPES } from "../taxonomy/merchantScope.js";
import { RISK_LEVELS } from "../taxonomy/riskLevel.js";

describe("loadMerchants", () => {
	let merchants: Map<string, Merchant>;

	it("loads merchants without throwing", () => {
		expect(() => {
			merchants = loadMerchants();
		}).not.toThrow();
	});

	it("returns a non-empty Map", () => {
		merchants = loadMerchants();
		expect(merchants).toBeInstanceOf(Map);
		expect(merchants.size).toBeGreaterThan(0);
	});

	describe("merchant data integrity", () => {
		beforeAll(() => {
			merchants = loadMerchants();
		});

		it("all merchants have required string fields", () => {
			for (const [id, merchant] of merchants) {
				expect(typeof merchant.id).toBe("string");
				expect(merchant.id.length).toBeGreaterThan(0);
				expect(typeof merchant.name).toBe("string");
				expect(merchant.name.length).toBeGreaterThan(0);
				expect(id).toBe(merchant.id);
			}
		});

		it("all merchants have valid category", () => {
			for (const merchant of merchants.values()) {
				expect(CATEGORIES).toContain(merchant.category);
			}
		});

		it("all merchants have valid subcategory", () => {
			for (const merchant of merchants.values()) {
				expect(SUBCATEGORIES).toContain(merchant.subcategory);
			}
		});

		it("all merchants have valid merchant_channel", () => {
			for (const merchant of merchants.values()) {
				expect(MERCHANT_CHANNELS).toContain(merchant.merchant_channel);
			}
		});

		it("all merchants have valid merchant_scope", () => {
			for (const merchant of merchants.values()) {
				expect(MERCHANT_SCOPES).toContain(merchant.merchant_scope);
			}
		});

		it("all merchants have valid risk_level", () => {
			for (const merchant of merchants.values()) {
				expect(RISK_LEVELS).toContain(merchant.risk_level);
			}
		});

		it("all merchants have boolean flags", () => {
			for (const merchant of merchants.values()) {
				expect(typeof merchant.subscription_likely).toBe("boolean");
				expect(typeof merchant.is_marketplace).toBe("boolean");
			}
		});

		it("all merchants have non-empty aliases array", () => {
			for (const merchant of merchants.values()) {
				expect(Array.isArray(merchant.aliases)).toBe(true);
				expect(merchant.aliases.length).toBeGreaterThan(0);
			}
		});

		it("all aliases are pre-normalized (lowercase, no punctuation, no diacritics)", () => {
			const uppercasePattern = /[A-Z]/;
			const punctuationPattern = /[^\w\s]/;
			const diacriticPattern = /[^\u0000-\u007F]/;

			for (const merchant of merchants.values()) {
				for (const alias of merchant.aliases) {
					expect(uppercasePattern.test(alias)).toBe(false);
					expect(punctuationPattern.test(alias)).toBe(false);
					expect(diacriticPattern.test(alias)).toBe(false);
				}
			}
		});

		it("all regex patterns are valid", () => {
			for (const merchant of merchants.values()) {
				if (merchant.regex) {
					for (const pattern of merchant.regex) {
						expect(() => new RegExp(pattern, "i")).not.toThrow();
					}
				}
			}
		});

		it("website field is valid URL when present", () => {
			for (const merchant of merchants.values()) {
				if (merchant.website) {
					expect(merchant.website).toMatch(/^https?:\/\//);
				}
			}
		});

		it("logo_hint has correct structure when present", () => {
			for (const merchant of merchants.values()) {
				if (merchant.logo_hint) {
					expect(merchant.logo_hint.type).toBe("DOMAIN");
					expect(typeof merchant.logo_hint.value).toBe("string");
					expect(merchant.logo_hint.value.length).toBeGreaterThan(0);
				}
			}
		});
	});

	describe("specific merchants exist", () => {
		beforeAll(() => {
			merchants = loadMerchants();
		});

		const expectedMerchants = [
			"amazon",
			"starbucks",
			"netflix",
			"spotify",
			"uber",
			"target",
			"walmart",
			"anthropic",
			"openai",
			"cloudflare",
			"vercel",
		];

		expectedMerchants.forEach((id) => {
			it(`contains merchant: ${id}`, () => {
				expect(merchants.has(id)).toBe(true);
			});
		});
	});

	describe("no duplicate IDs", () => {
		it("all merchant IDs are unique", () => {
			merchants = loadMerchants();
			const ids = Array.from(merchants.keys());
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});
	});
});
