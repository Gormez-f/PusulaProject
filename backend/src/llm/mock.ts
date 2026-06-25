import type { Challenge } from '../../../shared/challenges.js';

// Deterministik mock siniflandirici: ANTHROPIC_API_KEY yoksa devreye girer.
// Basit anahtar-kelime eslemesi (Zorluk_Tespit_Akisi dil sinyallerinden).
// Amac: testler ve demo, gercek API anahtari olmadan da uctan uca calissin.

const KEYWORDS: Array<{ challenge: Challenge; words: string[] }> = [
  { challenge: 'task_initiation', words: ['baslayam', 'basla', 'erteli', 'erteleme', 'bir turlu'] },
  { challenge: 'overwhelm', words: ['her sey', 'cok fazla', 'ust uste', 'yetistire', 'bunaldim'] },
  { challenge: 'time_blindness', words: ['gec kal', 'zaman', 'saati kacir', 'ne kadar surd', 'gec olmus'] },
  { challenge: 'distraction', words: ['odaklanam', 'dagil', 'dikkat', 'atlay'] },
  { challenge: 'hyperfocus', words: ['duramiyor', 'saatlerdir', 'ara vere', 'mola'] },
  { challenge: 'forgetfulness', words: ['unut', 'neydi', 'hatirlam', 'aklimdan'] },
  { challenge: 'emotional_overflow', words: ['berbat', 'yapamiyor', 'kotu hissed', 'agla', 'rezil'] },
];

export interface MockResult {
  challenge: Challenge;
  confidence: number;
  reasoning: string;
  alternativeChallenge: Challenge;
}

export function mockClassify(inputText: string): MockResult {
  const text = inputText.toLocaleLowerCase('tr');
  const hits: Challenge[] = [];

  for (const { challenge, words } of KEYWORDS) {
    if (words.some((w) => text.includes(w))) hits.push(challenge);
  }

  if (hits.length === 0) {
    // Hicbir sinyal yok -> dusuk guvenle baslayamama varsay (en yaygin giris noktasi).
    return {
      challenge: 'task_initiation',
      confidence: 0.3,
      reasoning: 'Mock: belirgin dil sinyali yok; varsayilan tahmin.',
      alternativeChallenge: 'overwhelm',
    };
  }

  // Tek eslesme -> orta guven; coklu eslesme -> ilk eslesme, alternatif ikincisi.
  const confidence = hits.length === 1 ? 0.55 : 0.5;
  return {
    challenge: hits[0],
    confidence,
    reasoning: `Mock: "${hits.join(', ')}" sinyallerine dayanan anahtar-kelime eslemesi.`,
    alternativeChallenge: hits[1] ?? (hits[0] === 'task_initiation' ? 'overwhelm' : 'task_initiation'),
  };
}
