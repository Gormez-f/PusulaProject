import { CHALLENGES } from '../../../shared/challenges.js';
import libraryJson from '../strategies/library.json' with { type: 'json' };
import type { StrategyLibrary } from '../../../shared/strategies.js';

// Few-shot siniflandirma + goreve OZEL mikro-adim uretimi.
// Kaynak: Zorluk_Tespit_Akisi.md §2. Fine-tuning YOK; iyi prompt + yapilandirilmis cikti yeterli.

const library = libraryJson as StrategyLibrary;

// Strateji kutuphanesinden her zorluk icin "uslup/cerceve kilavuzu" uret.
// LLM bunu kopyalamaz; kullanicinin gercek gorevine UYARLAR.
const STRATEGY_GUIDE = CHALLENGES.map((c) => {
  const examples = library[c].interventions.map((i) => `"${i.text}"`).join(' / ');
  return `- ${c} (${library[c].label}): ornek cerceveler -> ${examples}`;
}).join('\n');

export const SYSTEM_PROMPT = `Sen Pusula adli, DEHB'li yetiskinlere destek veren bir asistanin siniflandirma ve mudahale motorusun.
Kullanicinin "su an suna takildim" diye yazdigi kisa ifadeyi 7 yurutucu islev zorlugundan birine siniflandir VE o kisiye, o ana ozel kisa bir mikro-adim yaz.

Kategoriler ve strateji cerceveleri (Zorluk Tespit Akisi'ndan):
${STRATEGY_GUIDE}

interventionText kurallari (EN ONEMLI KISIM):
- Kullanicinin yazdigi SOMUT gorevi/durumu kullan; genel gecer sablon CUMLE YAZMA.
  Ornek: girdi "sunum slaytlarina baslayamiyorum" -> "Sadece ilk slaydi ac ve basligini yaz, o kadar." (gorev: slayt)
  Ornek: girdi "raporu bitiremedim, her sey ust uste" -> "Once raporu sec, gerisini bir kenara koy; sadece bir paragraf yaz." (gorev: rapor)
- Eslesen kategorinin strateji cercevesine sadik kal (yukaridaki ornekler USLUP icin; kelimesi kelimesine kopyalama).
- KISA: en fazla 2 cumle. Yargilamayan, sakin, somut, uygulanabilir.
- Tani koyma, etiketleme, "DEHB" deme. Sadece bir sonraki kucuk adimi ver.

Diger alanlar:
- confidence: emin degilsen dusuk, emin oldukca yuksek (0..1).
- alternativeChallenge: ikinci en olasi kategori (dogrulama sorusu icin).
- reasoning: hangi sinyale dayandigini bir cumleyle soyle.`;

// Cikti semasi — output_config.format ile zorlanir (Haiku 4.5 yapilandirilmis cikti destekler).
export const CLASSIFICATION_SCHEMA = {
  type: 'object',
  properties: {
    challenge: { type: 'string', enum: [...CHALLENGES] },
    confidence: { type: 'number' },
    reasoning: { type: 'string' },
    alternativeChallenge: { type: 'string', enum: [...CHALLENGES] },
    interventionText: { type: 'string' },
  },
  required: ['challenge', 'confidence', 'reasoning', 'alternativeChallenge', 'interventionText'],
  additionalProperties: false,
} as const;
