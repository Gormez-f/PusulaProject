// Parca 3 testi: 7 kategori de kapsanmis mi, secici gecerli mudahale donuyor mu?
// Calistir: npx tsx src/strategies/test.ts
import { selectIntervention, library } from './index.js';
import { CHALLENGES } from '../../../shared/challenges.js';

let fail = 0;
const ids = new Set<string>();

for (const challenge of CHALLENGES) {
  const entry = library[challenge];
  const picked = selectIntervention(challenge);

  if (!picked?.id || !picked?.text) {
    console.error(`FAIL ${challenge}: gecerli mudahale donmedi`);
    fail++;
    continue;
  }
  // id'ler benzersiz olmali (loglama/secim tutarliligi).
  for (const iv of entry.interventions) {
    if (ids.has(iv.id)) {
      console.error(`FAIL: tekrar eden id "${iv.id}"`);
      fail++;
    }
    ids.add(iv.id);
  }
  console.log(`OK ${challenge.padEnd(20)} -> ${picked.id}: "${picked.text.slice(0, 40)}..."`);
}

console.log(`\n${CHALLENGES.length} kategori, ${ids.size} mudahale.`);
if (fail > 0) {
  console.error(`SONUC: ${fail} hata.`);
  process.exit(1);
}
console.log('SONUC: tum kategoriler kapsanmis, secici calisiyor. OK.');
