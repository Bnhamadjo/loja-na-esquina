import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({ color, symbol }) {
  return <Text style={{ color, fontSize: 19, fontWeight: '700' }}>{symbol}</Text>;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#2457C5',
        tabBarInactiveTintColor: '#667085',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E4E7EC',
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
        <Tabs.Screen name="history" options={{ href: null }} />
        <Tabs.Screen name="reports" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: { flex: 1, backgroundColor: '#F5F6F8' },
};