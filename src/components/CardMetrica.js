import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/theme-context';

export function CardMetrica({ titulo, valor, cor }) {
  const { colors } = useTheme();
  const valueColor = cor ?? colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderTopColor: valueColor }]}>
      <Text style={[styles.title, { color: colors.secondaryText }]}>{titulo}</Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1} adjustsFontSizeToFit>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, borderWidth: 1, borderTopWidth: 3,
    flexBasis: '47%', flexGrow: 1, margin: 4, minHeight: 82,
    padding: 12, justifyContent: 'space-between',
  },
  title: { fontSize: 11, fontWeight: '600' },
  value: { fontSize: 18, fontWeight: '800', marginTop: 8 },
});