import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { InventoryResponse, InventoryItem, Figurinha } from '../types';

interface InventoryState {
  tenho: InventoryItem[];
  repetidas: InventoryItem[];
  faltantes: Figurinha[];
  isLoading: boolean;
}

export function useInventory() {
  const [state, setState] = useState<InventoryState>({
    tenho: [],
    repetidas: [],
    faltantes: [],
    isLoading: true,
  });

  const fetchInventory = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await api.get<InventoryResponse>('/inventory');
      setState({
        tenho: res.data.tenho,
        repetidas: res.data.repetidas,
        faltantes: res.data.faltantes,
        isLoading: false,
      });
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const updateFigurinha = async (figurinhaId: string, quantity: number) => {
    await api.put(`/inventory/${figurinhaId}`, { quantity });
    await fetchInventory();
  };

  return { ...state, refetch: fetchInventory, updateFigurinha };
}
