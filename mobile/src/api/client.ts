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
  const res = await fetch(`${API_BASE_URL}/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userPseudoId, inputText, inputMode: 'text' }),
  });
  if (!res.ok) throw new Error(`API hata ${res.status}`);
  return res.json();
}

export async function postFeedback(id: string, feedback: Feedback): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/interactions/${id}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback }),
  });
  if (!res.ok) throw new Error(`API hata ${res.status}`);
}
