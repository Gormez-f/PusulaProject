## Project State
- Phase: dev (tasarim + uygulama kabugu)
- Last completed: Telefonda canli dongu DOGRULANDI (Expo Go, SDK 54). Tasarim cilasi + COK SEKMELI kabuk kuruldu (onboarding/riza + 4 sekme)
- Next up: sekmeleri doldur (Takvim, Dongu giris+riza, Ben: rizalar/silme/icgoru)
- Blockers: tam Xcode yok -> Expo Go ile test. Disk dar (1.9Gi) - dikkatli kurulum

## KARAR DEGISIKLIGI (kullanici, 2026-06-25)
- Urun artik SADECE chat degil. Kullanici cok-sekmeli istiyor: Simdi(chat) / Takvim / Dongu(kadinlar) / Ben.
- Takvim ve Dongu orijinal MVP'de "kapsam disi/sonraki faz"ti; kullanici simdi istedi -> kabuk kuruldu, placeholder sekmeler.
- Mimari hazirdi: ctxCalendarLoad/ctxCyclePhase alanlari + dongu icin ayri KVKK rizasi.
- SDK 52 -> 54 yukseltildi (Expo Go SDK 54 istedi). RN 0.81.5, React 19.1.
- Navigasyon: @react-navigation/native + bottom-tabs (Expo Go'da calisir). Ikonlar emoji (vector-icons kurulmadi).
- Onboarding gate: consent.ts (AsyncStorage 'pusula.consent.v1'); DEHB rizasi zorunlu, dongu opsiyonel.

## Key Decisions
- Backend dili: TypeScript (Node.js + Fastify) — mobil ile tek dil, paylasilan tipler (2026-06-25)
- DB: SQLite + Prisma (ileride Postgres'e gecis) (2026-06-25)
- LLM: Anthropic claude-haiku-4-5, API key yoksa deterministik mock fallback (2026-06-25)
- Kimlik: anonim cihaz-id (login yok, User tablosu yok) — KVKK yuku minimum (2026-06-25)
- Gizlilik: ham hassas veri + kimlik LLM'e GITMEZ; pseudonim cagri (KVKK referansi) (2026-06-25)

## Active Context
- Branch: (git yok henuz)
- Recently changed: backend/prisma/schema.prisma (Interaction), src/db/client.ts, shared/feedback.ts
- Test suite: src/db/smoke.ts (manuel ekle/oku/guncelle/sil) — gecti
- NOT: port 3000 baska projede (Uyumatrix) kullanimda -> backend varsayilan port 3333
- DB: SQLite dev.db (gitignore); SQLite enum yok -> kategori/feedback String, gecerlilik shared/ tipleriyle
- LLM: @anthropic-ai/sdk ^0.106 (output_config.format yapilandirilmis cikti non-beta'da 0.106+ ile geliyor); model claude-haiku-4-5; guven esigi 0.6
- Mobil: import'lar UZANTISIZ olmali (Metro .js->.ts cozemez); shared tip-import'lari babel siyirir
- DIKKAT: mobile/expo-asset ^56 kuruldu (SDK 52 icin ~11.0.x olmali) - bundle gecti ama runtime'da `npx expo install --fix` ile hizalanmali
- Mobil canli test: backend localhost:3334; fiziksel cihaz icin config.ts'de LAN IP gerekir

## MVP Kapsam Disi (code inflation'a karsi)
- Otomatik davranis tespiti, ogrenen model, dongu tahmini, takvim entegrasyonu,
  B2B2C/klinik rapor, gercek STT, auth akisi, UI cilasi (UI ayri oturum)

## Ilerleme Sirasi (parcalar)
1. Repo iskeleti (Fastify /health + Expo bos ekran)  <- siradaki
2. Veri katmani (Prisma sema + 7-kategori enum)
3. Strateji kutuphanesi (library.json + secici)
4. LLM siniflandirici (prompt + JSON cikti + guven mantigi)
5. API uclari (POST /interactions, /feedback)
6. Mobil cekirdek ekran (girdi -> mudahale -> geri bildirim)
7. Uctan uca dogrulama
