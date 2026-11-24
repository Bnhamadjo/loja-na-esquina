import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from './theme-context';
import { PRODUTOS_INICIAIS, VENDAS_INICIAIS } from '../services/mockData';

const STORAGE_KEY = '@nhafin/app-data-v1';
const AppDataContext = createContext(null);

function createInitialData() {
  return {
    version: 1,
    produtos: PRODUTOS_INICIAIS,
    vendas: VENDAS_INICIAIS,
    compras: [],
  };
}

function isValidData(data) {
  return Boolean(
    data &&
    data.version === 1 &&
    Array.isArray(data.produtos) &&
    data.produtos.every((product) =>
      product &&
      typeof product.id === 'string' &&
      typeof product.nome === 'string' &&
      Number.isFinite(product.preco) &&
      Number.isInteger(product.estoque)
    ) &&
    Array.isArray(data.vendas) &&
    data.vendas.every((sale) => sale && Number.isFinite(sale.total)) &&
    Array.isArray(data.compras) &&
    data.compras.every((purchase) => purchase && Number.isFinite(purchase.total))
  );
}

function parseStoredData(value) {
  const data = JSON.parse(value);
  if (!isValidData(data)) {
    throw new Error('Os dados guardados não têm um formato válido.');
  }
  return data;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppDataProvider({ children }) {
  const { colors } = useTheme();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const dataRef = useRef(null);
  const writeQueue = useRef(Promise.resolve());

  const readData = useCallback(async () => {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
      return storedValue === null
        ? createInitialData()
        : parseStoredData(storedValue);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const loadedData = await readData();
      dataRef.current = loadedData;
      setData(loadedData);
    } catch (error) {
      dataRef.current = null;
      setData(null);
      setLoadError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, [readData]);

  useEffect(() => {
    let isActive = true;

    readData().then((loadedData) => {
      if (!isActive) return;
      dataRef.current = loadedData;
      setData(loadedData);
    }).catch((error) => {
      if (!isActive) return;
      dataRef.current = null;
      setData(null);
      setLoadError(error instanceof Error ? error.message : String(error));
    }).finally(() => {
      if (isActive) setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [readData]);

  const commit = useCallback((update) => {
    const operation = writeQueue.current.then(async () => {
      if (!dataRef.current) {
        throw new Error('Os dados ainda não estão disponíveis. Tente novamente.');
      }
      const nextData = update(dataRef.current);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      dataRef.current = nextData;
      setData(nextData);
    });

    writeQueue.current = operation.then(() => undefined, () => undefined);
    return operation;
  }, []);

  const addProduct = useCallback((product) => commit((current) => ({
    ...current,
    produtos: [{
      id: createId(),
      nome: product.nome.trim(),
      preco: product.preco,
      estoque: product.estoque,
    }, ...current.produtos],
  })), [commit]);

  const registerSale = useCallback(({ productId, quantity }) => commit((current) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('A quantidade da venda deve ser um número inteiro maior que zero.');
    }
    const product = current.produtos.find((item) => item.id === productId);
    if (!product) {
      throw new Error('O produto selecionado já não existe.');
    }
    if (product.estoque < quantity) {
      throw new Error(`Stock insuficiente. Disponível: ${product.estoque} unidade(s).`);
    }

    const total = product.preco * quantity;
    const sale = {
      id: createId(),
      data: new Date().toISOString(),
      produtoId: product.id,
      produtoNome: product.nome,
      quantidade: quantity,
      precoUnitario: product.preco,
      qtdItens: quantity,
      total,
    };

    return {
      ...current,
      produtos: current.produtos.map((item) =>
        item.id === product.id ? { ...item, estoque: item.estoque - quantity } : item
      ),
      vendas: [sale, ...current.vendas],
    };
  }), [commit]);

  const registerPurchase = useCallback(({ productId, quantity, unitCost }) => commit((current) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('A quantidade da compra deve ser um número inteiro maior que zero.');
    }
    if (!Number.isFinite(unitCost) || unitCost <= 0) {
      throw new Error('O custo unitário deve ser maior que zero.');
    }
    const product = current.produtos.find((item) => item.id === productId);
    if (!product) {
      throw new Error('O produto selecionado já não existe.');
    }

    const purchase = {
      id: createId(),
      data: new Date().toISOString(),
      produtoId: product.id,
      produtoNome: product.nome,
      quantidade: quantity,
      custoUnitario: unitCost,
      total: unitCost * quantity,
    };

    return {
      ...current,
      produtos: current.produtos.map((item) =>
        item.id === product.id ? { ...item, estoque: item.estoque + quantity } : item
      ),
      compras: [purchase, ...current.compras],
    };
  }), [commit]);

  const contextValue = useMemo(() => ({
    data,
    addProduct,
    registerSale,
    registerPurchase,
  }), [data, addProduct, registerSale, registerPurchase]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.message, { color: colors.secondaryText }]}>A carregar os dados...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Não foi possível carregar os dados</Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>{loadError}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={loadData}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = React.use(AppDataContext);
  if (!context) {
    throw new Error('useAppData deve ser utilizado dentro de AppDataProvider.');
  }
  return context;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: { textAlign: 'center', marginTop: 12 },
  errorTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  retryButton: { padding: 12, borderRadius: 12, marginTop: 18 },
  retryText: { color: '#FFFFFF', fontWeight: 'bold' },
});