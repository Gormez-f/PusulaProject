import type { FastifyInstance } from 'fastify';

// Saglik kontrolu — sunucunun ayakta oldugunu dogrulamak icin.
export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok', service: 'pusula-backend', version: '0.1.0' };
  });
}
