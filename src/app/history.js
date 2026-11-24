import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/theme-context';

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
  const { colors } = useTheme();
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
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      data={entries}
      keyExtractor={(item) => `${item.tipo}-${item.id}`}
      ListHeaderComponent={
        <>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>VENDAS E COMPRAS</Text>
          <Text style={[styles.title, { color: colors.text }]}>Histórico</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Movimentos guardados neste dispositivo.</Text>
        </>
      }
      ListEmptyComponent={<Text style={[styles.empty, { color: colors.secondaryText }]}>As vendas e compras registadas aparecerão aqui.</Text>}
      renderItem={({ item }) => (
        <View style={[styles.entry, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.entryInfo}>
            <View style={styles.heading}>
              <Text style={[styles.type, { color: item.tipo === 'Venda' ? colors.success : colors.primary }]}>{item.tipo}</Text>
              <Text style={[styles.date, { color: colors.muted }]}>{formatDate(item.data)}</Text>
            </View>
            <Text style={[styles.product, { color: colors.text }]}>{item.produtoNome || 'Movimento inicial'}</Text>
            <Text style={[styles.detail, { color: colors.secondaryText }]}>{item.detalhe}</Text>
          </View>
          <Text style={[styles.total, { color: colors.text }]}>{formatCurrency(item.total)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 30, flexGrow: 1 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 14, marginTop: 5, marginBottom: 14 },
  empty: { textAlign: 'center', marginTop: 32, lineHeight: 20 },
  entry: { borderWidth: 1, borderRadius: 16, padding: 14, marginVertical: 4, flexDirection: 'row', alignItems: 'center' },
  entryInfo: { flex: 1, marginRight: 10 },
  heading: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  type: { fontWeight: 'bold', marginRight: 8 },
  date: { fontSize: 11, flexShrink: 1 },
  product: { fontWeight: '600' },
  detail: { fontSize: 12, marginTop: 4 },
  total: { fontWeight: '700' },
});