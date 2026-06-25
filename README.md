# Pusula

DEHB'li yetiskinlere takildiklari anda destek veren, kisisellesen mobil asistan.

Cekirdek dongu (MVP): kullanici "su an suna takildim" der -> LLM 7 zorluk
kategorisinden birine siniflandirir -> eslesen mikro-mudahaleyi doner ->
kullanici "ise yaradi mi?" der -> loglanir.

## Yapi (monorepo)
- `backend/` — Fastify + TypeScript API (LLM cagrisi + veri saklama)
- `mobile/`  — Expo (React Native) mobil uygulama
- `shared/`  — backend & mobil arasinda paylasilan tipler (7 kategori vb.)
- `tasks/`   — yol haritasi (state.md, todo.md, lessons.md)

## Calistirma — backend
```
cd backend
npm install
npm run dev        # http://localhost:3333/health
```

## Referans dokumanlar
- `Pusula_ClaudeCode_Baslangic.md` — proje brief'i
- Zorluk Tespit Akisi — 7 zorluk -> sinyal -> mudahale (siniflandirma temeli)
- KVKK / Gizlilik Referansi — veri envanteri + gizlilik ilkeleri
