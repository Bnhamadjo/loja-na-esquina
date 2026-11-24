import { useState } from 'react';
import { Host, Switch } from '@expo/ui';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/theme-context';

function MenuCard({ title, description, colors, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
    >
      <View style={styles.cardCopy}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>{description}</Text>
      </View>
      <Text style={[styles.arrow, { color: colors.muted }]}>›</Text>
    </Pressable>
  );
}

export default function MoreRoute() {
  const router = useRouter();
  const { data } = useAppData();
  const { colors, isDark, setThemeMode } = useTheme();
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeError, setThemeError] = useState('');

  const handleThemeChange = async (enabled) => {
    setIsSavingTheme(true);
    setThemeError('');
    try {
      await setThemeMode(enabled ? 'dark' : 'light');
    } catch (error) {
      setThemeError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingTheme(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={[styles.eyebrow, { color: colors.muted }]}>NHAFIN · GESTÃO DA LOJA</Text>
      <Text style={[styles.title, { color: colors.text }]}>Mais opções</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Consulte movimentos e acompanhe o negócio.</Text>
      <MenuCard
        title="Histórico"
        description={`${data.vendas.length} venda(s) · ${data.compras.length} compra(s)`}
        colors={colors}
        onPress={() => router.push('/history')}
      />
      <MenuCard
        title="Relatórios"
        description="Resumo de vendas, compras e stock"
        colors={colors}
        onPress={() => router.push('/reports')}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>
      <View style={[styles.themeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.themeCopy}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Modo escuro</Text>
          <Text style={[styles.cardDescription, { color: colors.secondaryText }]}>
            Escolha entre visualização clara e escura.
          </Text>
        </View>
        <Host matchContents>
          <Switch
            label="Modo escuro"
            value={isDark}
            onValueChange={handleThemeChange}
            disabled={isSavingTheme}
          />
        </Host>
      </View>
      {themeError ? <Text style={[styles.themeError, { color: colors.danger }]}>{themeError}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 680,
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 28,
    gap: 10,
  },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 8 },
  card: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardPressed: { opacity: 0.78 },
  cardCopy: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardDescription: { fontSize: 12, marginTop: 5 },
  arrow: { fontSize: 28, paddingLeft: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 18, marginBottom: 2 },
  themeCard: {
    minHeight: 82,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeCopy: { flex: 1 },
  themeError: { fontSize: 12, lineHeight: 18 },
});
