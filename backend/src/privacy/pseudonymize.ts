// KVKK kritik karari: ham hassas veri + kimlik LLM API'sine HIC gitmez.
// userPseudoId zaten anonim cihaz-id (kimlik degil). Burada serbest metindeki
// dogrudan tanimlayicilari (e-posta, telefon, TC, IBAN) LLM'e gitmeden once
// redakte ederiz. Veri minimizasyonu: sadece zorluk tespiti icin gereken kalir.

const REDACTIONS: Array<{ re: RegExp; tag: string }> = [
  { re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, tag: '[email]' },
  { re: /\bTR\d{2}[\s]?(\d{4}[\s]?){5}\d{2}\b/gi, tag: '[iban]' }, // TR IBAN
  { re: /\b\d{11}\b/g, tag: '[tckn]' }, // 11 haneli TC kimlik no
  { re: /(\+90|0)?[\s]?5\d{2}[\s]?\d{3}[\s]?\d{2}[\s]?\d{2}\b/g, tag: '[telefon]' },
];

/// LLM'e gonderilecek metni temizler. Orijinal (ham) metin cihaz/DB tarafinda
/// kalir; bu cikti yalnizca siniflandirma cagrisinda kullanilir.
export function pseudonymize(text: string): string {
  let out = text;
  for (const { re, tag } of REDACTIONS) {
    out = out.replace(re, tag);
  }
  return out.trim();
}
