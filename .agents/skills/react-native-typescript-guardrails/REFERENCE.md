# Referência de Guardrails de TypeScript para React Native

Esta referência contém os guardrails detalhados de TypeScript usados pela skill.

## Objetivo

Use esta referência ao escrever, refatorar ou revisar código React Native com TypeScript.
O objetivo é manter o código explicitamente tipado, previsível e alinhado ao guia de TypeScript do projeto.

## Quando aplicar

- Aplique estas regras apenas a arquivos `.ts` e `.tsx`.
- Se a solicitação incluir arquivos que não sejam TypeScript, trate-os como fora do escopo desta referência.
- Considere estas regras obrigatórias, a menos que o usuário peça explicitamente um escopo mais restrito.

## Premissas do compilador

- `strict` está habilitado.
- `noImplicitAny` está habilitado.
- `null` e `undefined` devem ser tratados explicitamente.
- `any` não é permitido, incluindo `any` implícito.
- Assume-se React 19 e o React Compiler.

## Regras canônicas

- `any` é proibido, incluindo `any` explícito.
- Prefira primeiro tipos concretos de domínio; use `unknown` apenas como último recurso quando o valor realmente não puder ser tipado de antemão e precisar ser refinado.
- Tipar explicitamente parâmetros, valores de retorno e variáveis relevantes; não depender de inferência para contratos estáveis.
- `as` só é permitido quando houver justificativa e não pode ser usado para mascarar problemas de tipagem de domínio.
- Erros em `catch` devem ser tipados como `unknown`.

## Convenções de tipagem

### `interface` vs `type`

- Use `interface` para estruturas de objeto que possam ser estendidas.
- Use `type` para unions, aliases e composições.

### Centralização e Reuso de Interfaces

- **Sempre reutilizar interfaces e tipos existentes** para evitar a descentralização e duplicação desnecessária de contratos.
- **Estruturas do arquivo `src/interfaces/Default.ts`**:
  - **Resposta paginada**: Sempre que uma resposta da API contiver estrutura de paginação (`total_pages`, `total_rows`, `data`), utilize `PaginatedResponse<T>` em vez de recriar a interface. Exemplo: `export type ManifestosResponse = PaginatedResponse<ManifestoApiRecord>;`.
  - **Filtros e queries de paginação**: Propriedades de busca e paginação de filtros devem estender `DefaultGetProps` (`id`, `offset`, `search`, `order`, `pageSize`).
  - **Identificadores**: Utilize `IdProps` (`string | number | null`) para identificadores comuns.
- **Regra de localização e domínio**:
  - Se um tipo ou interface for de uso comum em múltiplos contextos ou features (ex: propriedades de localização do dispositivo, tokens, etc.), ele deve ser centralizado em `src/interfaces/`.
  - Se for estritamente específico de uma regra de negócio de um domínio, ele deve residir dentro do diretório correspondente da feature (`src/features/<feature>/interfaces/`).

### `null` e `undefined`

- Use `null` para ausência canônica em valores de retorno.
- Use `undefined` apenas para propriedades de objeto genuinamente opcionais.
- Prefira valores padrão em parâmetros em vez de parâmetros opcionais.

### `unknown`

- Não substitua `any` por `unknown` mecanicamente.
- Primeiro prefira um tipo concreto, generic, discriminated union ou contrato de domínio já existente.
- Use `unknown` apenas quando o formato em runtime realmente não puder ser conhecido na fronteira e o refinamento precisar ser feito localmente.

### Asserções de tipo

- Evite `as`, a menos que a asserção seja inevitável e tenha escopo restrito.
- Use `as const` apenas para literais imutáveis.

## Exemplos

```ts
function findDriverById(id: string): Driver | null {
  const driver: Driver | undefined = drivers.get(id);
  if (!driver) return null;
  return driver;
}
```

```ts
interface OperationCardProps {
	operation: Operation;
	onPress: (id: string) => void;
}

export function OperationCard({ operation, onPress }: OperationCardProps): React.JSX.Element {
	return <></>;
}
```

## Fluxo de revisão

1. Inspecione os arquivos alterados e decida se a tarefa é de implementação ou revisão.
2. Aplique as regras acima apenas na superfície alterada, a menos que o usuário peça uma auditoria mais ampla.
3. Relate os achados com a regra, arquivo e linha sempre que possível.
4. Prefira a interpretação mais rígida se uma regra for ambígua.

## Checklist

1. Sem `any`; prefira tipos concretos e use `unknown` apenas como último recurso.
2. Tipos explícitos em parâmetros, valores de retorno e variáveis relevantes.
3. `interface` para estruturas de objeto extensíveis; `type` para unions, aliases e composições.
4. `null` para ausência canônica; `undefined` apenas para propriedades genuinamente opcionais; valores padrão em parâmetros em vez de parâmetros opcionais.
5. `as` apenas quando justificado; erros em `catch` devem ser `unknown`.
6. Reutilizar interfaces de `src/interfaces/Default.ts` (como `PaginatedResponse<T>`, `DefaultGetProps`, `IdProps`) e evitar duplicação de tipos comuns (como localização/dispositivo), respeitando a regra de domínio (comuns em `src/interfaces/`, específicos nas features).

## Limites de escopo

- Esta skill não substitui skills de arquitetura, acessibilidade ou design system.
- Ela foca em código React Native com TypeScript e em tarefas adjacentes de revisão.
