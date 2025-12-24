import Fastify, { type FastifyInstance } from "fastify";
import { loadMerchants } from "./utils/loadMerchants.js";
import { merchantRoutes } from "./routes/merchant.js";

export async function buildApp(): Promise<FastifyInstance> {
	const fastify = Fastify({
		logger: true,
	});

	const merchants = loadMerchants();

	await fastify.register(merchantRoutes, { merchants });

	fastify.get("/health", async () => {
		return { status: "ok", merchants: merchants.size };
	});

	return fastify;
}
