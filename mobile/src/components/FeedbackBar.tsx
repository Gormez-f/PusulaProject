import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, space } from '../theme';
import type { Feedback } from '../../../shared/feedback';

// "Ise yaradi mi?" + her zaman kolay bir cikis cipi ("Simdi degil").
export function FeedbackBar({
  onFeedback,
  onDismiss,
}: {
  onFeedback: (f: Feedback) => void;
  onDismiss: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable style={[styles.chip, styles.worked]} onPress={() => onFeedback('worked')}>
        <Text style={styles.chipText}>İşe yaradı</Text>
      </Pressable>
      <Pressable style={[styles.chip, styles.didnt]} onPress={() => onFeedback('did_not_work')}>
        <Text style={styles.chipTextDark}>Yaramadı</Text>
      </Pressable>
      <Pressable style={styles.dismiss} onPress={onDismiss}>
        <Text style={styles.dismissText}>Şimdi değil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm, marginTop: space.sm, marginLeft: space.md },
  chip: { paddingVertical: space.sm + 1, paddingHorizontal: space.lg, borderRadius: 999 },
  worked: { backgroundColor: colors.teal },
  didnt: { backgroundColor: colors.tealSoft },
  chipText: { color: '#FFFFFF', fontSize: 14, fontFamily: fonts.semibold },
  chipTextDark: { color: colors.tealText, fontSize: 14, fontFamily: fonts.semibold },
  dismiss: { paddingVertical: space.sm, paddingHorizontal: space.sm },
  dismissText: { color: colors.muted, fontSize: 14, fontFamily: fonts.regular },
});
