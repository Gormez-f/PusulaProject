import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ConsentToggle } from '../components/ConsentToggle';
import { getConsent, saveConsent, resetConsent, type Consent } from '../consent';
import { clearTasks } from '../tasks';
import { showOnboardingAgain } from '../appState';
import { colors, fonts, radius, space } from '../theme';

// Ben / Ayarlar: rizalari yonet (KVKK granuler + geri alinabilir), tanitimi tekrar gor,
// verini sil. Icgoruler ileride.
export function MeScreen() {
  const [consent, setConsent] = useState<Consent>({ adhd: false, cycle: false });

  useFocusEffect(
    useCallback(() => {
      getConsent().then(setConsent);
    }, []),
  );

  const toggleCycle = async (v: boolean) => {
    const next = { adhd: consent.adhd, cycle: v };
    setConsent(next);
    await saveConsent(next);
  };

  const seeOnboarding = async () => {
    await resetConsent();
    showOnboardingAgain();
  };

  const deleteData = () => {
    Alert.alert(
      'Tüm verini sil',
      'Görevlerin ve rızaların cihazından silinecek. Bu geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await clearTasks();
            await resetConsent();
            showOnboardingAgain();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ben</Text>
        <Text style={styles.subtitle}>Gizlilik senin elinde.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.section}>İzinler</Text>
        <ConsentToggle
          title="DEHB destek verileri"
          desc="Uygulamanın çalışması için gerekli."
          value={consent.adhd}
          required
        />
        <ConsentToggle
          title="Döngü verisi"
          desc="Döngü-duyarlı destek için. Cihazında kalır; istediğin an aç/kapat."
          value={consent.cycle}
          onChange={toggleCycle}
        />

        <Text style={styles.section}>Uygulama</Text>
        <Pressable style={styles.row} onPress={seeOnboarding}>
          <Feather name="refresh-ccw" size={18} color={colors.tealText} />
          <Text style={styles.rowText}>Tanıtımı tekrar gör</Text>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </Pressable>

        <Pressable style={styles.row} onPress={deleteData}>
          <Feather name="trash-2" size={18} color={colors.accent} />
          <Text style={[styles.rowText, { color: colors.accent }]}>Tüm verimi sil</Text>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </Pressable>

        <Text style={styles.foot}>
          Verini cihazında tutuyoruz. Yapay zekâya kimliğini göndermiyoruz.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.sm },
  title: { fontSize: 28, color: colors.teal, fontFamily: fonts.extrabold },
  subtitle: { fontSize: 16, color: colors.textSoft, marginTop: 2, fontFamily: fonts.regular },
  list: { padding: space.lg, paddingBottom: space.xxl },
  section: { color: colors.muted, fontSize: 13, marginTop: space.md, marginBottom: space.sm, marginLeft: space.xs, fontFamily: fonts.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: space.lg,
    marginBottom: space.md,
  },
  rowText: { flex: 1, fontSize: 16, color: colors.text, fontFamily: fonts.medium },
  foot: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: space.lg, paddingHorizontal: space.lg, fontFamily: fonts.regular },
});
