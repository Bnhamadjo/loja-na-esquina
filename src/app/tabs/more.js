import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';

function MenuCard({ title, description, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} accessibilityRole="button">
      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function MoreRoute() {
  const router = useRouter();
  const { data } = useAppData();
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>NHAFIN · GESTÃO DA LOJA</Text>
      <Text style={styles.title}>Mais opções</Text>
      <Text style={styles.subtitle}>Consulte movimentos e acompanhe o negócio.</Text>
      <MenuCard title="Histórico" description={`${data.vendas.length} venda(s) · ${data.compras.length} compra(s)`} onPress={() => router.push('/tabs/history')} />
      <MenuCard title="Relatórios" description="Resumo de vendas, compras e stock" onPress={() => router.push('/tabs/reports')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center', width: '100%', maxWidth: 680, flex: 1, backgroundColor: '#F5F6F8', paddingHorizontal: 18, paddingTop: 22 },
  eyebrow: { color: '#667085', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { color: '#17212B', fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#667085', fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 18 },
  card: { backgroundColor: '#FFF', borderRadius: 10, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  cardCopy: { flex: 1 },
  cardTitle: { color: '#17212B', fontSize: 16, fontWeight: '700' },
  cardDescription: { color: '#667085', fontSize: 12, marginTop: 5 },
  arrow: { color: '#98A2B3', fontSize: 28, paddingLeft: 12 },
});