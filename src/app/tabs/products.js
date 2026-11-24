import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormProdutoScreen } from '../../screens/formprodutoscreen';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/theme-context';

export default function ProductsRoute() {
  const { data, addProduct } = useAppData();
  const { colors } = useTheme();
  const [showForm, setShowForm] = useState(false);
  return (
    <FlatList
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      data={data.produtos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>CATÁLOGO E INVENTÁRIO</Text>
          <Text style={[styles.title, { color: colors.text }]}>Produtos</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>{data.produtos.length} produto(s) no catálogo</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityState={{ expanded: showForm }}
            onPress={() => setShowForm((visible) => !visible)}
          >
            <Text style={styles.addButtonText}>{showForm ? 'Fechar formulário' : '+ Novo produto'}</Text>
          </TouchableOpacity>
          {showForm && <FormProdutoScreen onAdicionarProduto={addProduct} />}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Stock atual</Text>
        </>
      }
      ListEmptyComponent={<Text style={[styles.empty, { color: colors.secondaryText }]}>Ainda não há produtos cadastrados.</Text>}
      renderItem={({ item }) => (
        <View style={[styles.productRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.productDetails}>
            <Text style={[styles.productName, { color: colors.text }]}>{item.nome}</Text>
            <Text style={[styles.price, { color: colors.secondaryText }]}>FCFA {item.preco.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</Text>
          </View>
          <Text style={[
            styles.stock,
            item.estoque < 10
              ? { color: colors.warning, backgroundColor: colors.background }
              : { color: colors.success, backgroundColor: colors.raised },
          ]}>
            {item.estoque} un
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 30 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 14, marginTop: 5, marginBottom: 16 },
  addButton: { borderRadius: 12, alignItems: 'center', padding: 13, minHeight: 48, justifyContent: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 8 },
  empty: { paddingVertical: 12 },
  productRow: { borderWidth: 1, borderRadius: 16, padding: 14, marginVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productDetails: { flex: 1, marginRight: 12 },
  productName: { fontWeight: '600' },
  price: { fontSize: 12, marginTop: 4 },
  stock: { fontWeight: '700', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
});