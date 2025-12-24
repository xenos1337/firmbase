export const RiskLevel = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const RISK_LEVELS = Object.values(RiskLevel);
