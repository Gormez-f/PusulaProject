// Parca 2 duman testi: sema dogru mu? Kayit ekle -> oku -> feedback guncelle -> sil.
// Calistir: npx tsx src/db/smoke.ts
import { prisma } from './client.js';
import { isChallenge } from '../../../shared/challenges.js';
import { isFeedback } from '../../../shared/feedback.js';

async function main() {
  const created = await prisma.interaction.create({
    data: {
      userPseudoId: 'dev-device-0001',
      inputText: 'rapora bir turlu baslayamiyorum',
      inputMode: 'text',
      predictedChallenge: 'task_initiation',
      confidence: 0.82,
      reasoning: 'baslayamiyorum dili + sabah saati',
      interventionId: 'ti_2min',
      interventionText: 'Sadece 2 dakika ac, yapmak zorunda degilsin.',
      ctxHourOfDay: 9,
      // ctxCalendarLoad / ctxCyclePhase: MVP'de bos (null) — sema hazir.
    },
  });
  console.log('CREATED id =', created.id);
  console.log('challenge gecerli mi?', isChallenge(created.predictedChallenge));
  console.log('baglam alanlari (bos beklenir):', {
    calendar: created.ctxCalendarLoad,
    cycle: created.ctxCyclePhase,
    feedback: created.feedback,
  });

  const updated = await prisma.interaction.update({
    where: { id: created.id },
    data: { feedback: 'worked', feedbackAt: new Date() },
  });
  console.log('feedback set =', updated.feedback, '| gecerli mi?', isFeedback(updated.feedback!));

  const count = await prisma.interaction.count();
  console.log('toplam kayit =', count);

  await prisma.interaction.delete({ where: { id: created.id } });
  console.log('temizlendi. kalan =', await prisma.interaction.count());
  console.log('OK: sema dogrulandi.');
}

main()
  .catch((e) => {
    console.error('SMOKE FAIL:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
