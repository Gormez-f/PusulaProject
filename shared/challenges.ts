// Pusula — 7 yurutucu islev zorlugu. Backend ve mobilde TEK kaynak.
// Kaynak: Zorluk_Tespit_Akisi.md §2

export const CHALLENGES = [
  'task_initiation',   // Baslayamama
  'overwhelm',         // Asiri yuklenme
  'time_blindness',    // Zaman korlugu
  'distraction',       // Daginiklik
  'hyperfocus',        // Hiperodak (duramama)
  'forgetfulness',     // Unutkanlik (calisma bellegi)
  'emotional_overflow', // Duygusal tasma / RSD
] as const;

export type Challenge = (typeof CHALLENGES)[number];

// Insan-okunur Turkce etiketler (UI ve loglama icin).
export const CHALLENGE_LABELS: Record<Challenge, string> = {
  task_initiation: 'Baslayamama',
  overwhelm: 'Asiri yuklenme',
  time_blindness: 'Zaman korlugu',
  distraction: 'Daginiklik',
  hyperfocus: 'Hiperodak',
  forgetfulness: 'Unutkanlik',
  emotional_overflow: 'Duygusal tasma',
};

export function isChallenge(value: string): value is Challenge {
  return (CHALLENGES as readonly string[]).includes(value);
}
