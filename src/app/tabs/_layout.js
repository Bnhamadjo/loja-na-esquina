import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/theme-context';

function TabIcon({ color, symbol }) {
  return <Text style={{ color, fontSize: 19, fontWeight: '700' }}>{symbol}</Text>;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
        },
      }}>
        <Tabs.Screen name="index" options={{ title: 'Painel', tabBarLabel: 'Painel', tabBarIcon: ({ color }) => <TabIcon color={color} symbol="⌂" /> }} />
        <Tabs.Screen name="products" options={{ title: 'Produtos', tabBarLabel: 'Stock', tabBarIcon: ({ color }) => <TabIcon color={color} symbol="▦" /> }} />
        <Tabs.Screen name="sales" options={{ title: 'Vendas', tabBarLabel: 'Vender', tabBarIcon: ({ color }) => <TabIcon color={color} symbol="↗" /> }} />
        <Tabs.Screen name="purchase" options={{ title: 'Compras', tabBarLabel: 'Comprar', tabBarIcon: ({ color }) => <TabIcon color={color} symbol="↙" /> }} />
        <Tabs.Screen name="more" options={{ title: 'Mais', tabBarLabel: 'Mais', tabBarIcon: ({ color }) => <TabIcon color={color} symbol="•••" /> }} />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: { flex: 1 },
};