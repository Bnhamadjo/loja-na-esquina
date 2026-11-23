import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function formatCurrency(value) {
  return `FCFA ${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`;
}

export function TransactionForm({ type, products, onSubmit }) {
  const isPurchase = type === 'purchase';
  const availableProducts = isPurchase ? products : products.filter((product) => product.estoque > 0);
  const [selectedProductId, setSelectedProductId] = useState(availableProducts[0]?.id ?? '');
  const [quantity, setQuantity] = useState('1');
  const [unitCost, setUnitCost] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const selectedProduct = products.find((product) => product.id === selectedProductId);

  const handleSubmit = async () => {
    const quantityNumber = Number(quantity);
    const unitCostNumber = Number(unitCost.replace(',', '.'));

    if (!selectedProduct) {
      Alert.alert('Produto necessário', 'Cadastre ou selecione um produto antes de continuar.');
      return;
    }
    if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade inteira maior que zero.');
      return;
    }
    if (isPurchase && (!Number.isFinite(unitCostNumber) || unitCostNumber <= 0)) {
      Alert.alert('Custo inválido', 'Informe um custo unitário maior que zero.');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(isPurchase
        ? { productId: selectedProduct.id, quantity: quantityNumber, unitCost: unitCostNumber }
        : { productId: selectedProduct.id, quantity: quantityNumber });
      setQuantity('1'); setUnitCost('');
      Alert.alert('Sucesso', isPurchase ? 'Compra registada e stock atualizado.' : 'Venda registada e stock atualizado.');
    } catch (error) {
      Alert.alert('Não foi possível guardar', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const quantityNumber = Number(quantity);
  const estimatedTotal = selectedProduct && Number.isInteger(quantityNumber) && quantityNumber > 0
    ? isPurchase
      ? Number(unitCost.replace(',', '.')) * quantityNumber
      : selectedProduct.preco * quantityNumber
    : null;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>{isPurchase ? 'REPOSIÇÃO DE STOCK' : 'VENDA AO CLIENTE'}</Text>
      <Text style={styles.pageTitle}>{isPurchase ? 'Registar compra' : 'Registar venda'}</Text>
      <Text style={styles.subtitle}>
        {isPurchase ? 'Registe a entrada de unidades e o custo pago.' : 'Escolha o produto e confirme a quantidade vendida.'}
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Produto</Text>
        {availableProducts.length === 0 ? (
          <Text style={styles.empty}>
            {isPurchase ? 'Cadastre um produto antes de registar uma compra.' : 'Não há produtos com stock disponível.'}
          </Text>
        ) : (
          <View style={styles.productList}>
            {availableProducts.map((product) => {
              const isSelected = product.id === selectedProductId;
              return (
                <TouchableOpacity
                  key={product.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  style={[styles.productOption, isSelected && styles.productOptionSelected]}
                  onPress={() => setSelectedProductId(product.id)}
                >
                  <Text style={[styles.productName, isSelected && styles.selectedText]}>{product.nome}</Text>
                  <Text style={[styles.productDetails, isSelected && styles.selectedText]}>
                    {isPurchase
                      ? `${product.estoque} un em stock`
                      : `${product.estoque} un · ${formatCurrency(product.preco)}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.label}>Quantidade</Text>
        <TextInput style={styles.input} keyboardType="number-pad" value={quantity} onChangeText={setQuantity} placeholder="Ex.: 2" />
        {isPurchase && (
          <>
            <Text style={styles.label}>Custo unitário (FCFA)</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" value={unitCost} onChangeText={setUnitCost} placeholder="Ex.: 1000" />
          </>
        )}
        {estimatedTotal !== null && Number.isFinite(estimatedTotal) && (
          <Text style={styles.total}>Total: {formatCurrency(estimatedTotal)}</Text>
        )}
        <TouchableOpacity
          style={[styles.submitButton, (isSaving || availableProducts.length === 0) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSaving || availableProducts.length === 0}
        >
          <Text style={styles.submitText}>
            {isSaving ? 'A guardar...' : isPurchase ? 'Confirmar compra' : 'Confirmar venda'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center', width: '100%', maxWidth: 680, flexGrow: 1, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 28, backgroundColor: '#F5F6F8' },
  eyebrow: { color: '#667085', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  pageTitle: { color: '#17212B', fontSize: 28, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#667085', fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 16 },
  label: { color: '#344054', fontWeight: '600', marginBottom: 7, marginTop: 10 },
  productList: { gap: 8 },
  productOption: { borderWidth: 1, borderColor: '#E4E7EC', borderRadius: 8, padding: 12 },
  productOptionSelected: { backgroundColor: '#E8F4EC', borderColor: '#14804A' },
  productName: { color: '#17212B', fontWeight: '600' },
  productDetails: { color: '#667085', fontSize: 12, marginTop: 4 },
  selectedText: { color: '#146C43' },
  empty: { color: '#667085', lineHeight: 20, paddingVertical: 12 },
  input: { backgroundColor: '#F5F6F8', color: '#17212B', borderRadius: 8, padding: 12, fontSize: 16 },
  total: { color: '#17212B', fontSize: 18, fontWeight: '700', marginTop: 18 },
  submitButton: { backgroundColor: '#2457C5', borderRadius: 8, alignItems: 'center', padding: 14, marginTop: 18 },
  disabledButton: { opacity: 0.5 },
  submitText: { color: '#FFF', fontWeight: 'bold' },
});