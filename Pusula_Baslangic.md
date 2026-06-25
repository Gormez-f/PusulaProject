# Pusula — Claude Code Başlangıç Paketi

> Bu dosyayı Antigravity'de Claude Code'a ver. Birlikte ekleyeceğin referans dokümanları en alttaki listede bulabilirsin.

## Proje özeti
Pusula, DEHB'li yetişkinlere (ilaçlı/ilacını azaltmış/bırakmış dönemde) **takıldıkları anda** destek veren, kişiselleşen bir mobil asistandır. Asıl iş **anlık destek**; takvim, deadline ve (isteğe bağlı) hormonal döngü ise sistemin daha akıllı destek vermesi için **bağlamdır** — kendi başına amaç değildir. Ürün 7 yürütücü işlev zorluğunu kapsar: başlayamama, aşırı yüklenme, zaman körlüğü, dağınıklık, hiperodak, unutkanlık, duygusal taşma.

---

## 1) İlk prompt — Backend + Mobil iskelet
(Bunu Claude Code'a olduğu gibi yapıştır.)

> Pusula adında bir mobil uygulama geliştiriyorum: DEHB'li yetişkinlere takıldıkları anda destek veren, kişiselleşen bir asistan. Ekteki dokümanlar (Zorluk Tespit Akışı, KVKK/Gizlilik) ürünün kaynağıdır; bunları esas al.
>
> Şu an MVP'nin **backend + temel mobil iskeletini** kurmak istiyorum. Henüz makine öğrenmesi / otomatik tespit YOK. MVP'de çekirdek döngü açık girdiyle çalışır:
> kullanıcı "şu an şuna takıldım" der (yazı/ses) → bir LLM bunu 7 zorluk kategorisinden birine sınıflandırır → eşleşen mikro-müdahaleyi döner → kullanıcı "işe yaradı mı?" geri bildirimini verir → bu loglanır.
>
> **Kod yazmaya BAŞLAMADAN önce** benimle şunları netleştir ve bir plan çıkar:
> 1. Önerdiğin mimari ve klasör yapısı (mobil: React Native/Expo; backend: hafif API + LLM çağrısı + veri saklama).
> 2. Veri modeli — her etkileşimi yapılandırılmış saklayan şema: girdi, tahmin edilen zorluk, sunulan müdahale, geri bildirim (işe yaradı/yaramadı), zaman damgası ve bağlam alanları (saat, takvim, döngü — şimdilik boş olsa da şemada yer alsın). Bu veri gelecekte ML için eğitim verisi olacak; baştan temiz ve tutarlı olmalı.
> 3. LLM sınıflandırma katmanı: 7 kategoriye few-shot sınıflandırma + yapılandırılmış (JSON) çıktı. Eğitim/fine-tuning YOK; iyi bir prompt yeterli. Strateji kütüphanesi (her zorluk → mikro-müdahaleler) ayrı, kolay güncellenebilir bir yapıda olsun.
> 4. Gizlilik: minimum veri; LLM'e kimliksiz/pseudonim çağrı; hassas veriyi mümkün olduğunca yerelde tut.
> 5. MVP kapsamına neyin GİRMEYECEĞİ: otomatik (davranıştan) tespit, kişiselleştirme/öğrenen model, döngü tahmini, takvim entegrasyonu, B2B2C/klinik rapor — hepsi sonraki faz.
>
> Önce bu planı bana sun. Onaylayınca **küçük, doğrulanabilir parçalar** halinde ilerleyelim; tek seferde her şeyi kodlama. Her parçayı test subagent'ıyla doğrula.

---

## 2) İlk prompt — Tasarım / UI
(Backend iskeleti oturduktan sonra, ayrı bir oturumda ver.)

> Pusula'nın mobil arayüzünü tasarla. Ürün DEHB'li yetişkinler için, o yüzden tasarım **düşük sürtünmeli, sakin ve yargılamayan** olmalı — az adım, sade ekran, suçlamayan dil.
>
> Görsel dil (mevcut mockup'larla tutarlı olsun):
> - Palet: sakin teal-yeşil (`#1F7A72`), sıcak kırık-beyaz zemin (`#FAF8F4`), koyu yeşil panel (`#0E2E2B`), metin `#1A1A1A`; çok ölçülü kullanılan yumuşak bir sıcak vurgu (mercan/şeftali) sadece küçük CTA'larda.
> - Yuvarlatılmış köşeli kartlar, bol beyaz alan, hafif gölge, modern sans (Inter).
> - Sohbet tarzı ana ekran: kullanıcı/asistan balonları, altta "Sesle anlat — Pusula dinliyor" çubuğu.
> - Proaktif mesajlarda üstte küçük **"Pusula fark etti"** rozeti (zil ikonu) ve mesajın altında her zaman kolay bir çıkış çipi (örn. **"Şimdi değil"**).
> - Balonlar kısa olsun (DEHB'li kullanıcı uzun metni okumaz).
>
> Önce 3 temel ekranı tasarla: (1) ana yardım ekranı, (2) proaktif bildirim örneği, (3) onboarding + rıza. Önce düzeni göster, onaylayınca koda dök.

---

## Nasıl çalışılır (kısa notlar)
- Backend ile tasarımı aynı anda kovalama; önce çekirdek döngüyü uçtan uca çalıştır (ekran → API → LLM → geri bildirim).
- Veri şemasını ilk günden temiz kur — gelecekteki ML'in buna bağlı.
- Kapsamı dar tut; ajan fazla kod üretmeye (code inflation) eğilimli, "ne yapılmayacak" listesini hatırlat.
- Kimlik doğrulama ve hassas veri akışında ajanın çıktısını körü körüne kabul etme; orayı sen kontrol et.

## Bu pakete ekle (Claude Code'a / knowledge base'e ver)
1. **Bu dosya** — Pusula_ClaudeCode_Baslangic.md
2. **Zorluk_Tespit_Akisi.md** — 7 zorluk → sinyal → müdahale eşleştirmesi (sınıflandırma ve strateji kütüphanesinin temeli)
3. **KVKK_Gizlilik_Referansi.md** — veri envanteri + gizlilik ilkeleri (veri modeli ve gizlilik kararları için)
