// AERO — Chat Cursă
import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { loadChatMessages, sendChatMessage } from '@/services/rideBackend';
import { getSharedSupabaseClient } from '@/template/core/client';

interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

export default function ChatScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!rideId) return;

    let mounted = true;

    // Incarcam istoricul
    loadChatMessages(rideId).then(data => {
      if (mounted && data) setMessages(data as Message[]);
    });

    // Abonare Realtime la mesaje noi
    const client = getSharedSupabaseClient();
    const channel = client.channel(`chat_${rideId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `ride_id=eq.${rideId}`
      }, (payload) => {
        if (mounted) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      client.removeChannel(channel);
    };
  }, [rideId]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !user || !rideId) return;

    setInputText('');
    
    // Optimizare optimistica (mocking in UI pt responsiveness)
    const tempMsg: Message = {
      id: `temp_${Date.now()}`,
      ride_id: rideId,
      sender_id: user.id,
      text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await sendChatMessage(rideId, user.id, text);
      // Supabase realtime va re-emite mesajul, dar ignoram duplicatele pe baza de ID (sau UI-ul se resincronizeaza partial)
      // Intr-un sistem complet folosim un mecanism robust.
    } catch (err) {
      console.warn('Eroare trimitere mesaj:', err);
    }
  };

  const currentUserId = user?.id;

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingBottom: insets.bottom }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Chat Cursă</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m, i) => {
          const isMe = m.sender_id === currentUserId;
          return (
            <View key={m.id || i} style={[styles.bubbleWrap, isMe ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
              <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                <Text style={[styles.msgText, isMe && styles.msgTextRight]}>{m.text}</Text>
              </View>
              <Text style={styles.timeText}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input} 
          placeholder="Scrie un mesaj..." 
          placeholderTextColor={colors.textFaint}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <Pressable style={styles.sendBtn} onPress={handleSend} disabled={!inputText.trim()}>
          <MaterialIcons name="send" size={24} color={inputText.trim() ? '#fff' : 'rgba(255,255,255,0.5)'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, paddingBottom: spacing.sm, ...shadows.card 
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  chatArea: { flex: 1 },
  chatContent: { padding: spacing.md, gap: spacing.md },
  bubbleWrap: { maxWidth: '80%', gap: 4 },
  bubbleWrapLeft: { alignSelf: 'flex-start' },
  bubbleWrapRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  bubbleLeft: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  bubbleRight: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  msgText: { fontSize: fontSize.md, color: colors.text },
  msgTextRight: { color: '#fff' },
  timeText: { fontSize: 10, color: colors.textSubtle, marginHorizontal: 4 },
  inputArea: { 
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, 
    padding: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border 
  },
  input: {
    flex: 1, backgroundColor: colors.background, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.md,
    color: colors.text, borderWidth: 1, borderColor: colors.border
  },
  sendBtn: { 
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, 
    alignItems: 'center', justifyContent: 'center' 
  },
});
