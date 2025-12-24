import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { resolveQuerySchema, resolveResponseSchema } from "../schemas/resolve.schema.js";
import { resolveMerchant } from "../services/matcher.js";
import type { Merchant } from "../schemas/merchant.schema.js";

interface ResolveQuery {
	q: string;
}

export async function merchantRoutes(fastify: FastifyInstance, options: { merchants: Map<string, Merchant> }): Promise<void> {
	const { merchants } = options;

	fastify.get<{ Querystring: ResolveQuery }>("/v1/merchant/resolve", {
		schema: {
			querystring: resolveQuerySchema,
			response: {
				200: resolveResponseSchema,
			},
		},
	},
	async (request: FastifyRequest<{ Querystring: ResolveQuery }>, reply: FastifyReply) => {
		const { q } = request.query;

		const result = resolveMerchant(q, merchants);

		return reply.send(result);
	});
}
