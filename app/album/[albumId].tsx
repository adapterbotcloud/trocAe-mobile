import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';
import type { Figurinha, Album } from '../../types';
import FigurinhaCard from '../../components/FigurinhaCard';

export default function AlbumDetailScreen() {
  const { albumId } = useLocalSearchParams<{ albumId: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [figurinhas, setFigurinhas] = useState<Figurinha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!albumId) return;
    const load = async () => {
      try {
        const [albumRes, figRes] = await Promise.all([
          api.get<Album>(`/albums/${albumId}`),
          api.get<{ figurinhas: Figurinha[] }>(`/albums/${albumId}/figurinhas`),
        ]);
        setAlbum(albumRes.data);
        setFigurinhas(figRes.data.figurinhas);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [albumId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#22C55E" /></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.albumTitle}>{album?.name ?? 'Álbum'}</Text>
        <Text style={styles.count}>{figurinhas.length} figurinhas</Text>
        <FlatList
          data={figurinhas}
          keyExtractor={(item) => item.id}
          numColumns={4}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <FigurinhaCard item={item} onPress={() => router.push(`/inventario`)} />
          )}
          contentContainerStyle={styles.grid}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 12 },
  albumTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  count: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  grid: { alignItems: 'center' },
});
