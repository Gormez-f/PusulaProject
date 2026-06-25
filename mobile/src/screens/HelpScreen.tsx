import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Bubble } from '../components/Bubble';
import { InputBar } from '../components/InputBar';
import { FeedbackBar } from '../components/FeedbackBar';
import { postInteraction, postFeedback } from '../api/client';
import { takePendingHelp } from '../handoff';
import { colors, fonts, space } from '../theme';
import type { Feedback } from '../../../shared/feedback';

// Bos durumda dusuk surtunmeli hizli baslangiclar (kullanici yazmak zorunda kalmasin).
const QUICK_STARTS = ['Başlayamıyorum', 'Çok yüklendim', 'Odaklanamıyorum', 'Aklımdan çıktı'];

interface AssistantItem {
  kind: 'assistant';
  id: string;
  text: string;
  clarification?: string;
  resolved: boolean;
  note?: string;
}
type Item = { kind: 'user'; text: string } | AssistantItem | { kind: 'error'; text: string };

export function HelpScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollDown = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

  const handleSend = async (text: string) => {
    setItems((prev) => [...prev, { kind: 'user', text }]);
    setLoading(true);
    scrollDown();
    try {
      const r = await postInteraction(text);
      setItems((prev) => [
        ...prev,
        {
          kind: 'assistant',
          id: r.id,
          text: r.intervention.text,
          clarification: r.needsClarification ? r.clarificationQuestion : undefined,
          resolved: false,
        },
      ]);
    } catch {
      setItems((prev) => [...prev, { kind: 'error', text: 'Bağlanamadım. Biraz sonra tekrar dene.' }]);
    } finally {
      setLoading(false);
      scrollDown();
    }
  };

  const resolve = (id: string, note: string) =>
    setItems((prev) =>
      prev.map((it) => (it.kind === 'assistant' && it.id === id ? { ...it, resolved: true, note } : it)),
    );

  const handleFeedback = async (id: string, f: Feedback) => {
    resolve(id, f === 'worked' ? 'Sevindim. Buradayım.' : 'Tamam, başka bir şey deneriz.');
    try {
      await postFeedback(id, f);
    } catch {
      /* geri bildirim yazimi basarisiz olsa da kullaniciyi engelleme */
    }
  };

  // Takvim'den "Yardim al" ile gelindiyse, o gorevi otomatik gonder.
  useFocusEffect(
    useCallback(() => {
      const pending = takePendingHelp();
      if (pending) handleSend(pending);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pusula</Text>
          <Text style={styles.subtitle}>Şu an neye takıldın?</Text>
        </View>

        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.list}>
          {items.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Aklındakini yaz — küçük bir adımla başlayalım.
              </Text>
              <View style={styles.chips}>
                {QUICK_STARTS.map((q) => (
                  <Pressable key={q} style={styles.quickChip} onPress={() => handleSend(q)} disabled={loading}>
                    <Text style={styles.quickChipText}>{q}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {items.map((it, i) => {
            if (it.kind === 'user') return <Bubble key={i} from="user">{it.text}</Bubble>;
            if (it.kind === 'error') return <Bubble key={i} from="assistant">{it.text}</Bubble>;
            return (
              <View key={i}>
                <Bubble from="assistant">{it.text}</Bubble>
                {it.clarification && <Text style={styles.clarify}>{it.clarification}</Text>}
                {it.resolved ? (
                  <Text style={styles.note}>{it.note}</Text>
                ) : (
                  <FeedbackBar
                    onFeedback={(f) => handleFeedback(it.id, f)}
                    onDismiss={() => resolve(it.id, 'Şimdi değil — hazır olduğunda buradayım.')}
                  />
                )}
              </View>
            );
          })}
          {loading && <ActivityIndicator color={colors.teal} style={styles.loading} />}
        </ScrollView>

        <InputBar onSend={handleSend} disabled={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.sm },
  title: { fontSize: 30, color: colors.teal, letterSpacing: 0.2, fontFamily: fonts.extrabold },
  subtitle: { fontSize: 16, color: colors.textSoft, marginTop: 2, fontFamily: fonts.regular },
  list: { padding: space.lg, paddingBottom: space.xl },
  empty: { marginTop: space.xxl, alignItems: 'center', paddingHorizontal: space.lg },
  emptyText: { color: colors.muted, textAlign: 'center', fontSize: 16, lineHeight: 22, fontFamily: fonts.regular },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.sm, marginTop: space.xl },
  quickChip: {
    backgroundColor: colors.tealSoft,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.lg,
    borderRadius: 999,
  },
  quickChipText: { color: colors.tealText, fontSize: 15, fontFamily: fonts.medium },
  clarify: { color: colors.muted, fontSize: 14, marginLeft: space.md, marginTop: space.xs, fontStyle: 'italic', fontFamily: fonts.regular },
  note: { color: colors.tealText, fontSize: 14, marginLeft: space.md, marginTop: space.sm, fontFamily: fonts.medium },
  loading: { marginTop: space.md },
});
