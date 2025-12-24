import { tokenize } from './normalize.js';

const WEIGHTS = {
    REGEX_MATCH: 0.85,
    EXACT_ALIAS_MATCH: 0.95,
    ALIAS_SIMILARITY_MAX: 0.75,
} as const;

export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 && setB.size === 0) return 0;

    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return intersection.size / union.size;
}

export function calculateRegexScore(matched: boolean): number {
    return matched ? WEIGHTS.REGEX_MATCH : 0;
}

export function calculateAliasScore(normalizedInput: string, aliases: string[]): number {
    if (aliases.length === 0) return 0;

    const inputTokens = tokenize(normalizedInput);
    let bestScore = 0;

    for (const alias of aliases) {
        if (normalizedInput === alias) {
            return WEIGHTS.EXACT_ALIAS_MATCH;
        }

        if (normalizedInput.includes(alias)) {
            const containsScore = Math.min(
                WEIGHTS.EXACT_ALIAS_MATCH,
                0.8 + (alias.length / normalizedInput.length) * 0.15
            );
            bestScore = Math.max(bestScore, containsScore);
            continue;
        }

        const aliasTokens = tokenize(alias);
        const similarity = jaccardSimilarity(inputTokens, aliasTokens);
        const tokenScore = similarity * WEIGHTS.ALIAS_SIMILARITY_MAX;

        bestScore = Math.max(bestScore, tokenScore);
    }

    return bestScore;
}

export function aggregateScore(regexScore: number, aliasScore: number): number {
    if (regexScore === 0 && aliasScore === 0) return 0;

    const baseScore = Math.max(regexScore, aliasScore);

    const bothMatched = regexScore > 0 && aliasScore > 0.5;
    const boost = bothMatched ? 0.05 : 0;

    return Math.min(1, Math.max(0, baseScore + boost));
}

export const CONFIDENCE_THRESHOLD = 0.7;
