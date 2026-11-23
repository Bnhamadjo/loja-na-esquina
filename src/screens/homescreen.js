import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardMetrica } from '../components/CardMetrica';
import { calcularResumo } from '../services/mockData';

function formatCurrency(value) {
  return `FCFA ${Math.round(value).toLocaleString('fr-FR')}`;
}

export function HomeScreen({ produtos = [], vendas = [] }) {
  const router = useRouter();
  const { totalVendido, totalProdutos, estoqueBaixo } = calcularResumo(vendas, produtos);
  const produtosBaixos = produtos.filter((product) => product.estoque < 10);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={produtosBaixos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.eyebrow}>NHAFIN · GESTÃO DA LOJA</Text>
          <Text style={styles.title}>Painel</Text>
          <Text style={styles.subtitle}>Resumo do negócio e atalhos para as operações.</Text>
          <View style={styles.metrics}>
            <CardMetrica titulo="Vendas registadas" valor={formatCurrency(totalVendido)} cor="#14804A" />
            <CardMetrica titulo="Produtos" valor={totalProdutos} cor="#2457C5" />
            <CardMetrica titulo="Stock baixo" valor={estoqueBaixo} cor="#B54708" />
          </View>
          <Text style={styles.sectionTitle}>Acesso rápido</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.action, styles.saleAction]} onPress={() => router.push('/tabs/sales')}>
              <Text style={styles.actionEyebrow}>OPERAÇÃO</Text>
              <Text style={styles.actionTitle}>Registar venda</Text>
              <Text style={styles.actionHint}>Baixar stock e guardar o total</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.action, styles.purchaseAction]} onPress={() => router.push('/tabs/purchase')}>
              <Text style={styles.actionEyebrow}>REPOSIÇÃO</Text>
              <Text style={styles.actionTitle}>Registar compra</Text>
              <Text style={styles.actionHint}>Adicionar unidades ao stock</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Produtos a repor</Text>
          {produtosBaixos.length === 0 && (
            <Text style={styles.empty}>Não há produtos com stock baixo.</Text>
          )}
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.productRow}>
          <View style={styles.productCopy}>
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.productPrice}>{formatCurrency(item.preco)} por unidade</Text>
          </View>
          <Text style={styles.stock}>{item.estoque} un</Text>
        </View>
      )}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#F5F6F8' },
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 24 },
  eyebrow: { color: '#667085', fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: '#17212B', fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#667085', fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 18 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  sectionTitle: { color: '#17212B', fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  actions: { gap: 10 },
  action: { borderRadius: 12, padding: 16 },
  saleAction: { backgroundColor: '#E8F4EC' },
  purchaseAction: { backgroundColor: '#EAF0FB' },
  actionEyebrow: { color: '#667085', fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  actionTitle: { color: '#17212B', fontSize: 16, fontWeight: '700', marginTop: 5 },
  actionHint: { color: '#667085', fontSize: 12, marginTop: 4 },
  empty: { color: '#667085', fontSize: 13, paddingVertical: 12 },
  productRow: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  productCopy: { flex: 1 },
  productName: { color: '#17212B', fontSize: 14, fontWeight: '600' },
  productPrice: { color: '#667085', fontSize: 12, marginTop: 4 },
  stock: { color: '#B54708', backgroundColor: '#FFF3E8', fontWeight: '700', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  footer: { height: 8 },
});