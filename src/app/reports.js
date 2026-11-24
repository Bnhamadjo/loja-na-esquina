import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CardMetrica } from '../components/CardMetrica';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/theme-context';

function formatCurrency(value) {
  return `FCFA ${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`;
}

export default function ReportsRoute() {
  const { data } = useAppData();
  const { colors } = useTheme();
  const totalVendas = data.vendas.reduce((total, sale) => total + sale.total, 0);
  const totalCompras = data.compras.reduce((total, purchase) => total + purchase.total, 0);
  const totalUnidades = data.produtos.reduce((total, product) => total + product.estoque, 0);
  const valorPotencialStock = data.produtos.reduce(
    (total, product) => total + product.preco * product.estoque, 0
  );
  const stockBaixo = data.produtos.filter((product) => product.estoque < 10).length;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { backgroundColor: colors.background }]} contentInsetAdjustmentBehavior="automatic">
      <Text style={[styles.title, { color: colors.text }]}>Relatórios</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Resumo acumulado dos movimentos registados</Text>
      <View style={styles.metrics}>
        <CardMetrica titulo="Total de vendas" valor={formatCurrency(totalVendas)} cor={colors.success} />
        <CardMetrica titulo="Total de compras" valor={formatCurrency(totalCompras)} cor={colors.primary} />
        <CardMetrica titulo="Unidades em stock" valor={totalUnidades} cor={colors.secondary} />
        <CardMetrica titulo="Produtos com stock baixo" valor={stockBaixo} cor={colors.warning} />
      </View>
      <View style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.noteTitle, { color: colors.secondaryText }]}>Valor potencial do stock</Text>
        <Text style={[styles.noteValue, { color: colors.text }]}>{formatCurrency(valorPotencialStock)}</Text>
        <Text style={[styles.noteText, { color: colors.secondaryText }]}>Estimativa calculada com os preços atuais de venda; não representa lucro.</Text>
      </View>
      <Text style={[styles.counts, { color: colors.muted }]}>
        {data.vendas.length} venda(s) · {data.compras.length} compra(s)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, flexGrow: 1, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 28 },
  title: { fontSize: 30, fontWeight: '800' },
  subtitle: { marginTop: 5, marginBottom: 14 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: 12 },
  note: { borderWidth: 1, borderRadius: 16, padding: 14, marginVertical: 4 },
  noteTitle: { fontSize: 12 },
  noteValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  noteText: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  counts: { fontSize: 12, marginTop: 12, textAlign: 'center' },
});