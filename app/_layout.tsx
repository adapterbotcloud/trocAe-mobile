import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#22C55E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'TrocAê', headerShown: false }} />
        <Stack.Screen name="album/[albumId]" options={{ title: 'Álbum' }} />
        <Stack.Screen name="inventario" options={{ title: 'Inventário', headerShown: false }} />
        <Stack.Screen name="encontrar-trocas" options={{ title: 'Encontrar Trocas', headerShown: false }} />
        <Stack.Screen name="proposta/[tradeId]" options={{ title: 'Proposta de Troca' }} />
        <Stack.Screen name="chat" options={{ title: 'Conversas', headerShown: false }} />
        <Stack.Screen name="chat/[chatId]" options={{ title: 'Chat' }} />
        <Stack.Screen name="perfil" options={{ title: 'Meu Perfil', headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
});
