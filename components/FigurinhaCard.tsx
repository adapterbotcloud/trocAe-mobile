import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Figurinha, InventoryItem } from '../types';

interface Props {
  item: Figurinha | InventoryItem;
  status?: 'TENHO' | 'REPETIDA' | 'FALTANTE';
  onPress?: () => void;
  showStatus?: boolean;
}

const RARITY_COLORS = {
  COMUM: '#9CA3AF',
  INCOMUM: '#22C55E',
  RARA: '#3B82F6',
  SUPER_RARA: '#A855F7',
};

export default function FigurinhaCard({ item, status, onPress, showStatus }: Props) {
  const figurinha = 'figurinha' in item ? item.figurinha : item;
  const num = figurinha.numero;
  const rarityColor = RARITY_COLORS[figurinha.raridade] ?? '#9CA3AF';

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: rarityColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.badge, { backgroundColor: rarityColor }]}>
        <Text style={styles.badgeText}>{num}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>{figurinha.nome}</Text>
      {showStatus && status && (
        <View style={[styles.statusBadge, { backgroundColor: status === 'TENHO' ? '#22C55E' : status === 'REPETIDA' ? '#F59E0B' : '#EF4444' }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    width: 100,
    margin: 4,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  name: {
    fontSize: 11,
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
