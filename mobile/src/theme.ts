// Pusula gorsel dili — KOYU tema (gri-siyaha yakin zemin, sicak teal vurgu).
// Sakin, dusuk surtunmeli, yargilamayan.
export const colors = {
  teal: '#1F7A72', // ana teal (dolgu: butonlar, kullanici balonu)
  tealText: '#63B9AD', // koyu zeminde okunur parlak teal (basliklar, aktif sekme, cip metni)
  tealSoft: '#1C2A28', // teal-tonlu koyu yuzey (cipler, riza kutusu)
  bg: '#1A1B1E', // gri-siyaha yakin zemin
  panel: '#0E2E2B', // koyu yesil panel (odak karti)
  text: '#F2F1ED', // ana metin (acik)
  textSoft: '#B6BBB8', // ikincil metin
  accent: '#E8856B', // olculu sicak vurgu (mercan) — kucuk CTA'larda
  muted: '#8B908D', // soluk
  card: '#242629', // yukseltilmis yuzey (kartlar, giris, sekme cubugu)
  line: '#2E3034', // ince ayirici
};

// Inter font aileleri (App.tsx'te useFonts ile yuklenir).
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
};

export const radius = 20;

// Bosluk olcegi (4'un katlari).
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

// Koyu temada golge zayif kalir; kart yuzeyi zemindan acik oldugu icin ayrisma zaten var.
export const shadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.25,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};
