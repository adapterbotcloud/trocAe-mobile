import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import type { User, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loadStoredAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getAsync('accessToken');
      if (!token) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }
      // Fetch current user
      const res = await api.get('/users/me');
      setState({ user: res.data, isLoading: false, isAuthenticated: true });
    } catch {
      await SecureStore.deleteAsync('accessToken');
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthTokens>('/auth/login', { email, password });
    await SecureStore.setAsync('accessToken', res.data.accessToken);
    if (res.data.refreshToken) {
      await SecureStore.setAsync('refreshToken', res.data.refreshToken);
    }
    await loadStoredAuth();
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<AuthTokens>('/auth/register', { name, email, password });
    await SecureStore.setAsync('accessToken', res.data.accessToken);
    if (res.data.refreshToken) {
      await SecureStore.setAsync('refreshToken', res.data.refreshToken);
    }
    await loadStoredAuth();
  };

  const googleLogin = async (idToken: string) => {
    const res = await api.post<AuthTokens>('/auth/google', { idToken });
    await SecureStore.setAsync('accessToken', res.data.accessToken);
    if (res.data.refreshToken) {
      await SecureStore.setAsync('refreshToken', res.data.refreshToken);
    }
    await loadStoredAuth();
  };

  const logout = async () => {
    await SecureStore.deleteAsync('accessToken');
    await SecureStore.deleteAsync('refreshToken');
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  return { ...state, login, register, googleLogin, logout };
}
