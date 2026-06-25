# Pusula MVP — Todo

## Parca 1 — Repo iskeleti  ✅
- [x] [T2] Monorepo klasor yapisi (/backend, /mobile, /shared)
- [x] [T2] backend: package.json + tsconfig + Fastify sunucu + GET /health
- [x] [T1] mobile: Expo iskelet + bos ekran
- [x] [T1] Dogrulama: backend ayaga kalkiyor, /health 200 donuyor (port 3333)

## Parca 2 — Veri katmani  ✅
- [x] [T2] Prisma schema (Interaction tablosu + bos baglam alanlari)
- [x] [T1] 7-kategori enum (shared/challenges.ts) + feedback tipi (shared/feedback.ts)
- [x] [T1] migration (init) + client uretildi + smoke testi gecti

## Parca 3 — Strateji kutuphanesi  ✅
- [x] [T2] strategies/library.json (7 kategori, 14 mudahale, Zorluk_Tespit_Akisi'ndan)
- [x] [T1] secici fonksiyon (selectIntervention) + test (tum kategoriler kapsanmis)

## Parca 4 — LLM siniflandirici  ✅
- [x] [T4] prompt + few-shot (Zorluk_Tespit_Akisi'ndan) + JSON cikti semasi
- [x] [T4] guven mantigi (esik 0.6; dusuk -> dogrulama sorusu, alternativeChallenge)
- [x] [T2] mock fallback (anahtar-kelime) + test (8/8)

## Parca 5 — API uclari  ✅
- [x] [T4] POST /interactions (siniflandir + mudahale dondur + logla) + Fastify body dogrulama
- [x] [T2] POST /interactions/:id/feedback
- [x] [T2] pseudonymize katmani (e-posta/telefon/TC/IBAN redaksiyon; LLM'e kimlik gitmez)

## Parca 6 — Mobil cekirdek ekran  ✅
- [x] [T4] HelpScreen (sohbet balonlari, InputBar, FeedbackBar, dogrulama sorusu, "Simdi degil" cipi)
- [x] [T2] api/client (postInteraction/postFeedback) + anonim cihaz-id (AsyncStorage + expo-crypto)
- [x] [T1] Dogrulama: typecheck temiz + Metro bundle (562 modul) gecti

## Parca 7 — Uctan uca dogrulama  ✅ (wire-level)
- [x] [T2] Tam dongu calisiyor: web bundle derlendi + tarayici-origin POST/interactions & feedback gecti (CORS)
- [ ] [T1] Kullanici gorsel onayi: tarayicida http://localhost:8081 acip dokunarak dene
