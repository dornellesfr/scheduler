# Referência — Auditor de Arquitetura React Native

Material de apoio. O `SKILL.md` traz o essencial; consulte este arquivo para casos ambíguos, exemplos completos e a justificativa das regras.

## Quando agir

Acione esta skill nestes casos:

1. Ao criar um novo arquivo em `src/` (exceto `src/backend/` e arquivos de rota em `src/app/`).
2. Ao mover ou renomear um arquivo em `src/`.
3. Quando o usuário perguntar onde um arquivo, pasta ou artefato deve ficar.

Se o arquivo editado já estiver em uma pasta que viola a arquitetura, faça a alteração pedida e, em seguida, sugira a migração sem bloquear a entrega.

## Formato de resposta

Sempre responda neste formato:

```text
Verdict: ✅ correto | ⚠️ desvio | ❌ incorreto
Path: <caminho-recomendado>
Reason: <regra-em-uma-linha>
```

## Árvore de decisão resumida

Use esta ordem e pare na primeira correspondência:

1. Hook de API (`useQuery`, `useMutation`, `useInfiniteQuery`) → `src/features/<domain>/hooks/`.
2. Hook React não relacionado a API → compartilhado em `src/hooks/`; local em `src/features/<domain>/hooks/`.
3. Componente de UI → compartilhado em `src/components/`; local em `src/features/<domain>/components/`.
4. Store Zustand → global em `src/stores/`; local em `src/features/<domain>/stores/`.
5. Tipo TypeScript → compartilhado em `src/interfaces/`; local em `src/features/<domain>/interfaces/`.
6. Função utilitária pura → compartilhada em `src/utils/`; local em `src/features/<domain>/utils/`.
7. Objeto de API de uma feature (`*.api.ts`) → `src/features/<domain>/api/`; o hook da feature o chama.
   Se for compartilhado por 2+ domínios, use `src/api/`.
8. Configuração HTTP (axios, interceptors) → `src/http/clients/`.
9. Inicialização de bibliotecas de terceiros → `src/lib/`.
10. Constantes, env e config sem variação de build → `src/environment/`.
11. Feature flag → `src/flags/`.
12. Asset → `src/assets/`.
13. Rota do Expo Router → `src/app/` (fora do escopo desta skill).
14. Dados locais/domínio (`Drizzle`, repositórios, casos de uso) → `src/backend/` (fora do escopo, exceto a regra de `*.api.ts`).

Se o artefato pertencer ao agregado `operations` e especificamente a `details`, `photos` ou `occurrences`, use `src/features/operations/<submodule>/...`.

## Mapa de `src/`

```
src/
  api/             Objetos de API compartilhados por 2+ domínios.
  app/             Rotas do Expo Router (baseadas em arquivos). Fora do escopo desta skill.
  assets/          Imagens, fontes, lottie, SVGs estáticos.
  backend/         Dados locais/de domínio (Drizzle, repositórios). Fora do escopo.
  components/      Componentes de UI compartilhados por 2+ domínios. Estrutura plana.
  environment/     Constantes, variáveis de ambiente e configs sem variação por build.
  features/        Módulos por domínio de negócio. Onde fica a maior parte do código.
    <domain>/
      components/  UI exclusiva do domínio.
      api/         Objetos de API do domínio, chamados pelos hooks.
      hooks/       Hooks React do domínio, incluindo hooks que chamam `api/`.
      interfaces/  Tipos TypeScript do domínio.
      stores/      Zustand local do domínio.
      utils/       Funções puras do domínio.
      <submodule>/ Permitido apenas com um nível de profundidade para domínios agregadores aprovados, como `operations`.
        components/ UI exclusiva do domínio dentro do submódulo agregador.
        api/        Objetos de API do submódulo, chamados pelos hooks.
        hooks/      Hooks React do domínio dentro do submódulo agregador.
        interfaces/ Tipos TypeScript do domínio dentro do submódulo agregador.
        stores/     Zustand local do domínio dentro do submódulo agregador.
        utils/      Funções puras do domínio dentro do submódulo agregador.
  flags/           Feature flags.
  global.css       Exceção permitida na raiz de `src/` (estilos globais/Tailwind).
  hooks/           Hooks React compartilhados por 2+ domínios.
  http/            Configuração do cliente HTTP (axios, interceptors).
  interfaces/      Tipos TypeScript compartilhados por 2+ domínios.
  lib/             Inicialização de bibliotecas de terceiros (analytics, MMKV, cache).
  stores/          Zustand global (sessão, tema, conectividade).
  utils/           Funções puras compartilhadas.
```

Pastas NÃO cobertas pela arquitetura devem ser tratadas como smell. Se aparecer `src/services/`, `src/contexts/`, `src/types/`, `src/features/operationDetails/`, `src/features/operationPhotos/` ou `src/features/operationOccurrences/`, mova o conteúdo conforme a árvore de decisão.

## Separação entre API e hook

O objeto que encapsula as chamadas HTTP de uma feature fica em `features/<domain>/api/`. O hook fica em `features/<domain>/hooks/` e chama esse objeto:

```text
src/features/<domain>/
  api/<resource>.api.ts             ← objeto com as chamadas HTTP
  hooks/use<Operation><Resource>.ts ← hook que chama o objeto de API
  interfaces/                       ← props e respostas, quando necessário
```

O objeto de API deve exportar um único objeto `<recurso>Api` com métodos nomeados. O hook concentra a integração com React Query, estados e parâmetros derivados; o arquivo em `api/` concentra as chamadas HTTP.

## Casos de borda e smells

### Componente "compartilhado" com nome de domínio

```
❌ src/components/operations/OperationCard.tsx
✅ src/features/operations/components/OperationCard.tsx
```

Se surgir uma subpasta com nome de domínio dentro de `src/components/`, mova-a.

### Hook usado por exatamente 2 domínios

Regra dos 2: promova-o. Não espere chegar a 3+.

```
❌ src/features/orders/hooks/useFormatAddress.ts  (também importado por features/checkin)
✅ src/hooks/useFormatAddress.ts
```

### Interface usada por 2 domínios

```
❌ src/features/orders/interfaces/Driver.ts  (também importado por features/checkin)
✅ src/interfaces/Driver.ts
```

### Exceção de submódulo agregador

Regra padrão: subdomínios são proibidos. Exceção: o agregado `operations` pode ter exatamente um nível de submódulo para `details`, `photos` e `occurrences`.

```
❌ src/features/operationDetails/hooks/...
✅ src/features/operations/details/hooks/...
```

```
❌ src/features/operationPhotos/components/...
✅ src/features/operations/photos/components/...
```

```
❌ src/features/operationOccurrences/hooks/...
✅ src/features/operations/occurrences/hooks/...
```

Nunca passe de um nível de aninhamento:

```
❌ src/features/operations/details/documents/hooks/...
✅ src/features/operations/details/hooks/...
```

### Chamada HTTP isolada do hook

Quando a chamada HTTP for usada por um hook de uma única feature, mantenha-a no objeto de API da feature:

```
✅ src/features/<domain>/api/<name>.api.ts
```

Se o arquivo for compartilhado por mais de um domínio, use:

```
✅ src/api/<name>.api.ts
```

Isto é uma referência de posicionamento. Por padrão, a skill não faz auditoria em massa dos detalhes internos do backend.

### Objeto de API dentro de `src/backend/`

Dados locais do backend permanecem em `src/backend/`, mas objetos de API com nome `*.api.ts` não.

```
❌ src/backend/occurrences/infra/occurrences.api.ts
✅ src/features/occurrences/api/occurrences.api.ts
```

```
❌ src/backend/operations/infra/operations.api.ts
✅ src/features/operations/api/operations.api.ts
```

Isso vale mesmo quando o consumidor atual é apenas um caso de uso do backend mobile.

### `index.tsx` vs `page.tsx`

Padrão do Expo Router e do projeto: sempre `index.tsx`, nunca `page.tsx`.

### Constante específica de um único domínio

```
❌ src/environment/orderStatuses.ts  (somente orders usa isso)
✅ src/features/orders/utils/statuses.ts  ou  features/orders/interfaces/OrderStatus.ts
```

`src/environment/` é para configuração global.

### Pasta ou arquivo em kebab-case dentro de `src/`

Pastas e arquivos que não são componentes usam camelCase. Kebab-case aparece apenas nas rotas de `src/app/`.

```
❌ src/features/foreground-sync/
✅ src/features/foregroundSync/
```

```
❌ src/utils/app-headers.ts
✅ src/utils/appHeaders.ts
```

Components (`*.tsx`), Stores (`*Store.ts`) e Interfaces continuam em PascalCase porque o nome do arquivo espelha o símbolo exportado.

### Componente auxiliar de uso único definido inline na rota

Componentes de uma única tela (skeleton de loading, card de erro, empty state) não são declarados dentro do arquivo de rota. Exceção: até 5 linhas podem ficar inline.

```
❌ src/app/(app)/home/index.tsx  (HomeSkeleton e o card de erro com retry declarados como funções dentro do arquivo da rota)
✅ src/features/home/components/HomeSkeleton/index.tsx
✅ src/features/home/components/HomeError/index.tsx
```

### `*.api.ts` exportando função solta

Quando o recurso tem mais de uma operação, o arquivo exporta um único objeto `<recurso>Api` com um método por operação, em vez de funções soltas. Assim o import fica previsível (`recursoApi.getX(...)`) e novas operações não multiplicam arquivos.

```
❌ export async function getMyBases() { ... }  (função solta em bases.api.ts)
✅ export const basesApi = { getMyBases: async (...) => { ... } }  em `src/features/bases/api/bases.api.ts`
```

Arquivos `*.api.ts` legados com função solta (ex.: `tanksApi`, `login.api.ts`) não migram só por causa desta regra — sugira a migração apenas quando o arquivo for tocado por outro motivo.

### Componente de app shell definido inline no layout

Componentes usados pela aplicação inteira (ErrorBoundary, providers, wrappers globais) não têm o corpo definido em `src/app/**`. Moram em `src/components/<Name>/index.tsx`, e o local de uso importa direto de lá, removendo a definição e os imports órfãos do arquivo de rota.

```
❌ function ErrorBoundary(...) { ... } definida dentro de src/app/_layout.tsx (linhas 32–56, com imports próprios de ErrorBoundaryProps, SplashScreen, ScrollView, Typography)
✅ src/components/ErrorBoundary/index.tsx  +  export { ErrorBoundary } from "@/components/ErrorBoundary"  no _layout.tsx
```

Exceção do Expo Router: o `_layout.tsx` precisa exportar `ErrorBoundary` para capturar erros de renderização das rotas. Nesse caso o layout apenas **re-exporta** o componente que vive em `src/components/` — nunca define o corpo. Fora desse contrato, vale o import direto; nunca re-exportar por comodidade.

Distinção com a regra de rota: app shell → `src/components/`; uso único de feature → `src/features/<domain>/components/`.

### Componente de navegação com lógica de bootstrap

Componentes de navegação devem ser finos: ler estado e renderizar rotas. Toda lógica de inicialização (carregar fontes, validar token, buscar dados iniciais, controlar splash screen) vai para um hook próprio. Componente fino e puro (estado → rotas) continua memoizável pelo React Compiler, e a lógica de init fica testável isoladamente.

```
❌ AppNavigator em src/app/_layout.tsx concentrando useFonts, useGetBases, dois useEffect (bootstrap com checagem de token e splash) e useState
✅ src/hooks/useBootstrap.ts  +  AppNavigator apenas lendo token e fontsLoaded para renderizar o Stack
```

## Tratando código legado

Ao mexer em um arquivo cuja pasta atual viola a arquitetura:

1. Faça a alteração solicitada normalmente.
2. **Depois**, em um bloco separado, sinalize o desvio e proponha a migração:

```
⚠️ Desvio arquitetural detectado neste arquivo
Atual: src/features/orders/api/orders.ts
Sugerido: manter o objeto em `src/features/orders/api/orders.api.ts` e chamá-lo pelo hook em `src/features/orders/hooks/useGetOrders.ts`
Quer que eu faça a migração agora?
```

Não force a migração; apenas ofereça. Migrações em massa só quando o usuário pedir explicitamente uma auditoria da pasta.

## Auditoria em massa (sob demanda)

Quando o usuário pedir "auditar pasta X" ou "listar violações em src/":

1. Liste todo arquivo/pasta que viola a arquitetura.
2. Para cada item, retorne o veredito padrão (✅/⚠️/❌ + caminho + motivo).
3. Agrupe por tipo de violação no final (ex.: "3 hooks de domínio em `src/hooks/`", "1 objeto de API fora da feature").
4. Não faça mudanças sem confirmação.

## Exceções permitidas

- `src/global.css` na raiz de `src/`.
- `src/environment/index.ts` e `src/environment/constants/index.ts` que definem valores diretamente (não são barrel files).
- `src/app/<route>/index.tsx` (exigência do Expo Router).
- Rotas em `src/app/` em português (deep linking).

## Regras rápidas obrigatórias

- Não criar barrel files com `index.ts` apenas para reexportar.
- Nomes internos devem ficar em inglês; exceção para rotas em `src/app/`.
- `src/components/` deve permanecer flat para domínios; não criar subpasta com nome de domínio.
- Pastas e arquivos não-componentes usam camelCase dentro de `src/` (fora de `src/app/`).
- Promova artefatos compartilhados assim que um segundo domínio começar a usá-los.

## Fora do escopo desta skill

- Conteúdo de código dentro dos arquivos (tipos TS, lógica, design system).
- `src/backend/` — veja a skill `react-native-local-database`.
- Convenções internas de TS — veja as skills `react-native-typescript-guardrails` e `react-native-code-style`.
- Padrões visuais de componentes — veja a skill `react-native-design-guardrails`.
