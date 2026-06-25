import Anthropic from '@anthropic-ai/sdk';
import { isChallenge } from '../../../shared/challenges.js';
import {
  type ClassificationResult,
  CONFIDENCE_THRESHOLD,
} from '../../../shared/classification.js';
import { SYSTEM_PROMPT, CLASSIFICATION_SCHEMA } from './prompts.js';
import { mockClassify } from './mock.js';

// Siniflandirma modeli: Haiku 4.5 — siniflandirma icin hizli, ucuz, yeterli.
const MODEL = 'claude-haiku-4-5';

// API anahtari varsa gercek client; yoksa null (mock'a duseriz).
const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
const client = apiKey ? new Anthropic({ apiKey }) : null;

/// Kullanicinin ham ifadesini 7 zorluk kategorisinden birine siniflandirir.
/// GIZLILIK: cagrildiginda inputText pseudonimlestirilmis olmali (kimlik gitmez).
export async function classify(inputText: string): Promise<ClassificationResult> {
  if (!client) return finalize(mockClassify(inputText), 'mock');

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: CLASSIFICATION_SCHEMA } },
      messages: [{ role: 'user', content: inputText }],
    });

    // output_config.format ile ilk text blogu gecerli JSON icerir.
    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') throw new Error('LLM bos yanit dondurdu');

    const parsed = JSON.parse(textBlock.text);
    if (!isChallenge(parsed.challenge) || !isChallenge(parsed.alternativeChallenge)) {
      throw new Error(`LLM gecersiz kategori dondurdu: ${parsed.challenge}`);
    }

    const tailored = String(parsed.interventionText ?? '').trim();
    return finalize(
      {
        challenge: parsed.challenge,
        confidence: clamp01(Number(parsed.confidence)),
        reasoning: String(parsed.reasoning ?? ''),
        alternativeChallenge: parsed.alternativeChallenge,
        tailoredText: tailored || undefined,
      },
      'llm',
    );
  } catch (err) {
    // LLM hatasi -> sessizce mock'a dus (dongu kesilmesin), ama gorunur logla.
    console.error('[classifier] LLM hatasi, mock fallback:', err);
    return finalize(mockClassify(inputText), 'mock');
  }
}

function finalize(
  r: {
    challenge: ClassificationResult['challenge'];
    confidence: number;
    reasoning: string;
    alternativeChallenge: ClassificationResult['challenge'];
    tailoredText?: string;
  },
  source: ClassificationResult['source'],
): ClassificationResult {
  return {
    ...r,
    needsClarification: r.confidence < CONFIDENCE_THRESHOLD,
    source,
  };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
