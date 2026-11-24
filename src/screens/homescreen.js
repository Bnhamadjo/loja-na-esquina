import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/theme-context';
import { calcularResumo } from '../services/mockData';

function formatCurrency(value) {
  return `FCFA ${Math.round(value).toLocaleString('fr-FR')}`;
}

function QuickAction({ title, hint, symbol, variant, colors, onPress }) {
  const isPurchase = variant === 'purchase';
  const accent = isPurchase ? colors.secondary : colors.primary;
  const iconBackground = isPurchase ? colors.secondarySoft : colors.primarySoft;
  const iconColor = isPurchase ? colors.secondaryTextStrong : colors.primaryText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={isPurchase ? 'Abrir o formulário de compra' : 'Abrir o formulário de venda'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: colors.raised, borderColor: accent },
        pressed && styles.actionPressed,
      ]}
    >
      <View style={[styles.actionSymbol, { backgroundColor: iconBackground }]}>
        <Text style={[styles.actionSymbolText, { color: iconColor }]}>
          {symbol}
        </Text>
      </View>
      <View>
        <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.actionHint, { color: colors.secondaryText }]}>{hint}</Text>
      </View>
    </Pressable>
  );
}

function LowStockItem({ product, colors }) {
  return (
    <View style={[styles.productRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.productCopy}>
        <Text style={[styles.productName, { color: colors.text }]}>{product.nome}</Text>
        <Text style={[styles.productPrice, { color: colors.muted }]}>{formatCurrency(product.preco)} por unidade</Text>
      </View>
      <Text style={[
        styles.stockCount,
        { color: colors.secondaryTextStrong, backgroundColor: colors.secondarySoft, borderColor: colors.secondary },
      ]}>
        {product.estoque} un.
      </Text>
    </View>
  );
}

export function HomeScreen({ produtos = [], vendas = [] }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { totalVendido, totalProdutos, estoqueBaixo } = calcularResumo(vendas, produtos);
  const produtosBaixos = produtos.filter((product) => product.estoque < 10);

  return (
    <FlatList
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      data={produtosBaixos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <View style={styles.brand}>
            <View style={[styles.brandMark, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}>
              <Text style={[styles.brandInitial, { color: colors.primaryText }]}>N</Text>
            </View>
            <Text style={[styles.brandName, { color: colors.secondaryText }]}>NHAFIN</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Painel</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Resumo do negócio e atalhos para as operações.</Text>

          <View style={[styles.salesCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <View style={[styles.salesHalo, { borderColor: colors.primary }]} />
            <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>Vendas registadas</Text>
            <View>
              <Text style={[styles.salesValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                {formatCurrency(totalVendido)}
              </Text>
              <Text style={[styles.salesCaption, { color: colors.muted }]}>Total acumulado</Text>
            </View>
          </View>

          <View style={styles.metrics}>
            <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>Produtos</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{totalProdutos}</Text>
            </View>
            <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.metricLabel, { color: colors.secondaryText }]}>Stock baixo</Text>
              <Text style={[styles.lowStockValue, { color: colors.secondary }]}>{estoqueBaixo}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acesso rápido</Text>
          <View style={styles.actions}>
            <QuickAction
              title="Registar venda"
              hint="Baixar stock e guardar o total"
              symbol="↗"
              variant="sale"
              colors={colors}
              onPress={() => router.push('/tabs/sales')}
            />
            <QuickAction
              title="Registar compra"
              hint="Adicionar unidades ao stock"
              symbol="↙"
              variant="purchase"
              colors={colors}
              onPress={() => router.push('/tabs/purchase')}
            />
          </View>

          <View style={styles.stockHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Produtos a repor</Text>
            <Text style={[styles.sectionNote, { color: colors.muted }]}>Abaixo de 10 un.</Text>
          </View>
          {produtosBaixos.length === 0 && (
            <Text style={[styles.empty, { color: colors.secondaryText, borderColor: colors.border }]}>Não há produtos com stock baixo.</Text>
          )}
        </>
      }
      renderItem={({ item }) => <LowStockItem product={item} colors={colors} />}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 680,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandInitial: { fontSize: 14, fontWeight: '700' },
  brandName: { fontSize: 13, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1.2 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 22 },
  salesCard: {
    minHeight: 154,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  salesHalo: {
    position: 'absolute',
    top: -34,
    right: -37,
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
  },
  metricLabel: { fontSize: 13, fontWeight: '600' },
  salesValue: { fontSize: 38, fontWeight: '700', letterSpacing: -1.7 },
  salesCaption: { fontSize: 12, marginTop: 9 },
  metrics: { flexDirection: 'row', gap: 12, marginTop: 12 },
  metric: {
    flex: 1,
    minHeight: 92,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 3,
  },
  metricValue: { fontSize: 23, fontWeight: '700', marginTop: 8 },
  lowStockValue: { fontSize: 23, fontWeight: '700', marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  stockHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionNote: { fontSize: 12, flexShrink: 0 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  action: {
    flex: 1,
    minHeight: 126,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionPressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  actionSymbol: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSymbolText: { fontSize: 17, fontWeight: '700' },
  actionTitle: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  actionHint: { fontSize: 11, lineHeight: 15, marginTop: 4 },
  productRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 3,
  },
  productCopy: { flex: 1, minWidth: 0 },
  productName: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
  productPrice: { fontSize: 11, marginTop: 4 },
  stockCount: {
    maxWidth: 108,
    flexShrink: 1,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemSeparator: { height: 8 },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    fontSize: 13,
    lineHeight: 20,
  },
  footer: { height: 8 },
});
