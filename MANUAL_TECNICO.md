# Manual técnico — Loja na Esquina

Este manual documenta a estrutura, os ecrãs, os componentes, os dados e as configurações atuais da aplicação. É um documento separado do [README.md](./README.md); o README não foi alterado para esta documentação.

> Os exemplos mostram as partes principais da implementação. O código completo, incluindo estilos e validações, está nos ficheiros indicados em cada secção.

## 1. O que a aplicação faz

A aplicação permite:

- Consultar vendas acumuladas, produtos e artigos com stock baixo.
- Cadastrar produtos com preço e stock inicial.
- Registar vendas, diminuindo o stock disponível.
- Registar compras, aumentando o stock.
- Consultar o histórico de vendas e compras.
- Consultar totais e indicadores do negócio.
- Alternar entre aparência escura e clara, guardando a escolha neste dispositivo.

Os dados são locais. Não existe backend, conta de utilizador, sincronização entre dispositivos ou integração com pagamentos.

## 2. Requisitos e execução — passo a passo

### Requisitos

- Node.js e npm instalados.
- Expo Go para testar num dispositivo, ou um emulador Android/iOS.
- Ligação de rede entre o dispositivo e o computador ao usar Expo Go.

### Preparar o projeto

1. Abra um terminal na pasta raiz do projeto.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o Expo:

   ```bash
   npm start
   ```

4. Para abrir a aplicação, leia o QR code com Expo Go ou selecione um destino disponível no terminal do Expo.

Comandos alternativos:

```bash
npm run android
npm run ios
npm run web
```

`npm run android` e `npm run ios` iniciam o servidor para um dispositivo/emulador compatível; não substituem a configuração do SDK nativo do computador. Para experimentar primeiro sem criar uma build nativa, use Expo Go.

### Verificações de desenvolvimento

```bash
npm run lint
npx expo export --platform android
npx expo export --platform web
```

O projeto é JavaScript e não tem `tsconfig.json`; por isso não existe uma verificação TypeScript configurada.

## 3. Estrutura dos ficheiros

```text
src/
  app/
    _layout.js              Stack principal e providers
    history.js              Ecrã de Histórico
    reports.js              Ecrã de Relatórios
    tabs/
      _layout.js            Barra de separadores
      index.js              Rota do Painel
      products.js           Rota de Produtos
      sales.js              Rota de Vendas
      purchase.js           Rota de Compras
      more.js               Rota Mais e configuração de aparência
  components/
    CardMetrica.js          Cartão reutilizável de indicador
    TransactionForm.js      Formulário de venda/compra
  context/
    AppDataContext.js       Dados, regras e persistência
    theme-context.js        Temas claro/escuro e persistência
  screens/
    homescreen.js           Conteúdo do Painel
    formprodutoscreen.js    Formulário de produto
  services/
    mockData.js             Dados iniciais e cálculo do resumo
```

Os ficheiros dentro de `src/app/` são rotas do Expo Router. Componentes e lógica partilhada ficam fora de `src/app/` para não serem interpretados como ecrãs.

## 4. Configuração da aplicação

### `package.json`

Configuração atual:

```json
{
  "name": "loja_na_esquina",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@expo/ui": "~58.0.29",
    "@react-native-async-storage/async-storage": "2.2.0",
    "autoskills": "^0.4.1",
    "expo": "~58.0.26",
    "expo-constants": "~58.0.16",
    "expo-linking": "~58.0.17",
    "expo-router": "~58.0.32",
    "expo-status-bar": "~58.0.5",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-native": "0.88.1",
    "react-native-safe-area-context": "~5.11.1",
    "react-native-screens": "~4.30.1",
    "react-native-web": "^0.21.4"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true,
  "devDependencies": {
    "eslint": "^9.0.0",
    "eslint-config-expo": "~58.0.4"
  }
}
```

- `main` inicia o Expo Router. Não o substitua por `App.js` ou `index.js` sem migrar a navegação.
- `@expo/ui` fornece o `Switch` universal usado na configuração de aparência.
- `@react-native-async-storage/async-storage` guarda dados e tema no dispositivo.
- As versões atuais do Expo, React e React Native estão no próprio `package.json`; use `npx expo install <pacote>` ao adicionar dependências Expo para manter compatibilidade com o SDK.

`App.js` e `index.js` são ficheiros de scaffold antigo. A entrada configurada no pacote é `expo-router/entry`; os ecrãs ativos são descobertos em `src/app/`.

### `app.json`

Configuração atual:

```json
{
  "expo": {
    "name": "loja_na_esquina",
    "slug": "loja_na_esquina",
    "version": "1.0.0",
    "scheme": "loja_na_esquina",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "icon": "./assets/icon.png",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

O tema desenhado pela aplicação é controlado pelo `AppThemeProvider`; a definição `userInterfaceStyle` do Expo não substitui essa lógica. Os ícones e o favicon também estão apontados neste ficheiro.

### ESLint

`eslint.config.js` estende a configuração flat do Expo e ignora a pasta `dist/`. O comando habitual é:

```bash
npm run lint
```

## 5. Navegação e ecrãs

### Mapa de rotas

| Ecrã | Ficheiro | Caminho |
| --- | --- | --- |
| Painel | [src/app/tabs/index.js](./src/app/tabs/index.js) | `/tabs` |
| Produtos | [src/app/tabs/products.js](./src/app/tabs/products.js) | `/tabs/products` |
| Vendas | [src/app/tabs/sales.js](./src/app/tabs/sales.js) | `/tabs/sales` |
| Compras | [src/app/tabs/purchase.js](./src/app/tabs/purchase.js) | `/tabs/purchase` |
| Mais | [src/app/tabs/more.js](./src/app/tabs/more.js) | `/tabs/more` |
| Histórico | [src/app/history.js](./src/app/history.js) | `/history` |
| Relatórios | [src/app/reports.js](./src/app/reports.js) | `/reports` |

O separador Mais abre as duas rotas que ficam fora da barra:

```js
router.push('/history');
router.push('/reports');
```

Histórico e Relatórios são rotas do Stack principal, não separadores ocultos. Não as mova para `src/app/tabs/` nem configure `href: null` para as esconder: essa configuração já fez estas ligações voltarem ao Painel. O cabeçalho dessas rotas disponibiliza a ação de voltar.

### Stack principal — `src/app/_layout.js`

O layout raiz carrega tema e dados antes de apresentar os ecrãs:

```jsx
function RootLayout() {
  return (
    <AppThemeProvider>
      <RootContent />
    </AppThemeProvider>
  );
}

function RootContent() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar
        style={isDark ? 'light' : 'dark'}
        backgroundColor={colors.background}
      />
      <AppDataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen
            name="history"
            options={{
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
            }}
          />
          <Stack.Screen
            name="reports"
            options={{
              headerShown: true,
              title: '',
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
            }}
          />
        </Stack>
      </AppDataProvider>
    </>
  );
}
```

### Barra de separadores — `src/app/tabs/_layout.js`

As rotas que aparecem na barra são registadas pelo nome do ficheiro:

```jsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Painel', tabBarLabel: 'Painel' }} />
  <Tabs.Screen name="products" options={{ title: 'Produtos', tabBarLabel: 'Stock' }} />
  <Tabs.Screen name="sales" options={{ title: 'Vendas', tabBarLabel: 'Vender' }} />
  <Tabs.Screen name="purchase" options={{ title: 'Compras', tabBarLabel: 'Comprar' }} />
  <Tabs.Screen name="more" options={{ title: 'Mais', tabBarLabel: 'Mais' }} />
</Tabs>
```

O layout também lê os insets seguros do dispositivo e aplica cores do tema à barra. Ao adicionar um separador, crie o respetivo ficheiro em `src/app/tabs/` e adicione um `<Tabs.Screen name="nome-do-ficheiro" ... />`.

### Painel — `src/app/tabs/index.js` e `src/screens/homescreen.js`

O ficheiro `index.js` liga os dados do contexto ao componente:

```jsx
export default function DashboardRoute() {
  const { data } = useAppData();
  return <HomeScreen produtos={data.produtos} vendas={data.vendas} />;
}
```

O `HomeScreen` recebe produtos e vendas, calcula os indicadores, mostra vendas acumuladas, contagem de produtos, artigos abaixo de 10 unidades e atalhos:

```js
const { totalVendido, totalProdutos, estoqueBaixo } =
  calcularResumo(vendas, produtos);
const produtosBaixos = produtos.filter((product) => product.estoque < 10);

// Destinos usados pelos atalhos:
onPress={() => router.push('/tabs/sales')}
onPress={() => router.push('/tabs/purchase')}
```

Os itens de reposição mostram nome, preço unitário e quantidade. O total de vendas usa os movimentos guardados, incluindo as vendas de demonstração iniciais.

### Produtos — `src/app/tabs/products.js`

O ecrã usa `FlatList` para apresentar o catálogo e abre o formulário no cabeçalho da lista:

```jsx
const { data, addProduct } = useAppData();
const [showForm, setShowForm] = useState(false);

<FlatList
  data={data.produtos}
  keyExtractor={(item) => item.id}
  ListHeaderComponent={
    <>
      <TouchableOpacity onPress={() => setShowForm((visible) => !visible)}>
        <Text>{showForm ? 'Fechar formulário' : '+ Novo produto'}</Text>
      </TouchableOpacity>
      {showForm && <FormProdutoScreen onAdicionarProduto={addProduct} />}
    </>
  }
  renderItem={({ item }) => (
    <View>
      <Text>{item.nome}</Text>
      <Text>{item.preco} FCFA · {item.estoque} un.</Text>
    </View>
  )}
/>;
```

O código real estiliza os produtos como cartões; os produtos com stock inferior a 10 são destacados. O estado vazio aparece quando a lista não tem produtos.

### Formulário de produto — `src/screens/formprodutoscreen.js`

API do componente:

```jsx
<FormProdutoScreen onAdicionarProduto={addProduct} />
```

Campos: nome, preço de venda e quantidade inicial. A validação atual exige:

```js
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

await onAdicionarProduto({
  nome: nome.trim(),
  preco: precoNumerico,
  estoque: estoqueNumerico,
});
```

O código do ecrã preserva o formulário até a gravação ter sucesso, apresenta o estado de gravação e mostra uma mensagem se a operação falhar.

### Vendas e Compras — rotas e `TransactionForm`

As rotas são pequenas adaptações que passam produtos e a ação correspondente:

```jsx
// src/app/tabs/sales.js
export default function SalesRoute() {
  const { data, registerSale } = useAppData();
  return <TransactionForm type="sale" products={data.produtos} onSubmit={registerSale} />;
}

// src/app/tabs/purchase.js
export default function PurchasesRoute() {
  const { data, registerPurchase } = useAppData();
  return <TransactionForm type="purchase" products={data.produtos} onSubmit={registerPurchase} />;
}
```

Contrato do formulário:

```jsx
<TransactionForm
  type="sale" // ou "purchase"
  products={data.produtos}
  onSubmit={registerSale} // ou registerPurchase
/>
```

- **Venda:** só oferece produtos com stock maior que zero; pede quantidade inteira positiva; calcula o total com o preço de venda.
- **Compra:** permite selecionar produtos mesmo sem stock; pede quantidade e custo unitário maior que zero.
- Ambos mostram o total estimado, bloqueiam gravações repetidas enquanto guardam e apresentam erro em caso de falha.
- O formulário limpa quantidade/custo e mostra sucesso apenas quando `onSubmit` termina com êxito.

### Mais e Aparência — `src/app/tabs/more.js`

O ecrã contém cartões de navegação para Histórico e Relatórios e um `Switch` do `@expo/ui`:

```jsx
<MenuCard title="Histórico" onPress={() => router.push('/history')} />
<MenuCard title="Relatórios" onPress={() => router.push('/reports')} />

<Host matchContents>
  <Switch
    label="Modo escuro"
    value={isDark}
    onValueChange={handleThemeChange}
    disabled={isSavingTheme}
  />
</Host>
```

A função `handleThemeChange` chama `setThemeMode('dark' | 'light')`, desativa o controlo enquanto a preferência é guardada e apresenta erros de persistência no ecrã.

### Histórico — `src/app/history.js`

O ecrã combina vendas e compras num único conjunto, ordenado da mais recente para a mais antiga:

```js
const entries = [
  ...data.vendas.map((sale) => ({ ...sale, tipo: 'Venda' })),
  ...data.compras.map((purchase) => ({ ...purchase, tipo: 'Compra' })),
].sort((a, b) => Date.parse(b.data) - Date.parse(a.data));
```

Uma `FlatList` apresenta tipo, data, produto, quantidade, valor unitário e total. A mensagem vazia explica que os movimentos registados aparecerão ali.

### Relatórios — `src/app/reports.js`

Os indicadores são derivados dos dados locais:

```js
const totalVendas = data.vendas.reduce((sum, sale) => sum + sale.total, 0);
const totalCompras = data.compras.reduce((sum, purchase) => sum + purchase.total, 0);
const totalUnidades = data.produtos.reduce((sum, product) => sum + product.estoque, 0);
const valorPotencialStock = data.produtos.reduce(
  (sum, product) => sum + product.preco * product.estoque,
  0
);
const stockBaixo = data.produtos.filter((product) => product.estoque < 10).length;
```

O valor potencial do stock usa preços de venda atuais e não é lucro. Os indicadores visuais são apresentados por `CardMetrica`.

## 6. Componentes reutilizáveis

### `CardMetrica` — `src/components/CardMetrica.js`

```jsx
export function CardMetrica({ titulo, valor, cor }) {
  const { colors } = useTheme();
  const valueColor = cor ?? colors.primary;
  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      <Text>{titulo}</Text>
      <Text style={{ color: valueColor }} numberOfLines={1} adjustsFontSizeToFit>
        {valor}
      </Text>
    </View>
  );
}
```

As propriedades são `titulo`, `valor` e `cor` (opcional). A cor do valor usa a primária do tema por omissão.

### `TransactionForm` — `src/components/TransactionForm.js`

O componente partilhado é parametrizado pelo tipo:

```js
const isPurchase = type === 'purchase';
const availableProducts = isPurchase
  ? products
  : products.filter((product) => product.estoque > 0);
```

Na submissão, os dados enviados seguem estes formatos:

```js
// Venda
{ productId: selectedProduct.id, quantity: quantityNumber }

// Compra
{
  productId: selectedProduct.id,
  quantity: quantityNumber,
  unitCost: unitCostNumber
}
```

As regras finais também são revalidadas no contexto de dados; a validação do formulário, por si só, não é a única proteção.

### Elementos internos do Painel e Mais

- `QuickAction` e `LowStockItem`, em `src/screens/homescreen.js`, são componentes locais do Painel.
- `MenuCard`, em `src/app/tabs/more.js`, é o cartão de navegação de Mais.
- Estes componentes não são rotas nem precisam de registo em `_layout.js`.

Exemplo do padrão usado pelo `QuickAction` (ação acessível, estilos por estado e cores do tema):

```jsx
function QuickAction({ title, hint, colors, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: colors.raised, borderColor: colors.primary },
        pressed && styles.actionPressed,
      ]}
    >
      <Text style={{ color: colors.text }}>{title}</Text>
      <Text style={{ color: colors.secondaryText }}>{hint}</Text>
    </Pressable>
  );
}
```

O `LowStockItem` recebe o produto e as cores para mostrar nome, preço e quantidade; o `MenuCard` segue o mesmo padrão de `Pressable` e recebe `title`, `description`, `colors` e `onPress`. Os dois componentes completos estão nos ficheiros indicados acima.

Forma resumida dos outros dois componentes locais:

```jsx
function LowStockItem({ product, colors }) {
  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      <Text style={{ color: colors.text }}>{product.nome}</Text>
      <Text style={{ color: colors.muted }}>{product.estoque} un.</Text>
    </View>
  );
}

function MenuCard({ title, description, colors, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
    >
      <Text style={{ color: colors.text }}>{title}</Text>
      <Text style={{ color: colors.secondaryText }}>{description}</Text>
    </Pressable>
  );
}
```

## 7. Dados, regras e persistência

### Modelo guardado

O estado persistido em `@nhafin/app-data-v1` tem versão e três listas:

```js
{
  version: 1,
  produtos: [
    { id: 'id', nome: 'Produto', preco: 10, estoque: 4 }
  ],
  vendas: [
    {
      id: 'id',
      data: '2026-11-24T12:00:00.000Z',
      produtoId: 'id',
      produtoNome: 'Produto',
      quantidade: 1,
      precoUnitario: 10,
      qtdItens: 1,
      total: 10
    }
  ],
  compras: [
    {
      id: 'id',
      data: '2026-11-24T12:00:00.000Z',
      produtoId: 'id',
      produtoNome: 'Produto',
      quantidade: 2,
      custoUnitario: 8,
      total: 16
    }
  ]
}
```

### Contexto `AppDataContext`

O provider em [src/context/AppDataContext.js](./src/context/AppDataContext.js) carrega e valida os dados ao arrancar. Se a leitura falhar ou o JSON estiver inválido, mostra erro com opção para tentar novamente; não substitui silenciosamente dados inválidos.

Componentes leem e alteram os dados com o hook:

```js
const { data, addProduct, registerSale, registerPurchase } = useAppData();
```

O provider serializa gravações com uma fila e só atualiza a interface após a escrita local:

```js
const commit = useCallback((update) => {
  const operation = writeQueue.current.then(async () => {
    if (!dataRef.current) {
      throw new Error('Os dados ainda não estão disponíveis. Tente novamente.');
    }
    const nextData = update(dataRef.current);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    dataRef.current = nextData;
    setData(nextData);
  });

  writeQueue.current = operation.then(() => undefined, () => undefined);
  return operation;
}, []);
```

As operações garantem:

1. **`addProduct`** cria ID, remove espaços do nome e acrescenta produto.
2. **`registerSale`** valida quantidade, confirma existência do produto e stock suficiente, regista total/data e diminui stock.
3. **`registerPurchase`** valida quantidade/custo, confirma produto, regista compra e aumenta stock.
4. Cada alteração é escrita no AsyncStorage antes de atualizar o estado apresentado.
5. Uma fila de escrita serializa operações para evitar que gravações próximas sobrescrevam alterações umas das outras.

Regras principais:

```js
Number.isInteger(quantity) && quantity > 0
product.estoque >= quantity // venda
Number.isFinite(unitCost) && unitCost > 0 // compra
```

### Dados de demonstração

`src/services/mockData.js` fornece `PRODUTOS_INICIAIS`, `VENDAS_INICIAIS` e `calcularResumo(vendas, produtos)`. Na primeira instalação sem dados guardados, existem produtos e vendas de demonstração; a lista de compras começa vazia. Depois da primeira gravação, os dados guardados passam a ser a fonte de verdade.

Não há botão de reinicialização de dados na aplicação. Para voltar aos dados iniciais durante testes, limpe os dados locais da aplicação ou use uma instalação de teste limpa; isso remove os dados guardados nesse dispositivo.

## 8. Tema claro e escuro

### Contexto `theme-context.js`

O tema é fornecido pelo `AppThemeProvider` e consumido com:

```js
const { mode, isDark, colors, setThemeMode } = useTheme();
```

O provider só disponibiliza os ecrãs depois de ler a preferência:

```js
const [mode, setMode] = useState('dark');
const [isLoading, setIsLoading] = useState(true);

const setThemeMode = useCallback(async (nextMode) => {
  if (nextMode !== 'dark' && nextMode !== 'light') {
    throw new Error('O modo de visualização selecionado é inválido.');
  }
  await AsyncStorage.setItem(STORAGE_KEY, nextMode);
  setMode(nextMode);
}, []);
```

`colors` inclui cores de fundo, superfícies, texto, contorno, primária, secundária e estados de sucesso/aviso/erro. As paletas `dark` e `light` estão definidas em `src/context/theme-context.js`.

Preferência persistida:

```js
const STORAGE_KEY = '@nhafin/theme-mode-v1';
await AsyncStorage.setItem(STORAGE_KEY, nextMode); // "dark" ou "light"
```

O padrão é escuro quando não existe preferência. A alteração só é aplicada depois de a gravação local ter sucesso. Se a leitura inicial falhar, o provider mostra erro e permite tentar novamente.

Ao criar um ecrã ou componente, use `useTheme()` para fundos, texto, bordas e estados, em vez de assumir que o tema é sempre escuro.

## 9. Passo a passo para alterações futuras

### Adicionar um componente reutilizável

1. Crie o ficheiro em `src/components/` (ou `src/screens/` se for uma composição de ecrã).
2. Receba dados e ações por propriedades quando possível; use `useAppData()` apenas quando o componente precisar diretamente do contexto.
3. Use `useTheme()` para cores e inclua estados vazio, carregamento ou erro quando aplicável.
4. Importe e utilize o componente no ecrã que precisa dele.
5. Execute `npm run lint` e as exportações necessárias.

### Adicionar uma rota

1. Decida se é um separador principal ou uma página secundária.
2. Para um separador, crie `src/app/tabs/nome.js` e registe-o com `<Tabs.Screen name="nome" ... />` em `src/app/tabs/_layout.js`.
3. Para uma página secundária, crie `src/app/nome.js` fora de `tabs/`; se precisar de opções de cabeçalho, configure `<Stack.Screen name="nome" ... />` em `src/app/_layout.js`.
4. Navegue para a rota pelo caminho derivado do ficheiro:

   ```js
   router.push('/nome');
   ```

5. Confirme se o botão de voltar e todos os caminhos de entrada continuam corretos.
6. Atualize este manual e verifique com:

   ```bash
   npm run lint
   npx expo export --platform android
   npx expo export --platform web
   ```

Não use `<Tabs.Screen options={{ href: null }}>` como substituto para uma rota secundária. Coloque páginas secundárias no Stack principal.

### Adicionar um novo campo persistido

1. Atualize o modelo no `AppDataContext`.
2. Atualize `createInitialData()` e a validação `isValidData()`.
3. Atualize as operações que criam ou alteram o campo.
4. Considere dados antigos já guardados: migre a versão do modelo explicitamente ou faça um fallback validado. Não assuma que todos os utilizadores começam com armazenamento vazio.
5. Atualize os formulários, histórico/relatórios e este manual.

## 10. Resolução de problemas

### `Cannot resolve entry file`

Confirme se `package.json` contém:

```json
"main": "expo-router/entry"
```

Depois instale dependências com `npm install` e inicie com `npm start`.

### Histórico ou Relatórios volta ao Painel

- Confirme que os ficheiros existem em `src/app/history.js` e `src/app/reports.js`.
- Confirme que os atalhos em `src/app/tabs/more.js` apontam para `/history` e `/reports`.
- Confirme que são rotas do Stack principal em `src/app/_layout.js`, não rotas ocultas nas tabs.

### Web: `Cannot connect to Expo CLI` ou WebSocket suspenso

1. Confirme que o servidor Expo continua ativo.
2. Recarregue o browser; se persistir, feche e volte a abrir a página pelo endereço mostrado no terminal.
3. Use a porta indicada pelo Expo (pode não ser `8081` ou `8082`).
4. Para outro dispositivo, use o QR code/endereço de rede e mantenha computador e dispositivo na mesma rede.

### Dados não carregam

O contexto apresenta a mensagem de erro e a ação **Tentar novamente**. Não apague manualmente AsyncStorage sem compreender que isso pode remover produtos, vendas e compras do dispositivo. Em desenvolvimento, verifique especialmente se os dados guardados correspondem à versão validada em `AppDataContext.js`.

## 11. Ficheiros de referência

- [Configuração Expo](./app.json)
- [Dependências e comandos](./package.json)
- [Layout principal](./src/app/_layout.js)
- [Layout das tabs](./src/app/tabs/_layout.js)
- [Contexto de dados](./src/context/AppDataContext.js)
- [Contexto de tema](./src/context/theme-context.js)
- [Dados iniciais](./src/services/mockData.js)
- [Manual resumido](./README.md)
