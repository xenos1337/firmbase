import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Merchant } from "../schemas/merchant.schema.js";
import { CATEGORIES } from "../taxonomy/categories.js";
import { SUBCATEGORIES } from "../taxonomy/subcategories.js";
import { MERCHANT_CHANNELS } from "../taxonomy/merchantChannel.js";
import { MERCHANT_SCOPES } from "../taxonomy/merchantScope.js";
import { RISK_LEVELS } from "../taxonomy/riskLevel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MERCHANTS_DIR = join(__dirname, "..", "data", "merchants");

const UPPERCASE_PATTERN = /[A-Z]/;
const PUNCTUATION_PATTERN = /[^\w\s]/;
const DIACRITIC_PATTERN = /[^\u0000-\u007F]/;

function validateAlias(alias: string, filename: string): void {
	if (typeof alias !== "string") throw new Error(`${filename}: Alias must be a string`);
	if (alias.length === 0) throw new Error(`${filename}: Alias cannot be empty`);

	if (UPPERCASE_PATTERN.test(alias)) throw new Error(`${filename}: Alias "${alias}" contains uppercase characters - aliases must be pre-normalized to lowercase`);
	if (PUNCTUATION_PATTERN.test(alias)) throw new Error(`${filename}: Alias "${alias}" contains punctuation - aliases must be pre-normalized (no punctuation except spaces)`);
	if (DIACRITIC_PATTERN.test(alias)) throw new Error(`${filename}: Alias "${alias}" contains diacritics/special characters - aliases must be pre-normalized`);
}

function validateMerchant(data: unknown, filename: string): Merchant {
	if (typeof data !== "object" || data === null) {
		throw new Error(`${filename}: Invalid merchant data - expected object`);
	}

	const merchant = data as Record<string, unknown>;

	const requiredStrings = ["id", "name"] as const;
	for (const field of requiredStrings) {
		if (typeof merchant[field] !== "string" || merchant[field] === "") {
			throw new Error(`${filename}: Missing or invalid required field "${field}"`);
		}
	}

	if (!CATEGORIES.includes(merchant.category as never)) throw new Error(`${filename}: Invalid category "${merchant.category}"`);
	if (!SUBCATEGORIES.includes(merchant.subcategory as never)) throw new Error(`${filename}: Invalid subcategory "${merchant.subcategory}"`);
	if (!MERCHANT_CHANNELS.includes(merchant.merchant_channel as never)) throw new Error(`${filename}: Invalid merchant_channel "${merchant.merchant_channel}"`);
	if (!MERCHANT_SCOPES.includes(merchant.merchant_scope as never)) throw new Error(`${filename}: Invalid merchant_scope "${merchant.merchant_scope}"`);
	if (!RISK_LEVELS.includes(merchant.risk_level as never)) throw new Error(`${filename}: Invalid risk_level "${merchant.risk_level}"`);

	if (typeof merchant.subscription_likely !== "boolean") throw new Error(`${filename}: subscription_likely must be a boolean`);
	if (typeof merchant.is_marketplace !== "boolean") throw new Error(`${filename}: is_marketplace must be a boolean`);

	if (!Array.isArray(merchant.aliases)) throw new Error(`${filename}: aliases must be an array`);

	if (merchant.website !== undefined) {
		if (typeof merchant.website !== "string" || merchant.website === "") {
			throw new Error(`${filename}: website must be a non-empty string if provided`);
		}
	}

	if (merchant.logo_hint !== undefined) {
		if (typeof merchant.logo_hint !== "object" || merchant.logo_hint === null || (merchant.logo_hint as Record<string, unknown>).type !== "DOMAIN" || typeof (merchant.logo_hint as Record<string, unknown>).value !== "string") {
			throw new Error(`${filename}: Invalid logo_hint - must have type: "DOMAIN" and value: string`);
		}
	}

	for (const alias of merchant.aliases as string[]) {
		validateAlias(alias, filename);
	}

	if (merchant.regex !== undefined) {
		if (!Array.isArray(merchant.regex)) throw new Error(`${filename}: regex must be an array if provided`);

		for (const pattern of merchant.regex as string[]) {
			try {
				new RegExp(pattern, "i");
			} catch {
				throw new Error(`${filename}: Invalid regex pattern "${pattern}"`);
			}
		}
	}

	return merchant as unknown as Merchant;
}

export function loadMerchants(): Map<string, Merchant> {
	const merchants = new Map<string, Merchant>();

	let files: string[];
	try {
		files = readdirSync(MERCHANTS_DIR);
	} catch {
		throw new Error(`Merchants directory not found at ${MERCHANTS_DIR} - cannot start without merchant data`);
	}

	const jsonFiles = files.filter(f => f.endsWith(".json"));

	if (jsonFiles.length === 0) {
		throw new Error(`No merchant JSON files found in ${MERCHANTS_DIR} - cannot start without merchant data`);
	}

	for (const filename of jsonFiles) {
		const filepath = join(MERCHANTS_DIR, filename);
		const content = readFileSync(filepath, "utf-8");

		let data: unknown;
		try {
			data = JSON.parse(content);
		} catch {
			throw new Error(`${filename}: Invalid JSON`);
		}

		const merchant = validateMerchant(data, filename);

		if (merchants.has(merchant.id)) {
			throw new Error(`Duplicate merchant ID: ${merchant.id}`);
		}

		merchants.set(merchant.id, merchant);
	}

	console.log(`Loaded ${merchants.size} merchants`);
	return merchants;
}
