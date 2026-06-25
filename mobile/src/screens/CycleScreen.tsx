import { PlaceholderScreen } from './PlaceholderScreen';

// Dongu (kadinlar icin): adet dongusu girisi. KVKK: hassas veri -> ayri acik riza,
// tercihen cihazda. Luteal faz destegini agirliklandirir (ctxCyclePhase).
export function CycleScreen() {
  return (
    <PlaceholderScreen
      emoji="🌙"
      title="Döngü"
      subtitle="İstersen döngünü buraya girersin; Pusula duygusal taşmanın olası olduğu dönemlerde desteğini ayarlar. Verin cihazında kalır, ayrı rıza ile."
    />
  );
}
