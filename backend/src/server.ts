import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { interactionRoutes } from './routes/interactions.js';

const app = Fastify({ logger: true });

// Yerel gelistirme: web istemcisi (tarayici) farkli porttan gelir -> CORS gerekli.
// Uretimde origin kisitlanmali.
await app.register(cors, { origin: true });

await app.register(healthRoutes);
await app.register(interactionRoutes);

const port = Number(process.env.PORT ?? 3333);

try {
  await app.listen({ port, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
