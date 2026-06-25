import { randomUUID } from 'expo-crypto';
import type { Challenge } from '../../shared/challenges';
import type { InteractionResponse } from './api/client';

// Etiketler burada gomulu (Metro export, mobil disindaki shared'dan calisma-zamani
// deger cekemiyor; tip importu babel tarafindan silinir, sorun degil).
const LABELS: Record<Challenge, string> = {
  task_initiation: 'Başlayamama',
  overwhelm: 'Aşırı yüklenme',
  time_blindness: 'Zaman körlüğü',
  distraction: 'Dağınıklık',
  hyperfocus: 'Hiperodak',
  forgetfulness: 'Unutkanlık',
  emotional_overflow: 'Duygusal taşma',
};

// Backend'e ulasilamadiginda (or. host'lanmis web demo) devreye giren istemci-tarafli
// yedek. Anahtar-kelime sinifladirma + strateji kutuphanesi. API anahtari ASLA
// istemcide olmadigindan gercek LLM yerine bu calisir; UX/akis aynen gosterilir.

function normalize(s: string): string {
  return s
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/â/g, 'a');
}

const KEYWORDS: Array<{ challenge: Challenge; words: string[] }> = [
  { challenge: 'task_initiation', words: ['baslayam', 'basla', 'erteli', 'erteleme', 'bir turlu'] },
  { challenge: 'overwhelm', words: ['her sey', 'cok fazla', 'ust uste', 'yetistire', 'bunaldim', 'yuklendim'] },
  { challenge: 'time_blindness', words: ['gec kal', 'zaman', 'saati kacir', 'ne kadar surd', 'gec olmus'] },
  { challenge: 'distraction', words: ['odaklanam', 'dagil', 'dikkat', 'atliyor', 'baska seye'] },
  { challenge: 'hyperfocus', words: ['duramiyor', 'saatlerdir', 'ara vere', 'mola'] },
  { challenge: 'forgetfulness', words: ['unut', 'neydi', 'hatirlam', 'aklimdan', 'aklimda'] },
  { challenge: 'emotional_overflow', words: ['berbat', 'yapamiyor', 'kotu hissed', 'agla', 'rezil', 'cokmus'] },
];

// Strateji kutuphanesi (her zorluk -> birincil mikro-mudahale).
const LIBRARY: Record<Challenge, { id: string; text: string; uiHint: string }> = {
  task_initiation: { id: 'ti_2min', text: 'Sadece 2 dakika. Aç yeter — bitirmek zorunda değilsin.', uiHint: 'timer_2min' },
  overwhelm: { id: 'ov_braindump', text: 'Kafandaki her şeyi boşalt; sonra sadece bir tanesini seç, gerisini bir kenara koy.', uiHint: 'braindump' },
  time_blindness: { id: 'tb_visible_timer', text: 'Süre gözünün önünde olsun — bir geri sayım başlatalım mı?', uiHint: 'countdown' },
  distraction: { id: 'ds_focus_block', text: 'Kısa bir odak bloğu: 15 dakika tek iş. Bildirimleri kısalım mı?', uiHint: 'focus_block' },
  hyperfocus: { id: 'hf_gentle_break', text: 'Bir süredir buradasın. Kısa bir mola, biraz su — sonra devam.', uiHint: 'break_reminder' },
  forgetfulness: { id: 'fg_quick_capture', text: 'Hemen yakala — tek dokunuşla kaydet, kaybolmasın. Sonra doğru yere koyarım.', uiHint: 'quick_capture' },
  emotional_overflow: { id: 'eo_soothe', text: 'Şu an zor, biliyorum. Önce bir nefes — yapacak bir şey yok, sadece buradayız.', uiHint: 'soothe' },
};

export function localClassify(inputText: string): InteractionResponse {
  const text = normalize(inputText);
  const hits = KEYWORDS.filter((k) => k.words.some((w) => text.includes(w))).map((k) => k.challenge);

  const challenge: Challenge = hits[0] ?? 'task_initiation';
  const alternative: Challenge = hits[1] ?? (challenge === 'task_initiation' ? 'overwhelm' : 'task_initiation');
  const confidence = hits.length >= 1 ? (hits.length === 1 ? 0.82 : 0.6) : 0.45;
  const needsClarification = confidence < 0.6;
  const iv = LIBRARY[challenge];

  return {
    id: randomUUID(),
    challenge,
    label: LABELS[challenge],
    confidence,
    reasoning: 'Çevrimdışı yedek: anahtar-kelime eşlemesi.',
    needsClarification,
    clarificationQuestion: needsClarification
      ? `${LABELS[challenge]} mi, yoksa ${LABELS[alternative]} mi?`
      : undefined,
    intervention: iv,
    source: 'mock',
  };
}
