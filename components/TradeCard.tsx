import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { TradeMatch } from '../types';

interface Props {
  match: TradeMatch;
  onPress: () => void;
}

const TYPE_COLORS = { PERFEITA: '#22C55E', PARCIAL: '#F59E0B', GRUPO: '#3B82F6' };

export default function TradeCard({ match, onPress }: Props) {
  const color = TYPE_COLORS[match.type] ?? '#6B7280';
  const distLabel = match.distanceKm != null ? `${match.distanceKm} km` : '📍';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.typeBadge, { backgroundColor: color }]}>
        <Text style={styles.typeText}>{match.type}</Text>
      </View>
      <Text style={styles.userName}>{match.user.name}</Text>
      <Text style={styles.dist}>{distLabel}</Text>
      <View style={styles.section}>
        <Text style={styles.label}>🎁 Eles têm:</Text>
        {match.theyHave.slice(0, 3).map((f) => (
          <Text key={f.figurinhaId} style={styles.fig}>• {f.numero} — {f.nome}</Text>
        ))}
        {match.theyHave.length > 3 && <Text style={styles.more}>+{match.theyHave.length - 3} mais</Text>}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>🙋 Querem:</Text>
        {match.theyWant.slice(0, 3).map((f) => (
          <Text key={f.figurinhaId} style={styles.fig}>• {f.numero} — {f.nome}</Text>
        ))}
        {match.theyWant.length > 3 && <Text style={styles.more}>+{match.theyWant.length - 3} mais</Text>}
      </View>
      <View style={styles.btn}>
        <Text style={styles.btnText}>Propor Troca</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  typeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  dist: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  section: { marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 4 },
  fig: { fontSize: 13, color: '#4B5563', marginLeft: 8 },
  more: { fontSize: 12, color: '#9CA3AF', marginLeft: 8, fontStyle: 'italic' },
  btn: { backgroundColor: '#22C55E', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
