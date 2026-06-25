import { API_BASE_URL } from '../config';
import { getDeviceId } from '../device';
import type { Challenge } from '../../../shared/challenges';
import type { Intervention } from '../../../shared/strategies';
import type { Feedback } from '../../../shared/feedback';

// Backend POST /interactions yanit sekli (routes/interactions.ts ile uyumlu).
export interface InteractionResponse {
  id: string;
  challenge: Challenge;
  label: string;
  confidence: number;
  reasoning: string;
  needsClarification: boolean;
  clarificationQuestion?: string;
  intervention: Intervention;
  source: 'llm' | 'mock';
}

export async function postInteraction(inputText: string): Promise<InteractionResponse> {
  const userPseudoId = await getDeviceId();
  try {
    const res = await fetch(`${API_BASE_URL}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPseudoId, inputText, inputMode: 'text' }),
    });
    if (!res.ok) throw new Error(`API hata ${res.status}`);
    return res.json();
  } catch {
    // Backend yoksa (or. host'lanmis web demo) istemci-tarafli yedek.
    const { localClassify } = await import('../localFallback');
    return localClassify(inputText);
  }
}

export async function postFeedback(id: string, feedback: Feedback): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/interactions/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    });
  } catch {
    // Backend yoksa geri bildirim kaydedilmez; demo akisini engelleme.
  }
}
