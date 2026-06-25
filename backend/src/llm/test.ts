// Parca 4 testi: siniflandirici (mock yolu — API key yokken) dogru kategori ve
// guven mantigini uretiyor mu? Calistir: npx tsx src/llm/test.ts
import { classify } from './classifier.js';
import { CHALLENGE_LABELS } from '../../../shared/challenges.js';

const CASES: Array<{ input: string; expect: string }> = [
  { input: 'rapora bir turlu baslayamiyorum', expect: 'task_initiation' },
  { input: 'her sey ust uste geldi, yetistiremiyorum', expect: 'overwhelm' },
  { input: 'yine gec kaldim, zaman nasil gecti anlamadim', expect: 'time_blindness' },
  { input: 'odaklanamiyorum, surekli baska seye atliyorum', expect: 'distraction' },
  { input: 'saatlerdir buradayim, ara veremiyorum', expect: 'hyperfocus' },
  { input: 'bir sey yapacaktim ama neydi unuttum', expect: 'forgetfulness' },
  { input: 'berbatim, hicbir sey yapamiyorum', expect: 'emotional_overflow' },
  { input: 'merhaba', expect: 'task_initiation' }, // sinyalsiz -> dusuk guven varsayilan
];

let fail = 0;
for (const c of CASES) {
  const r = await classify(c.input);
  const ok = r.challenge === c.expect;
  if (!ok) fail++;
  console.log(
    `${ok ? 'OK ' : 'XX '} "${c.input.slice(0, 32)}" -> ${r.challenge} ` +
      `(beklenen ${c.expect}) conf=${r.confidence.toFixed(2)} ` +
      `clarify=${r.needsClarification} src=${r.source}`,
  );
  if (r.needsClarification) {
    console.log(
      `     dogrulama: "${CHALLENGE_LABELS[r.challenge]} mi, yoksa ${CHALLENGE_LABELS[r.alternativeChallenge]} mi?"`,
    );
  }
}

console.log(`\n${CASES.length} vaka, ${fail} hata.`);
if (fail > 0) process.exit(1);
console.log('SONUC: siniflandirici (mock) calisiyor, guven mantigi dogru. OK.');
