// Geri bildirim ve girdi modu degerleri. Backend & mobilde TEK kaynak.
// (SQLite enum desteklemez; gecerlilik bu tiplerle uygulama katmaninda zorlanir.)

export const FEEDBACK_VALUES = ['worked', 'did_not_work'] as const;
export type Feedback = (typeof FEEDBACK_VALUES)[number];

export function isFeedback(value: string): value is Feedback {
  return (FEEDBACK_VALUES as readonly string[]).includes(value);
}

export const INPUT_MODES = ['text', 'voice'] as const;
export type InputMode = (typeof INPUT_MODES)[number];
