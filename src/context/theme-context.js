import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@nhafin/theme-mode-v1';
const ThemeContext = createContext(null);

const palettes = {
  dark: {
    background: '#10141B',
    surface: '#191F29',
    raised: '#202834',
    border: '#303A48',
    text: '#F4F7FB',
    secondaryText: '#A7B1C0',
    muted: '#7E8A9B',
    primary: '#2563EB',
    primarySoft: 'rgba(37, 99, 235, 0.17)',
    primaryText: '#A8C1FF',
    secondary: '#14B8A6',
    secondarySoft: 'rgba(20, 184, 166, 0.16)',
    secondaryTextStrong: '#74E1D2',
    success: '#74E1D2',
    warning: '#F79009',
    danger: '#FDA29B',
  },
  light: {
    background: '#F5F6F8',
    surface: '#FFFFFF',
    raised: '#FFFFFF',
    border: '#E4E7EC',
    text: '#17212B',
    secondaryText: '#667085',
    muted: '#667085',
    primary: '#2563EB',
    primarySoft: '#EFF4FF',
    primaryText: '#2457C5',
    secondary: '#14B8A6',
    secondarySoft: '#E6F7F5',
    secondaryTextStrong: '#10756B',
    success: '#14804A',
    warning: '#B54708',
    danger: '#B42318',
  },
};

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const readPreference = useCallback(async () => {
      const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedMode !== null && savedMode !== 'dark' && savedMode !== 'light') {
        throw new Error('A preferência de tema guardada é inválida.');
      }
      return savedMode ?? 'dark';
  }, []);

  const loadPreference = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setMode(await readPreference());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, [readPreference]);

  useEffect(() => {
    let isActive = true;

    readPreference().then((savedMode) => {
      if (isActive) setMode(savedMode);
    }).catch((error) => {
      if (isActive) {
        setLoadError(error instanceof Error ? error.message : String(error));
      }
    }).finally(() => {
      if (isActive) setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [readPreference]);

  const setThemeMode = useCallback(async (nextMode) => {
    if (nextMode !== 'dark' && nextMode !== 'light') {
      throw new Error('O modo de visualização selecionado é inválido.');
    }
    await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    setMode(nextMode);
  }, []);

  const value = useMemo(() => ({
    mode,
    isDark: mode === 'dark',
    colors: palettes[mode],
    setThemeMode,
  }), [mode, setThemeMode]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={palettes.dark.primary} />
        <Text style={styles.message}>A carregar a preferência de visualização...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Não foi possível carregar a visualização</Text>
        <Text style={styles.message}>{loadError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPreference}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.use(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de AppThemeProvider.');
  }
  return context;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#10141B',
  },
  message: { color: '#A7B1C0', textAlign: 'center', marginTop: 12 },
  errorTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#F4F7FB' },
  retryButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 12, marginTop: 18 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
});
