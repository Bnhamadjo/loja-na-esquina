import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CardMetrica } from '../../components/CardMetrica';
import { useAppData } from '../../context/AppDataContext';

function formatCurrency(value) {
  return `FCFA ${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`;
}

export default function ReportsRoute() {
  const { data } = useAppData();
  const totalVendas = data.vendas.reduce((total, sale) => total + sale.total, 0);
  const totalCompras = data.compras.reduce((total, purchase) => total + purchase.total, 0);
  const totalUnidades = data.produtos.reduce((total, product) => total + product.estoque, 0);
  const valorPotencialStock = data.produtos.reduce(
    (total, product) => total + product.preco * product.estoque, 0
  );
  const stockBaixo = data.produtos.filter((product) => product.estoque < 10).length;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Relatórios</Text>
      <Text style={styles.subtitle}>Resumo acumulado dos movimentos registados</Text>
      <View style={styles.metrics}>
        <CardMetrica titulo="Total de vendas" valor={formatCurrency(totalVendas)} cor="#34C759" />
        <CardMetrica titulo="Total de compras" valor={formatCurrency(totalCompras)} cor="#007AFF" />
        <CardMetrica titulo="Unidades em stock" valor={totalUnidades} cor="#5856D6" />
        <CardMetrica titulo="Produtos com stock baixo" valor={stockBaixo} cor="#FF9500" />
      </View>
      <View style={styles.note}>
        <Text style={styles.noteTitle}>Valor potencial do stock</Text>
        <Text style={styles.noteValue}>{formatCurrency(valorPotencialStock)}</Text>
        <Text style={styles.noteText}>Estimativa calculada com os preços atuais de venda; não representa lucro.</Text>
      </View>
      <Text style={styles.counts}>
        {data.vendas.length} venda(s) · {data.compras.length} compra(s)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { alignSelf: 'center', width: '100%', maxWidth: 680, flexGrow: 1, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 28, backgroundColor: '#F5F6F8' },
  title: { color: '#17212B', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#667085', marginTop: 5, marginBottom: 14 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: 12 },
  note: { backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginVertical: 4 },
  noteTitle: { color: '#667085', fontSize: 12 },
  noteValue: { color: '#17212B', fontSize: 20, fontWeight: '800', marginTop: 4 },
  noteText: { color: '#667085', fontSize: 12, lineHeight: 18, marginTop: 6 },
  counts: { color: '#667085', fontSize: 12, marginTop: 12, textAlign: 'center' },
});