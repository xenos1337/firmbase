import type { Merchant } from "../schemas/merchant.schema.js";
import type { ResolveResponse } from "../schemas/resolve.schema.js";
import { normalize } from "./normalize.js";
import { calculateRegexScore, calculateAliasScore, aggregateScore, CONFIDENCE_THRESHOLD } from "./confidence.js";

interface MatchCandidate {
	merchant: Merchant;
	confidence: number;
}

function matchesRegex(normalizedInput: string, patterns: string[]): boolean {
	for (const pattern of patterns) {
		try {
			const regex = new RegExp(pattern, "i");
			if (regex.test(normalizedInput)) {
				return true;
			}
		} catch {
			continue;
		}
	}
	return false;
}

function calculateMerchantConfidence(normalizedInput: string, merchant: Merchant): number {
	const patterns = merchant.regex ?? [];
	const regexMatched = matchesRegex(normalizedInput, patterns);
	const regexScore = calculateRegexScore(regexMatched);

	const aliasScore = calculateAliasScore(normalizedInput, merchant.aliases);

	return aggregateScore(regexScore, aliasScore);
}

function findCandidates(normalizedInput: string, merchants: Map<string, Merchant>): MatchCandidate[] {
	const candidates: MatchCandidate[] = [];

	for (const merchant of merchants.values()) {
		const confidence = calculateMerchantConfidence(normalizedInput, merchant);

		if (confidence > 0) {
			candidates.push({ merchant, confidence });
		}
	}

	candidates.sort((a, b) => b.confidence - a.confidence);

	return candidates;
}

function toSuccessResponse(merchant: Merchant, confidence: number): ResolveResponse {
	return {
		merchant_id: merchant.id,
		name: merchant.name,
		category: merchant.category,
		subcategory: merchant.subcategory,
		merchant_channel: merchant.merchant_channel,
		merchant_scope: merchant.merchant_scope,
		subscription_likely: merchant.subscription_likely,
		is_marketplace: merchant.is_marketplace,
		risk_level: merchant.risk_level,
		website: merchant.website,
		logo_hint: merchant.logo_hint,
		confidence: Math.round(confidence * 100) / 100,
	};
}

function toNoMatchResponse(bestConfidence: number): ResolveResponse {
	return {
		merchant_id: null,
		confidence: Math.round(bestConfidence * 100) / 100,
	};
}

export function resolveMerchant(rawInput: string, merchants: Map<string, Merchant>): ResolveResponse {
	const normalizedInput = normalize(rawInput);
	if (normalizedInput.length === 0) return toNoMatchResponse(0);

	const candidates = findCandidates(normalizedInput, merchants);
	if (candidates.length === 0) return toNoMatchResponse(0);

	const bestMatch = candidates[0];
	if (bestMatch.confidence < CONFIDENCE_THRESHOLD) return toNoMatchResponse(bestMatch.confidence);

	return toSuccessResponse(bestMatch.merchant, bestMatch.confidence);
}
