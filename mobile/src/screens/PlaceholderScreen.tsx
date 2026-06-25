import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, space } from '../theme';

// Iskelet asamasinda sekme yer tutucusu. Sonra her sekme kendi icerigiyle dolacak.
export function PlaceholderScreen({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.soon}>Yakında</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space.xl, paddingTop: space.md },
  title: { fontSize: 28, color: colors.teal, fontFamily: fonts.extrabold },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  emoji: { fontSize: 44, marginBottom: space.lg },
  subtitle: { fontSize: 16, color: colors.textSoft, textAlign: 'center', lineHeight: 23, fontFamily: fonts.regular },
  soon: {
    marginTop: space.xl,
    color: colors.tealText,
    fontSize: 13,
    fontFamily: fonts.semibold,
    backgroundColor: colors.tealSoft,
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
