// Strateji kutuphanesi tipleri. Backend & mobilde TEK kaynak.
import type { Challenge } from './challenges.js';

export interface Intervention {
  id: string;
  text: string;
  /// Mobil tarafa ipucu: hangi UI bileseni eslesir (timer, braindump, ...).
  uiHint?: string;
}

export interface StrategyEntry {
  label: string;
  interventions: Intervention[];
}

/// Tum kutuphanenin sekli: her zorluk -> mudahaleler.
export type StrategyLibrary = Record<Challenge, StrategyEntry>;
