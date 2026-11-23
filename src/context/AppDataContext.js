import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const dataRef = useRef(null);
  const writeQueue = useRef(Promise.resolve());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
      const loadedData = storedValue === null
        ? createInitialData()
        : parseStoredData(storedValue);
      dataRef.current = loadedData;
      setData(loadedData);
    } catch (error) {
      dataRef.current = null;
      setData(null);
      setLoadError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.message}>A carregar os dados...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Não foi possível carregar os dados</Text>
        <Text style={styles.message}>{loadError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
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
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData deve ser utilizado dentro de AppDataProvider.');
  }
  return context;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F2F2F7' },
  message: { color: '#666', textAlign: 'center', marginTop: 12 },
  errorTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#1C1C1E' },
  retryButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 18 },
  retryText: { color: '#FFF', fontWeight: 'bold' },
});