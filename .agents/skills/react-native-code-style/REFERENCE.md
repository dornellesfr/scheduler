# Referência de Estilo de Código para React Native

Esta referência contém as regras detalhadas de estilo de código e organização usadas pela skill.

## Objetivo

Use esta referência ao escrever, refatorar ou revisar código React Native com TypeScript.
O objetivo é manter o código direto, legível e organizado de forma consistente com o guia de estilo do projeto.

## Quando aplicar

- Aplique estas regras apenas a arquivos `.ts` e `.tsx`.
- Se a solicitação incluir arquivos que não sejam TypeScript, trate-os como fora do escopo desta referência.
- Considere estas regras obrigatórias, a menos que o usuário peça explicitamente um escopo mais restrito.
- Regras de type-safety (`any`, `unknown`, `interface` vs `type`, asserções `as`, `null` vs `undefined`, valores padrão em parâmetros) estão fora do escopo: elas pertencem à skill `react-native-typescript-guardrails`.

## Regras canônicas

- Mantenha nomes em inglês para variáveis, funções, tipos e conceitos de domínio.
- Prefira retornos antecipados e guard clauses.
- Mantenha expressões diretas e evite blocos `if` redundantes.
- Evite verificações desnecessárias com `Array.isArray`.
- As props de componentes React devem ficar no topo do arquivo.
- `useMemo` e `useCallback` não devem ser adicionados por padrão.
- Não substitua `useFocusEffect` por `useEffect`, a menos que o usuário peça explicitamente para alterar o comportamento baseado em foco.
- Não remova código comentado, a menos que o usuário peça explicitamente limpeza ou remoção.
- Handlers de 1 linha (até 5 linhas) devem ser inline no prop; funções com mais de 3 linhas usadas 2+ vezes devem ser nomeadas dentro do componente.

## Regras de estilo

### Nomes em inglês

Mantenha nomes em inglês para variáveis, funções, tipos e conceitos de domínio.

### Retornos antecipados

Prefira guard clauses e retornos antecipados. Evite blocos `else` aninhados quando um retorno direto resolver.

### Expressões simples

Prefira expressões booleanas diretas, `?.`, `??` e ternários simples em vez de ramificações verbosas.

### Verificações de array

Não use `Array.isArray` de forma defensiva quando o tipo já garante um array.
Use apenas para unions reais, como `Item | Item[]`.

### Props do React

Declare as props no topo do arquivo do componente.
Para props com mais de um campo, prefira uma interface ou type nomeado como `Props`.

### Hooks

Não adicione `useMemo` ou `useCallback` por padrão.
Só introduza esses hooks quando profiling mostrar uma necessidade mensurável.

- `useFocusEffect` é comportamentalmente diferente de `useEffect`; preserve-o quando a tela precisar reagir a foco ou blur.
- Quando `useFocusEffect` já existir, você pode simplificar o formato do callback se isso for seguro, mas não remova o hook apenas para satisfazer a regra de `useCallback`.

### Código comentado

- Trate código comentado como fora de escopo por padrão.
- Não reporte violações heurísticas a partir de linhas comentadas.
- Não remova comentários legados, exemplos comentados ou placeholders comentados, a menos que o usuário solicite explicitamente a limpeza.

### Padrão de handlers (inline vs nomeados)

Um handler que se resume a uma chamada (ex.: `router.push("/tanks")`) não merece ser uma função declarada no componente — deve ser usado inline no prop:

```tsx
onPress={() => router.push("/tanks")}
```

Limites para decidir entre inline e função nomeada:

- **Até 5 linhas:** pode ser inline.
- **2+ usos da mesma função com mais de 3 linhas:** extrair para função nomeada dentro do componente (DRY), em vez de duplicar o corpo inline em cada uso.

## Exemplos

Guard clauses e retornos antecipados:

```ts
function findDriverById(id: string): Driver | null {
  const driver: Driver | undefined = drivers.get(id);
  if (!driver) return null;
  return driver;
}
```

Props declaradas no topo do arquivo:

```tsx
interface OperationCardProps {
	operation: Operation;
	onPress: (id: string) => void;
}

export function OperationCard({ operation, onPress }: OperationCardProps): React.JSX.Element {
	return <></>;
}
```

Handler de 1 linha inline no prop:

```tsx
// Correto: handler de 1 linha inline
<Button onPress={() => router.push("/tanks")} />

// Incorreto: função de 1 linha declarada só para ser passada ao onPress
const goToTanks = () => router.push("/tanks");
<Button onPress={goToTanks} />
```

Função nomeada quando o corpo tem mais de 3 linhas e 2+ usos:

```tsx
export function HomeScreen(): React.JSX.Element {
	const router = useRouter();

	// Correto: corpo com mais de 3 linhas, usado 2+ vezes, vira função nomeada (DRY)
	function handleSubmit(): void {
		const payload = buildPayload(form);
		trackEvent("form_submit", payload);
		router.push("/confirmation");
	}

	return (
		<>
			<Button onPress={handleSubmit} />
			<Link onPress={handleSubmit} />
		</>
	);
}
```

## Fluxo de revisão

1. Inspecione os arquivos alterados e decida se a tarefa é de implementação ou revisão.
2. Aplique as regras acima apenas na superfície alterada, a menos que o usuário peça uma auditoria mais ampla.
3. Relate os achados com a regra, arquivo e linha sempre que possível.
4. Prefira a interpretação mais rígida se uma regra for ambígua.
5. Ignore código comentado durante a revisão heurística, a menos que o usuário peça explicitamente para revisar ou remover.

## Checklist

1. Nomes apenas em inglês.
2. Retornos antecipados e guard clauses.
3. Sem blocos `if` desnecessários ou ramificações verbosas.
4. Sem `Array.isArray` defensivo.
5. Props declaradas no topo do arquivo do componente.
6. Sem `useMemo` ou `useCallback` por padrão.
7. Preserve `useFocusEffect` quando a semântica de foco for necessária.
8. Não remover código comentado, a menos que seja explicitamente solicitado.
9. Handlers de até 5 linhas inline no prop; funções com mais de 3 linhas e 2+ usos nomeadas dentro do componente.
10. Mantenha as mudanças mínimas e consistentes com o código existente.

## Limites de escopo

- Esta skill não substitui skills de arquitetura, acessibilidade ou design system.
- Ela foca em estilo de código e organização em React Native com TypeScript e em tarefas adjacentes de revisão.
- Regras de type-safety pertencem à skill `react-native-typescript-guardrails`.
