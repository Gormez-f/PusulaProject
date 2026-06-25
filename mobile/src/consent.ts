import AsyncStorage from '@react-native-async-storage/async-storage';

// KVKK: granuler + geri alinabilir riza. DEHB ve dongu icin AYRI riza.
// Cihazda saklanir (minimum veri). Surum etiketi -> ileride aydinlatma degisirse migrasyon.
const KEY = 'pusula.consent.v1';

export interface Consent {
  adhd: boolean; // uygulamanin calismasi icin gerekli destek verileri
  cycle: boolean; // opsiyonel; kadinlar icin dongu-duyarli destek
  at?: string; // riza zaman damgasi (ISO)
}

const EMPTY: Consent = { adhd: false, cycle: false };

export async function getConsent(): Promise<Consent> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

export async function saveConsent(c: Omit<Consent, 'at'>): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...c, at: new Date().toISOString() }));
}

// Onboarding tamamlandi mi? (DEHB rizasi uygulamanin minimum kosulu)
export async function hasOnboarded(): Promise<boolean> {
  return (await getConsent()).adhd === true;
}

// Rizayi sifirla -> uygulama tekrar onboarding gosterir (KVKK: geri alinabilir).
export async function resetConsent(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
