import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors, fonts, radius, space } from '../theme';

// Granuler, geri alinabilir riza satiri (KVKK). Zorunlu olanlar kilitli isaretli.
export function ConsentToggle({
  title,
  desc,
  value,
  onChange,
  required,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange?: (v: boolean) => void;
  required?: boolean;
}) {
  return (
    <Pressable
      style={styles.row}
      onPress={() => !required && onChange?.(!value)}
      disabled={required}
    >
      <View style={styles.texts}>
        <Text style={styles.title}>
          {title}
          {required && <Text style={styles.req}>  • gerekli</Text>}
        </Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={required}
        trackColor={{ true: colors.teal, false: '#3A3D40' }}
        thumbColor="#FFFFFF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: space.lg,
    marginBottom: space.md,
  },
  texts: { flex: 1 },
  title: { fontSize: 16, color: colors.text, fontFamily: fonts.semibold },
  req: { fontSize: 12, color: colors.muted, fontFamily: fonts.medium },
  desc: { fontSize: 14, color: colors.textSoft, marginTop: 3, lineHeight: 20, fontFamily: fonts.regular },
});
