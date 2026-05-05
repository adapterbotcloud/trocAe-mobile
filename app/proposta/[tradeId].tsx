import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import type { TradeMatch, Figurinha } from '../../types';

export default function PropostaScreen() {
  const { tradeId, match } = useLocalSearchParams<{ tradeId: string; match?: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [matchData, setMatchData] = useState<TradeMatch | null>(match ? JSON.parse(match) : null);
  const [selectedOffer, setSelectedOffer] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  // Parse match data from find-trades response
  const theyHave = matchData?.theyHave ?? [];
  const theyWant = matchData?.theyWant ?? [];

  const toggleOffer = (id: string) =>
    setSelectedOffer((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleRequest = (id: string) =>
    setSelectedRequest((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handlePropose = async () => {
    if (!user?.id || selectedOffer.length === 0 || selectedRequest.length === 0) {
      Alert.alert('Seleciona pelo menos uma pra dar e uma pra receber');
      return;
    }
    setSending(true);
    try {
      const items = [
        ...selectedOffer.map((fid) => ({ figurinhaId: fid, direction: 'OFFER' as const })),
        ...selectedRequest.map((fid) => ({ figurinhaId: fid, direction: 'REQUEST' as const })),
      ];
      await api.post('/trades/propose', {
        proposerId: user.id,
        receiverId: tradeId,
        items,
      });
      Alert.alert('Proposta enviada! 🙌', 'É só esperar a resposta.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não conseguiu enviar a proposta. Tenta de novo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Proposta de Troca</Text>
        <Text style={styles.subtitle}>com {matchData?.user.name ?? 'Usuário'}</Text>
        {matchData?.distanceKm && (
          <Text style={styles.dist}>📍 {matchData.distanceKm} km de distância</Text>
        )}
      </View>

      <View style={styles.cols}>
        <View style={styles.col}>
          <Text style={styles.colTitle}>🎁 Você dá (OFFER)</Text>
          <FlatList
            data={theyWant}
            keyExtractor={(item) => item.figurinhaId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.figItem, selectedOffer.includes(item.figurinhaId) && styles.selected]}
                onPress={() => toggleOffer(item.figurinhaId)}
                activeOpacity={0.7}
              >
                <Text style={styles.figNum}>{item.numero}</Text>
                <Text style={styles.figName}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.col}>
          <Text style={styles.colTitle}>🙋 Você recebe (REQUEST)</Text>
          <FlatList
            data={theyHave}
            keyExtractor={(item) => item.figurinhaId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.figItem, selectedRequest.includes(item.figurinhaId) && styles.selectedRequest]}
                onPress={() => toggleRequest(item.figurinhaId)}
                activeOpacity={0.7}
              >
                <Text style={styles.figNum}>{item.numero}</Text>
                <Text style={styles.figName}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.sendBtn, (sending || selectedOffer.length === 0 || selectedRequest.length === 0) && styles.sendBtnDisabled]}
        onPress={handlePropose}
        disabled={sending || selectedOffer.length === 0 || selectedRequest.length === 0}
        activeOpacity={0.8}
      >
        <Text style={styles.sendBtnText}>
          {sending ? 'Enviando...' : '✈️ Enviar Proposta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  dist: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  cols: { flex: 1, flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  colTitle: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  figItem: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 2, borderColor: '#E5E7EB' },
  selected: { borderColor: '#22C55E', backgroundColor: '#D1FAE5' },
  selectedRequest: { borderColor: '#3B82F6', backgroundColor: '#DBEAFE' },
  figNum: { fontWeight: 'bold', color: '#374151', fontSize: 15 },
  figName: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  sendBtn: { backgroundColor: '#22C55E', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});
