import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConsentToggle } from '../components/ConsentToggle';
import { saveConsent } from '../consent';
import { colors, radius, space } from '../theme';

// Ilk acilis: hos geldin + gizlilik anlatisi + granuler riza (DEHB / dongu AYRI).
// "Gizliligi ayrisma noktasi olarak anlat" (KVKK referansi §5).
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [adhd, setAdhd] = useState(false);
  const [cycle, setCycle] = useState(false);

  const start = async () => {
    if (!adhd) return;
    await saveConsent({ adhd, cycle });
    onDone();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>Pusula</Text>
        <Text style={styles.welcome}>Takıldığın anda, küçük bir adımla yanındayım.</Text>

        <View style={styles.privacy}>
          <Text style={styles.privacyTitle}>🔒 Önce gizlilik</Text>
          <Text style={styles.bullet}>• Verini cihazında tutuyoruz</Text>
          <Text style={styles.bullet}>• Kimliğini yapay zekâya göndermiyoruz</Text>
          <Text style={styles.bullet}>• İstediğin an silebilirsin</Text>
        </View>

        <Text style={styles.section}>İzinler (ayrı ayrı, istediğin an geri alabilirsin)</Text>
        <ConsentToggle
          title="DEHB destek verileri"
          desc="Takıldığın durumları işleyip sana uygun mikro-adımlar önermem için."
          value={adhd}
          onChange={setAdhd}
        />
        <ConsentToggle
          title="Döngü verisi (opsiyonel)"
          desc="Kadınsan: döngü-duyarlı destek için. Cihazında kalır, sonra da açabilirsin."
          value={cycle}
          onChange={setCycle}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.cta, !adhd && styles.ctaDisabled]} onPress={start} disabled={!adhd}>
          <Text style={styles.ctaText}>Başla</Text>
        </Pressable>
        {!adhd && <Text style={styles.hint}>Başlamak için DEHB destek iznini açman gerekiyor.</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.xl, paddingBottom: space.xxl },
  brand: { fontSize: 34, fontWeight: '800', color: colors.teal, marginTop: space.lg },
  welcome: { fontSize: 18, color: colors.text, marginTop: space.sm, lineHeight: 25 },
  privacy: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius,
    padding: space.lg,
    marginTop: space.xl,
    marginBottom: space.xl,
  },
  privacyTitle: { fontSize: 16, fontWeight: '700', color: colors.tealText, marginBottom: space.sm },
  bullet: { fontSize: 15, color: colors.textSoft, lineHeight: 24 },
  section: { fontSize: 14, color: colors.muted, marginBottom: space.md },
  footer: { padding: space.xl, borderTopWidth: 1, borderTopColor: colors.line },
  cta: { backgroundColor: colors.teal, borderRadius: radius, height: 52, alignItems: 'center', justifyContent: 'center' },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  hint: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: space.sm },
});
