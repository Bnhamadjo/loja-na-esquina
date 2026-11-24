# Loja na Esquina

Aplicação móvel para gerir produtos, stock, vendas e compras de uma pequena loja. A interface é feita com Expo e React Native, e a navegação usa Expo Router.

## Requisitos

- Node.js e npm
- Android, iOS ou navegador para executar a aplicação

## Instalação e execução

Na raiz do projeto:

```bash
npm install
npm start
```

Também é possível iniciar diretamente numa plataforma:

```bash
npm run android
npm run ios
npm run web
```

Os comandos `android` e `ios` iniciam o Expo para abrir a aplicação num dispositivo ou emulador compatível. Para abrir a versão web, use `npm run web`.

## Problemas comuns no Web

- Se aparecer `Cannot connect to Expo CLI` junto com `Page entered Back-Forward Cache`, o navegador pode ter suspendido as conexões WebSocket ao guardar a página no histórico. Recarregue com `Ctrl+R`; se não resolver, feche a aba e abra novamente pelo endereço apresentado no terminal do Expo.
- Confirme que o servidor Expo continua ativo no terminal. Se necessário, pare-o com `Ctrl+C` e inicie novamente com `npm run web`.
- Use o endereço e a porta apresentados pelo Expo; a porta pode mudar se a padrão já estiver ocupada. `localhost` só aponta para o computador que executa o navegador. Para testar noutro dispositivo, use o endereço de rede/QR code do Expo e mantenha os dispositivos na mesma rede, ou inicie com `npx expo start --tunnel`.

## Funcionalidades

### Painel

- Apresenta o total acumulado das vendas, o número de produtos e a quantidade de produtos com stock baixo.
- Lista produtos com menos de 10 unidades em stock.
- Os atalhos **Registar venda** e **Registar compra** abrem os respetivos formulários.

### Produtos e stock

- Mostra o catálogo e o stock atual.
- Permite cadastrar produtos com nome, preço de venda e quantidade inicial.
- O preço deve ser maior que zero; o stock inicial deve ser um inteiro igual ou maior que zero.
- Produtos com menos de 10 unidades são destacados como stock baixo.

### Vendas

- Permite escolher um produto com stock disponível e informar uma quantidade inteira maior que zero.
- Calcula o total usando o preço de venda cadastrado.
- Ao confirmar, diminui o stock e guarda o movimento.
- Não permite vender mais unidades do que as disponíveis.

### Compras

- Permite escolher um produto, informar uma quantidade inteira maior que zero e o custo unitário.
- Calcula e guarda o total da compra.
- Ao confirmar, aumenta o stock do produto.

### Mais opções: Histórico e Relatórios

- **Histórico** lista vendas e compras guardadas neste dispositivo, ordenadas por data.
- **Relatórios** apresenta totais acumulados de vendas e compras, unidades em stock, produtos com stock baixo e uma estimativa do valor potencial do stock.
- O valor potencial é calculado com os preços atuais de venda e **não representa lucro**.

### Aparência

- Em **Mais > Aparência**, use o interruptor **Modo escuro** para alternar entre tema escuro e claro.
- A escolha é guardada localmente com AsyncStorage na chave `@nhafin/theme-mode-v1`; o modo escuro é usado quando ainda não existe preferência guardada.
- O tema aplica-se às telas, cartões, formulários, barra de separadores e barra de estado.

## Navegação e rotas

As telas vivem em `src/app/tabs/`. No Expo Router, o caminho da rota é derivado da localização e do nome do ficheiro:

| Tela | Ficheiro | Caminho |
| --- | --- | --- |
| Painel | `src/app/tabs/index.js` | `/tabs` |
| Produtos | `src/app/tabs/products.js` | `/tabs/products` |
| Vendas | `src/app/tabs/sales.js` | `/tabs/sales` |
| Compras | `src/app/tabs/purchase.js` | `/tabs/purchase` |
| Mais opções | `src/app/tabs/more.js` | `/tabs/more` |
| Histórico | `src/app/history.js` | `/history` |
| Relatórios | `src/app/reports.js` | `/reports` |

Ao adicionar ou renomear uma tela, atualize também os respetivos `router.push(...)` e, quando aplicável, o `<Tabs.Screen name="...">` em `src/app/tabs/_layout.js`. O nome em `<Tabs.Screen>` deve corresponder ao nome do ficheiro sem a extensão. Histórico e Relatórios são rotas do Stack principal, fora de `src/app/tabs/`, e são acessíveis a partir de **Mais**; o cabeçalho dessas telas fornece o botão de voltar. Não as coloque como rotas ocultas das tabs, pois isso pode redirecionar a navegação para o Painel.

## Dados e persistência

- Os dados são guardados localmente no dispositivo com AsyncStorage, na chave `@nhafin/app-data-v1`.
- Não há sincronização entre dispositivos nem backend configurado.
- Na primeira execução, a aplicação inicializa produtos e vendas de demonstração definidos em `src/services/mockData.js`; compras começam vazias.
- Produtos, vendas e compras criados durante o uso são persistidos no dispositivo.
- Se não for possível ler os dados guardados ou se estiverem num formato inválido, a aplicação apresenta uma mensagem e permite tentar carregar novamente.

## Organização do código

- `src/app/`: telas e layouts de navegação do Expo Router.
- `src/components/`: componentes reutilizáveis, incluindo os formulários de transação.
- `src/context/AppDataContext.js`: estado, validações das operações e persistência local.
- `src/context/theme-context.js`: tema claro/escuro e persistência da preferência visual.
- `src/screens/`: telas e formulários partilhados pelas rotas.
- `src/services/mockData.js`: dados iniciais e cálculo do resumo do painel.

## Verificação do bundle Android

Para confirmar que a aplicação e as rotas compilam:

```bash
npx expo export --platform android
```

## Manutenção deste manual

Ao alterar funcionalidades, rotas, armazenamento, comandos ou instruções de resolução de problemas, atualize as secções correspondentes deste README na mesma alteração. Confirme que os caminhos e comandos documentados continuam a corresponder aos ficheiros e scripts do projeto.
