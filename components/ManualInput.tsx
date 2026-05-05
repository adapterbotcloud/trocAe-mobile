import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Parse manual input string into array of figurinha numbers.
 * Supports:
 *   "12, 15, 18, 22, 22"  → [12, 15, 18, 22, 22]
 *   "1-20, 25, 30-32"     → [1,2,3,...,20, 25, 30, 31, 32]
 *   "BRA 12, ARG 15"      → [12, 15]  (album prefix stripped)
 *   "  12 , 15 "          → [12, 15]
 */
export function parseManualInput(input: string): number[] {
  const normalized = input
    .toUpperCase()
    .replace(/BRA |ARG |FWC |CC/g, '') // strip country prefixes
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = normalized.split(/[,\s]+/).filter(Boolean);
  const result: number[] = [];

  for (const token of tokens) {
    if (token.includes('-')) {
      const [startStr, endStr] = token.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        for (let i = start; i <= end; i++) {
          if (!result.includes(i)) result.push(i);
        }
      }
    } else {
      const num = parseInt(token, 10);
      if (!isNaN(num) && !result.includes(num)) result.push(num);
    }
  }

  return result.sort((a, b) => a - b);
}

interface Props {
  onSubmit: (numeros: number[]) => void;
  placeholder?: string;
}

export default function ManualInput({ onSubmit, placeholder = 'Ex: 1-20, 25, 30-32' }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const numeros = parseManualInput(text);
    if (numeros.length > 0) {
      onSubmit(numeros);
      setText('');
    }
  };

  const preview = parseManualInput(text);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="characters"
      />
      {preview.length > 0 && (
        <Text style={styles.preview}>Prévia: {preview.slice(0, 20).join(', ')}{preview.length > 20 ? '...' : ''}</Text>
      )}
      <TouchableOpacity style={styles.btn} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.btnText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },
  preview: { fontSize: 12, color: '#6B7280', marginTop: 6, marginBottom: 4 },
  btn: { backgroundColor: '#22C55E', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
