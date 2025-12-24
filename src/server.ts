import { buildApp } from "./app.js";

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

async function start(): Promise<void> {
	const app = await buildApp();

	try {
		await app.listen({ port: PORT, host: HOST });
		console.log(`Server listening on http://${HOST}:${PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();
