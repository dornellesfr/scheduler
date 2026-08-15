# PRD: Mobile Appointment History

## Problem Statement

A tab Histórico do aplicativo mobile ainda exibe apenas o estado vazio do shell. O paciente precisa consultar o histórico real de consultas, abrir os detalhes de cada uma e cancelar quando o status permitir, usando a API já existente no backend.

## Solution

Implementar o fluxo de histórico de consultas na tab Histórico: listar as consultas do paciente de demonstração via React Query, filtrar por status com chips (incluindo “Todos”), abrir detalhes em Dialog na mesma rota e permitir cancelamento com confirmação quando o status for `scheduled` ou `confirmed`. Após cancelar com sucesso, a lista é invalidada e o detalhe permanece aberto refletindo o status `canceled`, sem ações.

## User Stories

1. Como paciente, quero ver minhas consultas no Histórico, para acompanhar o que já foi marcado.
2. Como paciente, quero que a lista use dados reais da API, para não confundir mock com informação verdadeira.
3. Como paciente, quero ver um estado de carregamento enquanto as consultas são buscadas, para entender que o app está trabalhando.
4. Como paciente, quero ver “Nenhuma consulta encontrada.” quando a lista vier vazia, para distinguir ausência de dados de falha.
5. Como paciente, quero ver uma mensagem de erro quando a listagem falhar, para saber que algo deu errado.
6. Como paciente, quero poder tentar novamente após um erro de listagem, para recuperar sem reiniciar o app.
7. Como paciente, quero ver cada consulta com informações suficientes na lista (profissional, especialidade, data/hora e status), para identificar o item sem abrir o detalhe.
8. Como paciente, quero status legíveis em português na interface, para compreender o estado da consulta.
9. Como paciente, quero filtrar por “Todos” no início, para ver o histórico completo.
10. Como paciente, quero filtrar por status Agendada, para ver só o que ainda está marcado.
11. Como paciente, quero filtrar por status Confirmada, para ver só o que já foi confirmado.
12. Como paciente, quero filtrar por status Concluída, para ver só o histórico finalizado.
13. Como paciente, quero filtrar por status Cancelada, para ver só o que foi cancelado.
14. Como paciente, quero que a troca de filtro atualize a lista, para confiar no resultado exibido.
15. Como paciente, quero tocar em uma consulta da lista, para abrir seus detalhes.
16. Como paciente, quero ver os detalhes na mesma tab/rota, sem navegar para outra tela, para manter o fluxo simples.
17. Como paciente, quero ver no detalhe profissional, especialidade, data/hora, status e observações quando existirem, para revisar a consulta completa.
18. Como paciente, quero fechar o detalhe facilmente, para voltar à lista.
19. Como paciente, quero cancelar uma consulta agendada a partir do detalhe, para desistir do horário.
20. Como paciente, quero cancelar uma consulta confirmada a partir do detalhe, para desistir do horário já confirmado.
21. Como paciente, quero que consultas canceladas não ofereçam ações, para não tentar operação inválida.
22. Como paciente, quero que consultas concluídas não ofereçam cancelamento nesta entrega, porque a API não permite cancelar esse status.
23. Como paciente, quero confirmar o cancelamento em um segundo diálogo, para evitar cancelamento acidental.
24. Como paciente, quero poder desistir na confirmação de cancelamento, para manter a consulta como está.
25. Como paciente, quero ver feedback de carregamento durante o cancelamento, para saber que a ação está em andamento.
26. Como paciente, quero ver erro se o cancelamento falhar, para tentar de novo ou fechar.
27. Como paciente, quero que, após cancelar com sucesso, o detalhe continue aberto com status cancelado e sem ações, para confirmar o resultado.
28. Como paciente, quero que a lista se atualize após o cancelamento, para refletir o novo status sem sair da tela.
29. Como paciente, quero rolar a lista de forma performática, para consultar muitos itens com fluidez.
30. Como paciente, quero que o Histórico respeite tema claro/escuro e a linguagem visual neutra com azul primário, para manter consistência com o shell.
31. Como desenvolvedor mobile, quero usar apenas endpoints verificados no backend e no Insomnia, para não inventar contrato.
32. Como desenvolvedor mobile, quero usar React Query em todas as requisições deste fluxo, para cache, loading e invalidação previsíveis.
33. Como desenvolvedor mobile, quero isolar o objeto de API da feature de appointments dos hooks React Query, para seguir a arquitetura do projeto.
34. Como desenvolvedor mobile, quero reutilizar o cliente HTTP Axios com base URL via variável de ambiente, para apontar ao backend local/emulador.
35. Como desenvolvedor mobile, quero usar o paciente de demonstração fixo exigido pela API, para listar consultas sem autenticação nesta fase.
36. Como desenvolvedor mobile, quero usar FlashList v2 na lista, para performance alinhada à New Architecture.
37. Como desenvolvedor mobile, quero usar componentes React Native Reusables (Button, Dialog, Text e correlatos necessários), para evitar UI default do React Native quando houver equivalente.
38. Como desenvolvedor mobile, quero manter o detalhe e a confirmação de cancelamento como Dialogs na rota do Histórico, para não criar rota dedicada de detalhe.
39. Como desenvolvedor mobile, quero aplicar as skills de architecture, code style e TypeScript guardrails, para manter o código alinhado ao repositório.
40. Como mantenedor, quero testes de comportamento observável no Histórico, para regressões de empty/loading/lista/filtro/detalhe/cancelamento sem acoplar a detalhes internos.

## Implementation Decisions

- Escopo estritamente mobile; backend e contratos de API não mudam nesta entrega.
- Endpoints permitidos (dupla verificação backend + Insomnia):
  - `GET /appointments?patient_id=...` (opcional `status`)
  - `GET /appointments/{id}` (detalhe sob demanda se necessário; a lista já traz payload suficiente para o dialog)
  - `POST /appointments/{id}/cancel`
- Não existem endpoints de confirmar ou concluir consulta; essas ações ficam fora do escopo apesar da regra de produto ideal.
- Cancelamento só para status `scheduled` e `confirmed`, alinhado ao `AppointmentService` do backend. `completed` e `canceled` não exibem ação de cancelar.
- Resposta da API usa envelope Laravel Resource: coleção em `data[]`, item em `data`.
- Status da API (inglês): `scheduled`, `confirmed`, `completed`, `canceled`. Labels de UI em português.
- `patient_id` fixo de demonstração: `00000000-0000-4000-8000-000000000001` (mesmo default de `DEMO_PATIENT_ID` / `config('app.demo_patient_id')`).
- Cliente HTTP Axios já existente; base URL via `EXPO_PUBLIC_API_URL`, com fallback coerente ao emulador Android. O usuário pediu `http://localhost:8000` como referência de backend; no mobile o path da API continua sob `/api` e no emulador Android o host típico é `10.0.2.2`.
- Feature domain: `appointments`.
  - API object isolado chamado pelos hooks.
  - Hooks React Query para listagem e cancelamento (e detalhe se usado).
  - Interfaces de domínio da feature.
  - Componentes de UI da feature (card, chips de filtro, dialogs de detalhe/confirmação, empty/error/loading).
- Rota do Histórico permanece a tab existente e orquestra estado de seleção/dialogs; sem componentes grandes inline na rota além do permitido pela architecture skill.
- Lista com FlashList v2 (`@shopify/flash-list` 2.x).
- Filtro: chips horizontais no topo — Todos | Agendada | Confirmada | Concluída | Cancelada. “Todos” omite o query param `status`; demais enviam o valor da API.
- Detalhe: Dialog na mesma tab/rota ao tocar no item.
- Cancelamento: segundo Dialog de confirmação sobre o de detalhe.
- Após cancelamento bem-sucedido: fechar só o dialog de confirmação; invalidar query da lista; manter dialog de detalhe aberto com status `canceled` e sem ações.
- UI prioritariamente React Native Reusables (Button, Dialog, Text; outros se necessário). Evitar primitives default do RN quando houver equivalente na lib.
- Dependências novas permitidas para este escopo: FlashList v2 e o necessário para os componentes Reusables/Uniwind ainda não presentes no projeto.
- Sem auth, sem Zustand para este fluxo, sem dados fictícios de consultas.
- Agendar permanece fora; tab Agendar inalterada.

### Regras de ação por status (desta entrega)

| Status API   | Ação no detalhe      |
|-------------|----------------------|
| scheduled   | pode cancelar        |
| confirmed   | pode cancelar        |
| completed   | nenhuma ação         |
| canceled    | nenhuma ação         |

Nota: o desejo original de “agendada→confirmar, confirmada→concluir, concluída→cancelar” foi explicitamente reduzido ao que a API já faz.

## Testing Decisions

- Testar comportamento observável pelo usuário (RNTL), não internals de FlashList, React Query ou estrutura de pastas.
- Seam principal: tela Histórico / composição do fluxo de histórico, estendendo o smoke test existente do empty state.
- Mockar a camada de API / client HTTP nos testes de UI; sem rede real.
- Cenários mínimos:
  - empty state quando a lista retorna vazia
  - loading enquanto busca
  - erro de listagem
  - render de itens com dados
  - chips de filtro disparam nova consulta com o status correto (ou sem status em Todos)
  - toque no item abre detalhe
  - botão cancelar visível só em scheduled/confirmed
  - confirmação de cancelamento e sucesso atualiza status no detalhe / lista
- Não exigir cobertura E2E, snapshots nem testes do backend nesta entrega (backend já tem testes de endpoints).
- Lint e typecheck/testes existentes do mobile devem continuar executáveis.

## Out of Scope

- Endpoints ou UI de confirmar consulta.
- Endpoints ou UI de concluir consulta.
- Cancelar consulta `completed`.
- Alterações no backend, migrations, seeds ou Insomnia.
- Autenticação, sessão, cadastro de paciente real.
- Fluxo de agendamento (tab Agendar).
- Rota/stack dedicada de detalhe.
- Filtros além do status (data, profissional, busca textual).
- Paginação infinita (API atual retorna coleção completa).
- Notificações push, offline-first, persistência local de consultas.
- Design system completo além dos componentes Reusables necessários.
- iOS/web como alvo de validação prioritária (Android permanece o alvo, como no shell).

## Further Notes

- Fonte de verdade do produto: `specs/260803-teste-dev-mobile.pdf`. Este PRD é entrega incremental do histórico alinhada ao backend atual.
- O shell (`002-home-shell-tabs`) permanece a base de navegação; este PRD substitui o empty-only do Histórico por fluxo real.
- Skills obrigatórias em qualquer trabalho em `/mobile`: `react-native-architecture-auditor`, `react-native-code-style`, `react-native-typescript-guardrails`.
- FlashList v2 já foi adicionado ao mobile durante a exploração; componentes Reusables ainda precisam ser instalados/configurados (CLI pediu ajuste de `components.json`).
- Decisões fechadas na conversa de design:
  1. Só o que a API faz (listar, detalhe, cancelar scheduled/confirmed).
  2. Detalhe na mesma tab/rota via Dialog.
  3. `patient_id` demo fixo.
  4. Pós-cancelamento: fecha confirmação, invalida lista, detalhe aberto canceled.
  5. Segundo Dialog para confirmar cancelamento.
  6. Filtro com Todos + status via chips.
