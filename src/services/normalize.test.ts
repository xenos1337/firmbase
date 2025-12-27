import { describe, it, expect } from "vitest";
import { normalize, tokenize } from "./normalize.js";

describe("normalize", () => {
	describe("diacritic folding", () => {
		it("folds Nordic characters", () => {
			expect(normalize("elkjøp")).toBe("elkjop");
			expect(normalize("tromsø")).toBe("tromso");
			expect(normalize("Ærø")).toBe("aero");
			expect(normalize("blåbær")).toBe("blabaer");
		});

		it("folds German characters", () => {
			expect(normalize("müller")).toBe("muller");
			expect(normalize("größe")).toBe("grosse");
			expect(normalize("äpfel")).toBe("apfel");
		});

		it("folds French characters", () => {
			expect(normalize("café")).toBe("cafe");
			expect(normalize("naïve")).toBe("naive");
			expect(normalize("château")).toBe("chateau");
		});

		it("folds Spanish characters", () => {
			expect(normalize("señor")).toBe("senor");
			expect(normalize("año")).toBe("ano");
		});
	});

	describe("lowercase conversion", () => {
		it("converts to lowercase", () => {
			expect(normalize("AMAZON")).toBe("amazon");
			expect(normalize("StarBucks")).toBe("starbucks");
			expect(normalize("McDONALDS")).toBe("mcdonalds");
		});
	});

	describe("UUID removal", () => {
		it("removes UUIDs from input", () => {
			expect(normalize("payment 550e8400-e29b-41d4-a716-446655440000 merchant")).toBe("merchant");
		});
	});

	describe("hash removal", () => {
		it("removes long hex strings", () => {
			// "ref" is a noise word, so only "store" remains
			expect(normalize("ref 1234567890abcdef1234 store")).toBe("store");
		});
	});

	describe("date removal", () => {
		it("removes date patterns", () => {
			expect(normalize("purchase 12/25/2024 amazon")).toBe("amazon");
			expect(normalize("buy 01-15-24 store")).toBe("buy store");
		});
	});

	describe("numeric sequence removal", () => {
		it("removes 4+ digit sequences", () => {
			expect(normalize("target store 12345")).toBe("target store");
			// "7" is kept (less than 4 digits), hyphen becomes space
			expect(normalize("7-eleven 17635")).toBe("7 eleven");
			// "ref" is a noise word
			expect(normalize("ref 999999 merchant")).toBe("merchant");
		});

		it("keeps short numbers", () => {
			// 3-digit numbers are kept (pattern only removes 4+ digits)
			expect(normalize("store 123")).toBe("store 123");
		});
	});

	describe("noise word filtering", () => {
		it("removes payment-related noise words", () => {
			expect(normalize("pending payment amazon")).toBe("amazon");
			expect(normalize("pos transaction starbucks")).toBe("starbucks");
			expect(normalize("debit card purchase netflix")).toBe("netflix");
		});

		it("removes company suffixes", () => {
			// "online" is a noise word, "gmbh" is not
			expect(normalize("hetzner online gmbh")).toBe("hetzner gmbh");
			expect(normalize("vercel inc")).toBe("vercel");
			expect(normalize("amazon llc")).toBe("amazon");
		});

		it("removes card network names", () => {
			expect(normalize("visa starbucks")).toBe("starbucks");
			expect(normalize("mastercard amazon")).toBe("amazon");
		});
	});

	describe("punctuation removal", () => {
		it("removes punctuation", () => {
			expect(normalize("amazon.com")).toBe("amazon com");
			// "mobile" is a noise word, so only "t" remains
			expect(normalize("t-mobile")).toBe("t");
			// "udx" is a short token that remains
			expect(normalize("louis vuitton - udx")).toBe("louis vuitton udx");
		});

		it("removes asterisks", () => {
			expect(normalize("openai *chatgpt subscr")).toBe("openai chatgpt subscr");
			// "app" and "payment" are noise words
			expect(normalize("cash app * payment")).toBe("cash");
		});
	});

	describe("real-world transaction strings", () => {
		it("normalizes electronics store transactions", () => {
			expect(normalize("media markt tv-hifi-el")).toBe("media markt tv hifi el");
			expect(normalize("micro center")).toBe("micro center");
			expect(normalize("elkjoep tromsoe")).toBe("elkjoep tromsoe");
		});

		it("normalizes fashion store transactions", () => {
			expect(normalize("christ juweliere gmbh")).toBe("christ juweliere gmbh");
			expect(normalize("foot locker")).toBe("foot locker");
			expect(normalize("louis vuitton - udx")).toBe("louis vuitton udx");
		});

		it("normalizes department store transactions", () => {
			expect(normalize("target store t-3346")).toBe("target store t");
			expect(normalize("target t-1884")).toBe("target t");
		});

		it("normalizes convenience store transactions", () => {
			// "7" is kept (single digit), "17635" removed (5 digits)
			expect(normalize("7-eleven 17635")).toBe("7 eleven");
			// "7153" removed (4 digits)
			expect(normalize("7-eleven 7153 domkirke")).toBe("7 eleven domkirke");
			// "626" is 3 digits, kept (only 4+ digit sequences removed)
			expect(normalize("narvesen 626 tromso lu")).toBe("narvesen 626 tromso lu");
		});

		it("normalizes AI service transactions", () => {
			expect(normalize("anthropic")).toBe("anthropic");
			expect(normalize("claude.ai subscription")).toBe("claude ai subscription");
			expect(normalize("openai *chatgpt subscr")).toBe("openai chatgpt subscr");
			expect(normalize("cursor usage aug")).toBe("cursor usage aug");
			expect(normalize("cursor, ai powered ide")).toBe("cursor ai powered ide");
		});

		it("normalizes cloud service transactions", () => {
			expect(normalize("cloudflare")).toBe("cloudflare");
			// "online" is a noise word, "gmbh" is not
			expect(normalize("hetzner online gmbh")).toBe("hetzner gmbh");
			expect(normalize("planetscale inc.")).toBe("planetscale");
			expect(normalize("upstash")).toBe("upstash");
			expect(normalize("vercel inc.")).toBe("vercel");
		});
	});
});

describe("tokenize", () => {
	it("splits string into token set", () => {
		const tokens = tokenize("amazon prime video");
		expect(tokens).toEqual(new Set(["amazon", "prime", "video"]));
	});

	it("handles multiple spaces", () => {
		const tokens = tokenize("hello   world");
		expect(tokens).toEqual(new Set(["hello", "world"]));
	});

	it("returns empty set for empty string", () => {
		const tokens = tokenize("");
		expect(tokens.size).toBe(0);
	});

	it("filters empty tokens", () => {
		const tokens = tokenize("  spaced  ");
		expect(tokens).toEqual(new Set(["spaced"]));
	});
});
