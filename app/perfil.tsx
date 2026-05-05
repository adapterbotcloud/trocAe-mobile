import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import BottomNav from '../components/BottomNav';
import api from '../services/api';

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
  const [lat, setLat] = useState(user?.lat?.toString() ?? '');
  const [lng, setLng] = useState(user?.lng?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', {
        name,
        whatsapp: whatsapp || undefined,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
      });
      Alert.alert('Salvo! ✨', 'Perfil atualizado.');
    } catch {
      Alert.alert('Erro', 'Não conseguiu salvar. Tenta de novo.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Tem certeza?', [
      { text: 'Cancela', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => { await logout(); router.replace('/'); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? '👤'}</Text>
        </View>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>WhatsApp (opcional)</Text>
        <TextInput style={styles.input} value={whatsapp} onChangeText={setWhatsapp} placeholder="(85) 99999-9999" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" />

        <Text style={styles.label}>Latitude</Text>
        <TextInput style={styles.input} value={lat} onChangeText={setLat} placeholder="-3.71839" placeholderTextColor="#9CA3AF" keyboardType="numeric" />

        <Text style={styles.label}>Longitude</Text>
        <TextInput style={styles.input} value={lng} onChangeText={setLng} placeholder="-38.54234" placeholderTextColor="#9CA3AF" keyboardType="numeric" />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : '💾 Salvar'} </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>🚪 Sair</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav active="Perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { padding: 20, paddingBottom: 100 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 24 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 36 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#D1D5DB', color: '#1F2937' },
  saveBtn: { backgroundColor: '#22C55E', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  logoutBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12, borderWidth: 2, borderColor: '#EF4444' },
  logoutBtnText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
});
