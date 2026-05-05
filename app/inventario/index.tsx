import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useInventory } from '../../hooks/useInventory';
import FigurinhaCard from '../../components/FigurinhaCard';
import ManualInput from '../../components/ManualInput';
import BottomNav from '../../components/BottomNav';
import api from '../../services/api';

type Tab = 'TENHO' | 'REPETIDAS' | 'FALTANTES';

const TAB_LABELS: Record<Tab, string> = { TENHO: 'Tenho', REPETIDAS: 'Repetidas', FALTANTES: 'Faltantes' };

export default function InventarioScreen() {
  const router = useRouter();
  const { tenho, repetidas, faltantes, isLoading, updateFigurinha } = useInventory();
  const [tab, setTab] = useState<Tab>('TENHO');
  const [adding, setAdding] = useState(false);

  const lists: Record<Tab, Figurinha[] | InventoryItem[]> = { TENHO: tenho, REPETIDAS: repetidas, FALTANTES: faltantes };
  const active = lists[tab];

  const handleManualAdd = async (numeros: number[]) => {
    setAdding(true);
    try {
      // Assumingfigurinha numbers map to figurinhas in the default album
      // We need albumId + numero to find the figurinha
      for (const num of numeros) {
        try {
          // Search for figurinha by numero in the default album
          const res = await api.get('/albums/figurinhas/search', { params: { numero: String(num) } });
          const found = res.data.figurinhas?.[0];
          if (found) {
            await updateFigurinha(found.id, 1);
          }
        } catch {
          // skip if not found
        }
      }
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#22C55E" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {TAB_LABELS[t]} {lists[t].length}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab !== 'FALTANTES' && (
        <View style={styles.manualInput}>
          <ManualInput onSubmit={handleManualAdd} />
        </View>
      )}

      <FlatList
        data={active}
        keyExtractor={(item) => item.id ?? item.figurinha?.id ?? Math.random().toString()}
        numColumns={4}
        renderItem={({ item }) => (
          <FigurinhaCard
            item={item}
            status={tab === 'TENHO' ? 'TENHO' : tab === 'REPETIDAS' ? 'REPETIDA' : 'FALTANTE'}
            showStatus={false}
            onPress={() => router.push('/encontrar-trocas')}
          />
        )}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma figurinha aqui ainda 😢</Text>}
      />

      <BottomNav active="Inventário" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingTop: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#22C55E' },
  tabText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  activeTabText: { color: '#22C55E', fontWeight: 'bold' },
  manualInput: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 12 },
  grid: { padding: 8, paddingBottom: 100 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 16 },
});
