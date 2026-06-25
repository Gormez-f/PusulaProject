// LLM siniflandirma sonucu. Backend & mobilde TEK kaynak.
import type { Challenge } from './challenges.js';

export interface ClassificationResult {
  /// 7 kategoriden tahmin edilen birincil zorluk.
  challenge: Challenge;
  /// 0..1 guven skoru (Zorluk_Tespit_Akisi §3).
  confidence: number;
  /// LLM gerekcesi (aciklanabilirlik).
  reasoning: string;
  /// Ikincil aday — dusuk guvende dogrulama sorusu kurmak icin.
  alternativeChallenge: Challenge;
  /// LLM'in goreve OZEL urettigi kisa mikro-adim (strateji kutuphanesine dayali).
  /// Mock'ta yoktur; o zaman kutuphane cumlesi kullanilir.
  tailoredText?: string;
  /// Guven dusukse true; mobil tarafta tek-dokunus dogrulama sorulur.
  needsClarification: boolean;
  /// Hangi motor uretti: gercek LLM mi, mock mu (loglama/teshis).
  source: 'llm' | 'mock';
}

/// Guven bu esigin altindaysa dogrulama sorusu sorulur (Zorluk_Tespit_Akisi §3).
export const CONFIDENCE_THRESHOLD = 0.6;
