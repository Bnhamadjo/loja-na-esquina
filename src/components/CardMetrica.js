import { StyleSheet, Text, View } from 'react-native';

export function CardMetrica({ titulo, valor, cor = '#2457C5' }) {
  return (
    <View style={[styles.card, { borderTopColor: cor }]}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={[styles.value, { color: cor }]} numberOfLines={1} adjustsFontSizeToFit>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 10, borderTopWidth: 3,
    flexBasis: '47%', flexGrow: 1, margin: 4, minHeight: 82,
    padding: 12, justifyContent: 'space-between',
  },
  title: { color: '#667085', fontSize: 11, fontWeight: '600' },
  value: { fontSize: 18, fontWeight: '800', marginTop: 8 },
});