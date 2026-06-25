import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, shadow, space } from '../theme';

// Sohbet balonu. DEHB'li kullanici uzun metin okumaz -> kisa tut.
export function Bubble({ from, children }: { from: 'user' | 'assistant'; children: string }) {
  const isUser = from === 'user';
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser && <Text style={styles.who}>Pusula</Text>}
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text style={[styles.text, isUser && styles.userText]}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: space.sm },
  rowUser: { alignItems: 'flex-end' },
  rowAssistant: { alignItems: 'flex-start' },
  who: { fontSize: 12, color: colors.muted, marginLeft: space.md, marginBottom: space.xs, fontFamily: fonts.semibold },
  bubble: { maxWidth: '84%', paddingVertical: space.md, paddingHorizontal: space.lg, borderRadius: radius },
  user: { backgroundColor: colors.teal, borderBottomRightRadius: 6 },
  assistant: { backgroundColor: colors.card, borderBottomLeftRadius: 6, ...shadow },
  text: { fontSize: 16, lineHeight: 23, color: colors.text, fontFamily: fonts.regular },
  userText: { color: '#FFFFFF' },
});
