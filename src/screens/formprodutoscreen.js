import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function FormProdutoScreen({ onAdicionarProduto }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSalvar = async () => {
    const precoNumerico = Number(preco.replace(',', '.'));
    const estoqueNumerico = Number(estoque);

    if (!nome.trim() || !preco.trim() || !estoque.trim()) {
      Alert.alert('Erro', 'Preencha o nome, o preço e a quantidade em stock.');
      return;
    }
    if (!Number.isFinite(precoNumerico) || precoNumerico <= 0) {
      Alert.alert('Erro', 'O preço deve ser maior que zero.');
      return;
    }
    if (!Number.isInteger(estoqueNumerico) || estoqueNumerico < 0) {
      Alert.alert('Erro', 'A quantidade em stock deve ser um número inteiro igual ou maior que zero.');
      return;
    }

    const novoProduto = { nome: nome.trim(), preco: precoNumerico, estoque: estoqueNumerico };
    setIsSaving(true);
    try {
      await onAdicionarProduto(novoProduto);
      setNome(''); setPreco(''); setEstoque('');
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Novo Produto</Text>
      <TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} />
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Preço (fcfa)" keyboardType="decimal-pad" value={preco} onChangeText={setPreco} />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Qtd Estoque" keyboardType="numeric" value={estoque} onChangeText={setEstoque} />
      </View>
      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar} disabled={isSaving}>
        <Text style={styles.btnSalvarTexto}>{isSaving ? 'A guardar...' : 'Cadastrar Produto'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 10, marginTop: 12 },
  formTitle: { color: '#17212B', fontSize: 17, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#F5F6F8', color: '#17212B', padding: 12, borderRadius: 8, marginBottom: 8, fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginHorizontal: 3 },
  btnSalvar: { backgroundColor: '#2457C5', padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 2 },
  btnSalvarTexto: { color: '#FFF', fontWeight: '700' },
});