import { describe, it, expect } from "vitest";
import {
	jaccardSimilarity,
	calculateRegexScore,
	calculateAliasScore,
	aggregateScore,
	CONFIDENCE_THRESHOLD,
} from "./confidence.js";

describe("jaccardSimilarity", () => {
	it("returns 1 for identical sets", () => {
		const setA = new Set(["a", "b", "c"]);
		const setB = new Set(["a", "b", "c"]);
		expect(jaccardSimilarity(setA, setB)).toBe(1);
	});

	it("returns 0 for disjoint sets", () => {
		const setA = new Set(["a", "b"]);
		const setB = new Set(["c", "d"]);
		expect(jaccardSimilarity(setA, setB)).toBe(0);
	});

	it("returns 0 for two empty sets", () => {
		expect(jaccardSimilarity(new Set(), new Set())).toBe(0);
	});

	it("calculates partial overlap correctly", () => {
		const setA = new Set(["a", "b", "c"]);
		const setB = new Set(["b", "c", "d"]);
		// intersection: {b, c} = 2, union: {a, b, c, d} = 4
		expect(jaccardSimilarity(setA, setB)).toBe(0.5);
	});

	it("handles subset relationship", () => {
		const setA = new Set(["a", "b"]);
		const setB = new Set(["a", "b", "c", "d"]);
		// intersection: 2, union: 4
		expect(jaccardSimilarity(setA, setB)).toBe(0.5);
	});
});

describe("calculateRegexScore", () => {
	it("returns 0.85 when matched", () => {
		expect(calculateRegexScore(true)).toBe(0.85);
	});

	it("returns 0 when not matched", () => {
		expect(calculateRegexScore(false)).toBe(0);
	});
});

describe("calculateAliasScore", () => {
	it("returns 0 for empty aliases", () => {
		expect(calculateAliasScore("amazon", [])).toBe(0);
	});

	it("returns 0.95 for exact match", () => {
		expect(calculateAliasScore("amazon", ["amazon", "amzn"])).toBe(0.95);
	});

	it("returns high score when input contains alias", () => {
		const score = calculateAliasScore("amazon prime video", ["amazon"]);
		expect(score).toBeGreaterThan(0.8);
		expect(score).toBeLessThanOrEqual(0.95);
	});

	it("returns score based on token similarity", () => {
		const score = calculateAliasScore("amazon store", ["amazon shop"]);
		expect(score).toBeGreaterThan(0);
		expect(score).toBeLessThanOrEqual(0.75);
	});

	it("returns best score among multiple aliases", () => {
		const score = calculateAliasScore("starbucks", ["starbucks", "sbux", "starbucks coffee"]);
		expect(score).toBe(0.95); // exact match with first alias
	});
});

describe("aggregateScore", () => {
	it("returns 0 when both scores are 0", () => {
		expect(aggregateScore(0, 0)).toBe(0);
	});

	it("returns regex score when alias score is 0", () => {
		expect(aggregateScore(0.85, 0)).toBe(0.85);
	});

	it("returns alias score when regex score is 0", () => {
		expect(aggregateScore(0, 0.75)).toBe(0.75);
	});

	it("returns max score when only one matches well", () => {
		expect(aggregateScore(0.85, 0.3)).toBe(0.85);
	});

	it("adds 0.05 boost when both match well", () => {
		// Both match: regex = 0.85, alias > 0.5
		expect(aggregateScore(0.85, 0.6)).toBe(0.9);
	});

	it("caps score at 1", () => {
		expect(aggregateScore(0.85, 0.95)).toBe(1);
	});

	it("returns non-negative scores", () => {
		expect(aggregateScore(0, 0)).toBeGreaterThanOrEqual(0);
	});
});

describe("CONFIDENCE_THRESHOLD", () => {
	it("is set to 0.7", () => {
		expect(CONFIDENCE_THRESHOLD).toBe(0.7);
	});
});
