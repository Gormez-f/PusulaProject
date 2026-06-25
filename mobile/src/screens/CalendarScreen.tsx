import { useCallback, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTask, completeTask, listTasks, setFocus, type Task } from '../tasks';
import { requestHelp } from '../handoff';
import { BUCKETS, bucketOf, formatDue, isOverdue } from '../dates';
import { colors, fonts, radius, shadow, space } from '../theme';

// Takvim > tarihli ajanda: gorevleri tarih/saatle gir, Bugun/Yarin/Bu hafta/Sonra
// gruplu gor. DEHB-dostu: yine tek "SIMDI" odagi + Yardim->Simdi koprusu.
export function CalendarScreen() {
  const nav = useNavigation<any>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState('');
  const [draftDue, setDraftDue] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listTasks().then(setTasks);
    }, []),
  );

  const add = async () => {
    const t = draft.trim();
    if (!t) return;
    setTasks(await addTask(t, draftDue?.toISOString()));
    setDraft('');
    setDraftDue(null);
  };

  const help = (text: string) => {
    requestHelp(text);
    nav.navigate('Şimdi');
  };

  const focusTask = tasks.find((t) => t.focus);
  const groups = BUCKETS.map((b) => ({
    ...b,
    items: tasks
      .filter((t) => !t.focus && bucketOf(t.due) === b.key)
      .sort((a, c) => {
        if (a.due && c.due) return new Date(a.due).getTime() - new Date(c.due).getTime();
        if (a.due) return -1;
        if (c.due) return 1;
        return new Date(c.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
  })).filter((g) => g.items.length > 0);

  const onPickerChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && date) setDraftDue(date);
    } else if (date) {
      setDraftDue(date);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Takvim</Text>
        <Text style={styles.subtitle}>Ne, ne zaman?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {/* Gorev ekleme + tarih */}
        <View style={styles.addCard}>
          <TextInput
            style={styles.input}
            placeholder="Aklındakini yaz…"
            placeholderTextColor={colors.muted}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={add}
            returnKeyType="done"
          />
          <View style={styles.addRow}>
            <Pressable style={styles.datePill} onPress={() => setShowPicker(true)}>
              <Feather name="calendar" size={15} color={draftDue ? colors.tealText : colors.muted} />
              <Text style={[styles.datePillText, draftDue && { color: colors.tealText }]}>
                {draftDue ? formatDue(draftDue.toISOString()) : 'Tarih ekle'}
              </Text>
              {draftDue && (
                <Pressable onPress={() => setDraftDue(null)} hitSlop={8}>
                  <Feather name="x" size={14} color={colors.muted} />
                </Pressable>
              )}
            </Pressable>
            <Pressable style={[styles.addBtn, !draft.trim() && styles.btnDisabled]} onPress={add} disabled={!draft.trim()}>
              <Text style={styles.addBtnText}>Ekle</Text>
            </Pressable>
          </View>
        </View>

        {tasks.length === 0 && (
          <Text style={styles.empty}>
            Kafandaki her şeyi buraya boşalt. Tarihli olanları gruplarım, sadece bir tanesini "şimdi" seçeriz.
          </Text>
        )}

        {/* SIMDI odagi */}
        {focusTask && (
          <View style={styles.focusCard}>
            <Text style={styles.focusLabel}>ŞİMDİ</Text>
            <Text style={styles.focusText}>{focusTask.text}</Text>
            {focusTask.due && <Text style={styles.focusDue}>{formatDue(focusTask.due)}</Text>}
            <View style={styles.focusBtns}>
              <Pressable style={styles.helpBtn} onPress={() => help(focusTask.text)}>
                <Text style={styles.helpBtnText}>Yardım al</Text>
              </Pressable>
              <Pressable style={styles.doneBtn} onPress={async () => setTasks(await completeTask(focusTask.id))}>
                <Text style={styles.doneBtnText}>Bitti ✓</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Tarih gruplari */}
        {groups.map((g) => (
          <View key={g.key}>
            <Text style={styles.section}>{g.label}</Text>
            {g.items.map((t) => (
              <View key={t.id} style={styles.row}>
                <Pressable style={styles.rowMain} onPress={async () => setTasks(await setFocus(t.id))}>
                  <Text style={styles.rowText}>{t.text}</Text>
                  {t.due && (
                    <Text style={[styles.rowDue, isOverdue(t.due) && { color: colors.accent }]}>
                      {formatDue(t.due)}
                    </Text>
                  )}
                </Pressable>
                <Pressable onPress={async () => setTasks(await completeTask(t.id))} hitSlop={10}>
                  <Feather name="x" size={20} color={colors.muted} />
                </Pressable>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Tarih secici */}
      {showPicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
          <Pressable style={styles.modalBg} onPress={() => setShowPicker(false)}>
            <Pressable style={styles.sheet}>
              <DateTimePicker
                value={draftDue ?? new Date()}
                mode="datetime"
                display="spinner"
                themeVariant="dark"
                onChange={onPickerChange}
              />
              <Pressable style={styles.sheetBtn} onPress={() => setShowPicker(false)}>
                <Text style={styles.sheetBtnText}>Tamam</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker value={draftDue ?? new Date()} mode="date" onChange={onPickerChange} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.sm },
  title: { fontSize: 28, color: colors.teal, fontFamily: fonts.extrabold },
  subtitle: { fontSize: 16, color: colors.textSoft, marginTop: 2, fontFamily: fonts.regular },
  list: { padding: space.lg, paddingBottom: space.xxl },
  addCard: { backgroundColor: colors.card, borderRadius: radius, padding: space.md, marginBottom: space.lg, ...shadow },
  input: { paddingHorizontal: space.sm, paddingVertical: space.md, fontSize: 16, color: colors.text, fontFamily: fonts.regular },
  addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  datePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.tealSoft, borderRadius: 999, paddingVertical: space.sm, paddingHorizontal: space.md },
  datePillText: { color: colors.muted, fontSize: 14, fontFamily: fonts.medium },
  addBtn: { backgroundColor: colors.teal, borderRadius: radius, paddingHorizontal: space.xl, height: 44, justifyContent: 'center' },
  btnDisabled: { opacity: 0.45 },
  addBtnText: { color: '#FFFFFF', fontFamily: fonts.bold },
  empty: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: space.xl, paddingHorizontal: space.lg, fontFamily: fonts.regular },
  focusCard: { backgroundColor: colors.panel, borderRadius: radius, padding: space.xl, marginBottom: space.xl, ...shadow },
  focusLabel: { color: colors.accent, fontSize: 12, letterSpacing: 1, fontFamily: fonts.extrabold },
  focusText: { color: '#FFFFFF', fontSize: 20, marginTop: space.sm, lineHeight: 27, fontFamily: fonts.semibold },
  focusDue: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: space.xs, fontFamily: fonts.medium },
  focusBtns: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  helpBtn: { backgroundColor: colors.accent, borderRadius: 999, paddingVertical: space.md, paddingHorizontal: space.xl },
  helpBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: fonts.bold },
  doneBtn: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999, paddingVertical: space.md, paddingHorizontal: space.lg },
  doneBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: fonts.semibold },
  section: { color: colors.muted, fontSize: 13, marginTop: space.md, marginBottom: space.sm, marginLeft: space.xs, fontFamily: fonts.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius, paddingVertical: space.md, paddingHorizontal: space.lg, marginBottom: space.sm },
  rowMain: { flex: 1 },
  rowText: { fontSize: 16, color: colors.text, fontFamily: fonts.regular },
  rowDue: { fontSize: 13, color: colors.tealText, marginTop: 3, fontFamily: fonts.medium },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius, borderTopRightRadius: radius, padding: space.lg, paddingBottom: space.xxl },
  sheetBtn: { backgroundColor: colors.teal, borderRadius: radius, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  sheetBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: fonts.bold },
});
