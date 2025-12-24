import { CATEGORIES } from "../taxonomy/categories.js";
import { SUBCATEGORIES } from "../taxonomy/subcategories.js";
import { MERCHANT_CHANNELS } from "../taxonomy/merchantChannel.js";
import { MERCHANT_SCOPES } from "../taxonomy/merchantScope.js";
import { RISK_LEVELS } from "../taxonomy/riskLevel.js";

export const resolveQuerySchema = {
	type: "object",
	properties: {
		q: { type: "string", minLength: 1 },
	},
	required: ["q"],
} as const;

export const resolveSuccessResponseSchema = {
	type: "object",
	properties: {
		merchant_id: { type: "string" },
		name: { type: "string" },
		category: { type: "string", enum: CATEGORIES },
		subcategory: { type: "string", enum: SUBCATEGORIES },
		merchant_channel: { type: "string", enum: MERCHANT_CHANNELS },
		merchant_scope: { type: "string", enum: MERCHANT_SCOPES },
		subscription_likely: { type: "boolean" },
		is_marketplace: { type: "boolean" },
		risk_level: { type: "string", enum: RISK_LEVELS },
		confidence: { type: "number", minimum: 0, maximum: 1 },
		// Optional fields
		website: { type: "string" },
		logo_hint: {
			type: "object",
			properties: {
				type: { type: "string", enum: ["DOMAIN"] },
				value: { type: "string" },
			},
			required: ["type", "value"],
		},
	},
	required: ["merchant_id", "name", "category", "subcategory", "merchant_channel", "merchant_scope", "subscription_likely", "is_marketplace", "risk_level", "confidence"],
} as const;

export const resolveNoMatchResponseSchema = {
	type: "object",
	properties: {
		merchant_id: { type: "null" },
		confidence: { type: "number", minimum: 0, maximum: 1 },
	},
	required: ["merchant_id", "confidence"],
} as const;

export const resolveResponseSchema = {
	oneOf: [resolveSuccessResponseSchema, resolveNoMatchResponseSchema],
} as const;

export interface ResolveSuccessResponse {
	merchant_id: string;
	name: string;
	category: string;
	subcategory: string;
	merchant_channel: string;
	merchant_scope: string;
	subscription_likely: boolean;
	is_marketplace: boolean;
	risk_level: string;
	confidence: number;
	// Optional fields
	website?: string;
	logo_hint?: {
		type: "DOMAIN";
		value: string;
	};
}

export interface ResolveNoMatchResponse {
	merchant_id: null;
	confidence: number;
}

export type ResolveResponse = ResolveSuccessResponse | ResolveNoMatchResponse;
