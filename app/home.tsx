import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tenho, repetidas, faltantes, isLoading: invLoading } = useInventory();

  if (authLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#22C55E" /></View>;
  }

  if (!isAuthenticated) {
    router.replace('/');
    return null;
  }

  const totalFaltantes = faltantes.length;
  const totalRepetidas = repetidas.length;
  const totalTenho = tenho.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.saudacao}>Olá, {user?.name ?? 'Colecionador'}! 👋</Text>
          <Text style={styles.albumLabel}>Álbum Copa 2026 🌎</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalTenho}</Text>
            <Text style={styles.statLabel}>Tenho</Text>
          </View>
          <View style={[styles.statCard, styles.statWarn]}>
            <Text style={styles.statNum}>{totalRepetidas}</Text>
            <Text style={styles.statLabel}>Repetidas</Text>
          </View>
          <View style={[styles.statCard, styles.statDanger]}>
            <Text style={styles.statNum}>{totalFaltantes}</Text>
            <Text style={styles.statLabel}>Faltantes</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bigBtn}
          onPress={() => router.push('/encontrar-trocas')}
          activeOpacity={0.8}
        >
          <Text style={styles.bigBtnText}>🔍 Encontrar Trocas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigBtn, styles.secondaryBtn]}
          onPress={() => router.push('/inventario')}
          activeOpacity={0.8}
        >
          <Text style={[styles.bigBtnText, styles.secondaryBtnText]}>📦 Ver meu Inventário</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav active="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 24 },
  saudacao: { fontSize: 26, fontWeight: 'bold', color: '#1F2937' },
  albumLabel: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statWarn: { borderTopWidth: 3, borderTopColor: '#F59E0B' },
  statDanger: { borderTopWidth: 3, borderTopColor: '#EF4444' },
  statNum: { fontSize: 28, fontWeight: 'bold', color: '#22C55E' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  bigBtn: { backgroundColor: '#22C55E', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 12, shadowColor: '#22C55E', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  bigBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  secondaryBtn: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#22C55E' },
  secondaryBtnText: { color: '#22C55E' },
});
