---
name: react-native-code-style
description: Aplica e revisa regras de estilo de código e organização em codebases React Native com TypeScript. Use ao escrever, refatorar ou revisar arquivos .ts/.tsx, verificando guard clauses, expressões simples, verificações de array, declaração de props, uso de useMemo/useCallback, useFocusEffect, código comentado, nomes em inglês e o padrão de handlers inline vs nomeados.
---

# React Native Code Style

Use esta skill para trabalho em React Native com TypeScript que precise de orientação de estilo de código e organização.

## Quando usar

Veja [REFERENCE.md](REFERENCE.md) para as regras detalhadas e o fluxo de revisão.

## Verificação rápida

1. Verifique apenas os arquivos `.ts` e `.tsx` alterados.
2. Se o usuário fornecer arquivos que não sejam `.ts` ou `.tsx`, informe que este guardrail se aplica apenas a arquivos TypeScript e ignore esses arquivos na revisão.
3. Carregue e aplique o conjunto de regras de [REFERENCE.md](REFERENCE.md).
4. Se `REFERENCE.md` não estiver presente no seu contexto atual, leia-o da pasta desta skill antes de prosseguir.
5. Trate as regras de [REFERENCE.md](REFERENCE.md) como obrigatórias, a menos que o usuário peça explicitamente um escopo mais restrito.
6. Esta skill cobre apenas estilo de código e organização; regras de type-safety (`any`, `unknown`, `interface` vs `type`, valores padrão em parâmetros, etc.) pertencem à skill `react-native-typescript-guardrails`.

## Saída

- Em revisões, sempre relate a regra, o arquivo e a linha.
- Se o número exato da linha não puder ser determinado, relate o arquivo e a função ou componente mais próximo.
- Em ajuda de implementação, mantenha as mudanças mínimas e consistentes com o código existente.
