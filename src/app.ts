import Fastify, { type FastifyInstance } from "fastify";
import { loadMerchants } from "./utils/loadMerchants.js";
import { merchantRoutes } from "./routes/merchant.js";

export async function buildApp(): Promise<FastifyInstance> {
	const fastify = Fastify({
		logger: false,
	});

	const merchants = loadMerchants();

	await fastify.register(merchantRoutes, { merchants });

	const healthHandler = async () => ({ status: "ok", merchants: merchants.size });

	fastify.get("/", healthHandler);
	fastify.get("/health", healthHandler);

	return fastify;
}
