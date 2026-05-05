import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Preenche tudo, visse?');
      return;
    }
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await api.post<{ accessToken: string }>(endpoint, payload);
      await SecureStore.setAsync('accessToken', res.data.accessToken);
      router.replace('/home');
    } catch {
      Alert.alert('Deu ruim', 'Verifica e-mail e senha aí, mah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.logoArea}>
        <Text style={styles.logo}>🃏</Text>
        <Text style={styles.title}>TrocAê?</Text>
        <Text style={styles.subtitle}>Bora trocar figurinhas?</Text>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {loading ? 'Um instante...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isLogin ? 'Não tem conta? Clica aqui' : 'Já tem conta? Entra aí'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Copa 2026 · Trocaê?</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#22C55E', justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 72 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  subtitle: { fontSize: 18, color: '#D1FAE5', marginTop: 4 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },
  btn: { backgroundColor: '#22C55E', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  switchBtn: { alignItems: 'center', marginTop: 16 },
  switchText: { color: '#22C55E', fontSize: 14 },
  footer: { textAlign: 'center', color: '#A7F3D0', fontSize: 13, marginTop: 24 },
});
