import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormProdutoScreen } from '../../screens/formprodutoscreen';
import { useAppData } from '../../context/AppDataContext';

export default function ProductsRoute() {
  const { data, addProduct } = useAppData();
  const [showForm, setShowForm] = useState(false);
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={data.produtos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.eyebrow}>CATÁLOGO E INVENTÁRIO</Text>
          <Text style={styles.title}>Produtos</Text>
          <Text style={styles.subtitle}>{data.produtos.length} produto(s) no catálogo</Text>
          <TouchableOpacity
            style={styles.addButton}
            accessibilityRole="button"
            accessibilityState={{ expanded: showForm }}
            onPress={() => setShowForm((visible) => !visible)}
          >
            <Text style={styles.addButtonText}>{showForm ? 'Fechar formulário' : '+ Novo produto'}</Text>
          </TouchableOpacity>
          {showForm && <FormProdutoScreen onAdicionarProduto={addProduct} />}
          <Text style={styles.sectionTitle}>Stock atual</Text>
        </>
      }
      ListEmptyComponent={<Text style={styles.empty}>Ainda não há produtos cadastrados.</Text>}
      renderItem={({ item }) => (
        <View style={styles.productRow}>
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.price}>FCFA {item.preco.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</Text>
          </View>
          <Text style={[styles.stock, item.estoque < 10 && styles.lowStock]}>{item.estoque} un</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#F5F6F8' },
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 30 },
  eyebrow: { color: '#667085', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { color: '#17212B', fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#667085', fontSize: 14, marginTop: 5, marginBottom: 16 },
  addButton: { backgroundColor: '#2457C5', borderRadius: 9, alignItems: 'center', padding: 13 },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { color: '#17212B', fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 8 },
  empty: { color: '#667085', paddingVertical: 12 },
  productRow: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productDetails: { flex: 1, marginRight: 12 },
  productName: { color: '#17212B', fontWeight: '600' },
  price: { color: '#667085', fontSize: 12, marginTop: 4 },
  stock: { color: '#14804A', backgroundColor: '#E8F4EC', fontWeight: '700', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  lowStock: { color: '#B54708', backgroundColor: '#FFF3E8' },
});