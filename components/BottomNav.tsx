import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TABS = [
  { name: 'Home', icon: '🏠', route: '/home' },
  { name: 'Inventário', icon: '📦', route: '/inventario' },
  { name: 'Trocas', icon: '🔄', route: '/encontrar-trocas' },
  { name: 'Perfil', icon: '👤', route: '/perfil' },
];

interface Props {
  active: string;
}

export default function BottomNav({ active }: Props) {
  return (
    <View style={styles.nav}>
      {TABS.map((tab) => (
        <TouchableOpacity key={tab.name} style={styles.tab} activeOpacity={0.7}>
          <Text style={[styles.icon, active === tab.name ? styles.activeIcon : null]}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.name ? styles.activeLabel : null]}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center' },
  icon: { fontSize: 22, marginBottom: 2 },
  activeIcon: { transform: [{ scale: 1.1 }] },
  label: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  activeLabel: { color: '#22C55E', fontWeight: 'bold' },
});
