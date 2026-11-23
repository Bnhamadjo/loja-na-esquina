import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';

function formatCurrency(value) {
  return `FCFA ${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function HistoryRoute() {
  const { data } = useAppData();
  const entries = [
    ...data.vendas.map((sale) => ({
      ...sale, tipo: 'Venda',
      detalhe: sale.produtoNome
        ? `${sale.quantidade} un · ${formatCurrency(sale.precoUnitario)} / un`
        : `${sale.qtdItens} item(ns)`,
    })),
    ...data.compras.map((purchase) => ({
      ...purchase, tipo: 'Compra',
      detalhe: `${purchase.quantidade} un · ${formatCurrency(purchase.custoUnitario)} / un`,
    })),
  ].sort((a, b) => Date.parse(b.data) - Date.parse(a.data));

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={entries}
      keyExtractor={(item) => `${item.tipo}-${item.id}`}
      ListHeaderComponent={
        <>
          <Text style={styles.eyebrow}>VENDAS E COMPRAS</Text>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>Movimentos guardados neste dispositivo.</Text>
        </>
      }
      ListEmptyComponent={<Text style={styles.empty}>As vendas e compras registadas aparecerão aqui.</Text>}
      renderItem={({ item }) => (
        <View style={styles.entry}>
          <View style={styles.entryInfo}>
            <View style={styles.heading}>
              <Text style={[styles.type, item.tipo === 'Venda' ? styles.sale : styles.purchase]}>{item.tipo}</Text>
              <Text style={styles.date}>{formatDate(item.data)}</Text>
            </View>
            <Text style={styles.product}>{item.produtoNome || 'Movimento inicial'}</Text>
            <Text style={styles.detail}>{item.detalhe}</Text>
          </View>
          <Text style={styles.total}>{formatCurrency(item.total)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#F5F6F8' },
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 30, flexGrow: 1 },
  eyebrow: { color: '#667085', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { color: '#17212B', fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#667085', fontSize: 14, marginTop: 5, marginBottom: 14 },
  empty: { color: '#667085', textAlign: 'center', marginTop: 32, lineHeight: 20 },
  entry: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginVertical: 4, flexDirection: 'row', alignItems: 'center' },
  entryInfo: { flex: 1, marginRight: 10 },
  heading: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  type: { fontWeight: 'bold', marginRight: 8 },
  sale: { color: '#34C759' },
  purchase: { color: '#007AFF' },
  date: { color: '#667085', fontSize: 11, flexShrink: 1 },
  product: { color: '#17212B', fontWeight: '600' },
  detail: { color: '#667085', fontSize: 12, marginTop: 4 },
  total: { color: '#17212B', fontWeight: '700' },
});