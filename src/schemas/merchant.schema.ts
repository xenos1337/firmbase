import { CATEGORIES, type Category } from "../taxonomy/categories.js";
import { SUBCATEGORIES, type Subcategory } from "../taxonomy/subcategories.js";
import { MERCHANT_CHANNELS, type MerchantChannel } from "../taxonomy/merchantChannel.js";
import { MERCHANT_SCOPES, type MerchantScope } from "../taxonomy/merchantScope.js";
import { RISK_LEVELS, type RiskLevel } from "../taxonomy/riskLevel.js";

export interface LogoHint {
	type: "DOMAIN";
	value: string;
}

export interface Merchant {
	id: string;
	name: string;
	category: Category;
	subcategory: Subcategory;
	merchant_channel: MerchantChannel;
	merchant_scope: MerchantScope;
	subscription_likely: boolean;
	is_marketplace: boolean;
	risk_level: RiskLevel;
	aliases: string[];
	// Optional fields
	website?: string;
	logo_hint?: LogoHint;
	regex?: string[];
}

export const logoHintSchema = {
	type: "object",
	properties: {
		type: { type: "string", enum: ["DOMAIN"] },
		value: { type: "string" },
	},
	required: ["type", "value"],
	additionalProperties: false,
} as const;

export const merchantSchema = {
	type: "object",
	properties: {
		id: { type: "string", minLength: 1 },
		name: { type: "string", minLength: 1 },
		category: { type: "string", enum: CATEGORIES },
		subcategory: { type: "string", enum: SUBCATEGORIES },
		merchant_channel: { type: "string", enum: MERCHANT_CHANNELS },
		merchant_scope: { type: "string", enum: MERCHANT_SCOPES },
		subscription_likely: { type: "boolean" },
		is_marketplace: { type: "boolean" },
		risk_level: { type: "string", enum: RISK_LEVELS },
		aliases: { type: "array", items: { type: "string" } },
		// Optional fields
		website: { type: "string", format: "uri" },
		logo_hint: logoHintSchema,
		regex: { type: "array", items: { type: "string" } },
	},
	required: ["id", "name", "category", "subcategory", "merchant_channel", "merchant_scope", "subscription_likely", "is_marketplace", "risk_level", "aliases"],
	additionalProperties: false,
} as const;
