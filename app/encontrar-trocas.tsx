import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import TradeCard from '../components/TradeCard';
import BottomNav from '../components/BottomNav';
import api from '../services/api';
import type { TradeMatch } from '../types';

export default function EncontrarTrocasScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [matches, setMatches] = useState<TradeMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.post<{ matches: TradeMatch[] }>('/trades/find', { userId: user.id });
      setMatches(res.data.matches ?? []);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [fetchMatches])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const typeColors = { PERFEITA: '#22C55E', PARCIAL: '#F59E0B', GRUPO: '#3B82F6' };

  const perfectas = matches.filter((m) => m.type === 'PERFEITA');
  const parciais = matches.filter((m) => m.type === 'PARCIAL');

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#22C55E" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item, idx) => `${item.user.id}-${idx}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#22C55E" />}
        renderItem={({ item }) => (
          <TradeCard
            match={item}
            onPress={() => router.push({ pathname: '/proposta/[tradeId]', params: { tradeId: item.user.id, match: JSON.stringify(item) } })}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>🔍 Encontrar Trocas</Text>
            {perfectas.length > 0 && (
              <View style={[styles.badge, { backgroundColor: typeColors.PERFEITA }]}>
                <Text style={styles.badgeText}>🟢 {perfectas.length} Perfeitas</Text>
              </View>
            )}
            {parciais.length > 0 && (
              <View style={[styles.badge, { backgroundColor: typeColors.PARCIAL }]}>
                <Text style={styles.badgeText}>🟡 {parciais.length} Parciais</Text>
              </View>
            )}
          </View>
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma troca encontrada 😢</Text>
            <Text style={styles.emptySub}>Adiciona mais figurinhas no inventário!</Text>
          </View>
        }
      />
      <BottomNav active="Trocas" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  badge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 8 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  list: { padding: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: '#6B7280', fontWeight: '600' },
  emptySub: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
});
