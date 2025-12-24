export const MerchantChannel = {
	PHYSICAL: "PHYSICAL",
	ONLINE: "ONLINE",
	HYBRID: "HYBRID",
} as const;

export type MerchantChannel = (typeof MerchantChannel)[keyof typeof MerchantChannel];

export const MERCHANT_CHANNELS = Object.values(MerchantChannel);
