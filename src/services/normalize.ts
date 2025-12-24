// Noise words commonly found in bank statements that should be removed
const NOISE_WORDS = new Set([
    "pending", 
    "ref", 
    "reference", 
    "payment", 
    "pos", 
    "transaction", 
    "txn", 
    "purchase", 
    "debit", 
    "credit", 
    "card", 
    "visa", 
    "mastercard", 
    "amex", 
    "check", 
    "ach", 
    "wire", 
    "transfer", 
    "online", 
    "mobile", 
    "app", 
    "inc", 
    "llc", 
    "ltd", 
    "corp", 
    "corporation", 
    "co", 
    "the"
]);

// Diacritic folding map for common special characters
const DIACRITIC_MAP: Record<string, string> = {
	// Nordic
	ø: "o",
	æ: "ae",
	å: "a",
	ö: "o",
	ä: "a",
	ü: "u",
	// German
	ß: "ss",
	// French
	é: "e",
	è: "e",
	ê: "e",
	ë: "e",
	à: "a",
	â: "a",
	î: "i",
	ï: "i",
	ô: "o",
	ù: "u",
	û: "u",
	ç: "c",
	// Spanish
	ñ: "n",
	á: "a",
	í: "i",
	ó: "o",
	ú: "u",
	// Polish
	ł: "l",
	ń: "n",
	ś: "s",
	ź: "z",
	ż: "z",
	ć: "c",
	// Czech/Slovak
	č: "c",
	ř: "r",
	š: "s",
	ž: "z",
	ý: "y",
	ď: "d",
	ť: "t",
	ň: "n",
};

// UUID pattern (various formats)
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

// Hash-like patterns (long hex strings)
const HASH_PATTERN = /[0-9a-f]{16,}/gi;

// Numeric sequences (transaction IDs, reference numbers, etc.)
const NUMERIC_PATTERN = /\b\d{4,}\b/g;

// Date patterns
const DATE_PATTERN = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g;

export function normalize(input: string): string {
	let result = input;

	result = result.normalize("NFKD");
	result = result.replace(/[\u0300-\u036f]/g, "");
	result = result.split("").map(char => DIACRITIC_MAP[char.toLowerCase()] || char).join("");
	result = result.toLowerCase();
	result = result.replace(UUID_PATTERN, " ");
	result = result.replace(HASH_PATTERN, " ");
	result = result.replace(DATE_PATTERN, " ");
	result = result.replace(NUMERIC_PATTERN, " ");
	result = result.replace(/[^\w\s*]/g, " ");
	result = result.replace(/\*/g, " ");

	const tokens = result.split(/\s+/).filter(token => {
		if (token.length === 0) return false;
		if (NOISE_WORDS.has(token)) return false;
		return true;
	});

	result = tokens.join(" ").trim();

	return result;
}

export function tokenize(input: string): Set<string> {
	return new Set(input.split(/\s+/).filter(t => t.length > 0));
}
