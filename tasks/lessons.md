# Lessons

## [Sonnet] Mobil / Expo
- **Pattern**: Backend ESM stili `.js` uzantili import'lari mobile'a tasinca Metro cozemez (.js -> .ts/.tsx eslemesi yok).
- **Fix**: Mobil dosyalarda import'lari UZANTISIZ yaz. shared/ tip-import'lari `import type` oldugundan babel onlari siyirir; sorun yalniz yerel runtime import'larinda.

## [Sonnet] Expo minimal kurulum
- **Pattern**: El-yazimi package.json ile `expo export` "expo-asset cannot be found" verir; metro-config baseline paketleri bekler.
- **Fix**: expo-asset (ve gerekirse digerleri) ekle. Surum hizalamasi icin `npx expo install --fix` kullan (npm latest yanlis major cekebilir; or. expo-asset ^56 SDK52'ye uymaz).

## [Haiku] Anthropic SDK surumu
- **Pattern**: `output_config.format` (yapilandirilmis cikti) eski SDK'da (0.69) tiplenmiyor; TS2769 verir.
- **Fix**: @anthropic-ai/sdk >= 0.106 kullan; non-beta messages.create'de output_config destekli.
