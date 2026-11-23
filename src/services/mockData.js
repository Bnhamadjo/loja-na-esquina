export const PRODUTOS_INICIAIS = [
  { id: '1', nome: 'Café Torrado 500g', preco: 15.50, estoque: 12 },
  { id: '2', nome: 'Açúcar Refinado 1kg', preco: 4.20, estoque: 25 },
  { id: '3', nome: 'Leite Integral 1L', preco: 5.80, estoque: 8 },
];

export const VENDAS_INICIAIS = [
  { id: '101', data: '2026-11-08', total: 31.00, qtdItens: 2 },
  { id: '102', data: '2026-11-07', total: 15.80, qtdItens: 3 },
];

export function calcularResumo(vendas = [], produtos = []) {
  const totalVendido = vendas.reduce((acc, v) => acc + v.total, 0);
  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(p => p.estoque < 10).length;
  return { totalVendido, totalProdutos, estoqueBaixo };
}