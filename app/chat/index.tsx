import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '../../services/api';
import BottomNav from '../../components/BottomNav';

interface ChatPreview {
  id: string;
  otherUser: { id: string; name: string };
  lastMessage?: string;
  lastMessageAt?: string;
}

export default function ChatListScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    try {
      const res = await api.get<{ chats: ChatPreview[] }>('/chats');
      setChats(res.data.chats ?? []);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchChats(); }, [fetchChats]));

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#22C55E" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Conversas</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push(`/chat/${item.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.otherUser.name[0]?.toUpperCase()}</Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.otherUser.name}</Text>
              {item.lastMessage && (
                <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
              )}
            </View>
            {item.lastMessageAt && (
              <Text style={styles.time}>{new Date(item.lastMessageAt).toLocaleDateString('pt-BR')}</Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma conversa ainda 🤔</Text>}
      />
      <BottomNav active="Perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', padding: 16, paddingBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  chatItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  lastMsg: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  time: { fontSize: 11, color: '#9CA3AF' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 16 },
});
