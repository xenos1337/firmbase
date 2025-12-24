export const MerchantScope = {
	LOCAL: "LOCAL",
	NATIONAL: "NATIONAL",
	GLOBAL: "GLOBAL",
} as const;

export type MerchantScope = (typeof MerchantScope)[keyof typeof MerchantScope];

export const MERCHANT_SCOPES = Object.values(MerchantScope);
