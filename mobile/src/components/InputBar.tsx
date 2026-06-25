import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius, shadow, space } from '../theme';

// Alt giris cubugu. MVP'de metin esas; "sesle anlat" ipucu olarak durur (ses sonraki faz).
export function InputBar({ onSend, disabled }: { onSend: (t: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState('');

  const send = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue('');
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.wrap}>
      <View style={styles.inputWrap}>
        <Text style={styles.mic}>🎤</Text>
        <TextInput
          style={styles.input}
          placeholder="Sesle anlat — Pusula dinliyor"
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={send}
          editable={!disabled}
          multiline
        />
      </View>
      <Pressable style={[styles.btn, !canSend && styles.btnDisabled]} onPress={send} disabled={!canSend}>
        <Text style={styles.btnText}>Gönder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.md },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.card,
    borderRadius: radius,
    paddingHorizontal: space.lg,
    minHeight: 48,
    ...shadow,
  },
  mic: { fontSize: 16 },
  input: { flex: 1, maxHeight: 120, paddingVertical: space.md, fontSize: 16, color: colors.text, fontFamily: fonts.regular },
  btn: { backgroundColor: colors.teal, borderRadius: radius, paddingHorizontal: space.xl, height: 48, justifyContent: 'center' },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#FFFFFF', fontFamily: fonts.bold },
});
