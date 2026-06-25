import type { FastifyInstance } from 'fastify';
import { prisma } from '../db/client.js';
import { classify } from '../llm/classifier.js';
import { pseudonymize } from '../privacy/pseudonymize.js';
import { selectIntervention } from '../strategies/index.js';
import { CHALLENGE_LABELS } from '../../../shared/challenges.js';
import { isFeedback, INPUT_MODES } from '../../../shared/feedback.js';

// Cekirdek dongu: girdi -> (pseudonim) LLM siniflandirma -> mudahale -> logla.
// Sonra: kullanici "ise yaradi mi" geri bildirimini verir -> ayni satira yazilir.

const createBodySchema = {
  type: 'object',
  required: ['userPseudoId', 'inputText'],
  additionalProperties: false,
  properties: {
    userPseudoId: { type: 'string', minLength: 1, maxLength: 128 },
    inputText: { type: 'string', minLength: 1, maxLength: 2000 },
    inputMode: { type: 'string', enum: [...INPUT_MODES] },
    ctxHourOfDay: { type: 'integer', minimum: 0, maximum: 23 },
  },
} as const;

interface CreateBody {
  userPseudoId: string;
  inputText: string;
  inputMode?: 'text' | 'voice';
  ctxHourOfDay?: number;
}

const feedbackBodySchema = {
  type: 'object',
  required: ['feedback'],
  additionalProperties: false,
  properties: {
    feedback: { type: 'string', enum: ['worked', 'did_not_work'] },
  },
} as const;

export async function interactionRoutes(app: FastifyInstance) {
  // POST /interactions — siniflandir, mudahale dondur, logla.
  app.post<{ Body: CreateBody }>(
    '/interactions',
    { schema: { body: createBodySchema } },
    async (req) => {
      const { userPseudoId, inputText, inputMode = 'text', ctxHourOfDay } = req.body;

      // GIZLILIK: LLM'e yalnizca pseudonimlestirilmis metin gider; kimlik gitmez.
      const safeText = pseudonymize(inputText);
      const result = await classify(safeText);

      const strategy = selectIntervention(result.challenge);
      // LLM goreve ozel metin urettiyse onu kullan; mock'ta kutuphane cumlesine dus.
      const interventionText = result.tailoredText ?? strategy.text;
      const intervention = { id: strategy.id, text: interventionText, uiHint: strategy.uiHint };

      // Ham girdi cihaz/DB tarafinda; LLM'e giden surum ayri (safeText).
      const record = await prisma.interaction.create({
        data: {
          userPseudoId,
          inputText,
          inputMode,
          predictedChallenge: result.challenge,
          confidence: result.confidence,
          reasoning: result.reasoning,
          needsClarification: result.needsClarification,
          interventionId: intervention.id,
          interventionText,
          ctxHourOfDay: ctxHourOfDay ?? new Date().getHours(),
        },
      });

      // Dusuk guvende tek-dokunus dogrulama sorusu (active learning).
      const clarificationQuestion = result.needsClarification
        ? `${CHALLENGE_LABELS[result.challenge]} mi, yoksa ${CHALLENGE_LABELS[result.alternativeChallenge]} mi?`
        : undefined;

      return {
        id: record.id,
        challenge: result.challenge,
        label: CHALLENGE_LABELS[result.challenge],
        confidence: result.confidence,
        reasoning: result.reasoning,
        needsClarification: result.needsClarification,
        clarificationQuestion,
        intervention,
        source: result.source,
      };
    },
  );

  // POST /interactions/:id/feedback — "ise yaradi mi" geri bildirimi (ogrenme dongusu).
  app.post<{ Params: { id: string }; Body: { feedback: string } }>(
    '/interactions/:id/feedback',
    { schema: { body: feedbackBodySchema } },
    async (req, reply) => {
      const { id } = req.params;
      const { feedback } = req.body;

      if (!isFeedback(feedback)) {
        return reply.code(400).send({ error: 'gecersiz feedback degeri' });
      }

      const existing = await prisma.interaction.findUnique({ where: { id } });
      if (!existing) {
        return reply.code(404).send({ error: 'etkilesim bulunamadi' });
      }

      await prisma.interaction.update({
        where: { id },
        data: { feedback, feedbackAt: new Date() },
      });

      return { ok: true, id, feedback };
    },
  );
}
