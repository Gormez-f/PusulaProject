import libraryJson from './library.json' with { type: 'json' };
import { CHALLENGES, type Challenge } from '../../../shared/challenges.js';
import type { Intervention, StrategyLibrary } from '../../../shared/strategies.js';

export const library = libraryJson as StrategyLibrary;

/// Modul yuklenirken bir kez: kutuphane 7 kategorinin hepsini kapsiyor mu?
/// Eksik kategori = sessiz hata; bastan patlat.
for (const challenge of CHALLENGES) {
  const entry = library[challenge];
  if (!entry || entry.interventions.length === 0) {
    throw new Error(`Strateji kutuphanesi eksik: "${challenge}" icin mudahale yok.`);
  }
}

/// Bir zorluk icin mikro-mudahale sec.
/// MVP: deterministik — birincil (ilk) mudahaleyi dondur.
/// (Kisisellestirme/rotasyon sonraki faz; secim mantigi tek yerde toplandi.)
export function selectIntervention(challenge: Challenge): Intervention {
  return library[challenge].interventions[0];
}
