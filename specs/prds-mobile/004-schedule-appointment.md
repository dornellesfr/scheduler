# PRD: Mobile Schedule Appointment Flow

## Problem Statement

A tab Agendar do aplicativo mobile ainda exibe apenas o estado vazio do shell (“O agendamento de consultas estará disponível em breve.”). O paciente de demonstração precisa agendar uma nova consulta pelo aplicativo: escolher especialidade, profissional, data e horário, revisar os dados e confirmar, usando a API REST já existente no backend.

Sem este fluxo, o escopo funcional do teste (agendar consulta) permanece incompleto, mesmo com histórico, detalhes e cancelamento já cobertos na tab Histórico.

## Solution

Implementar o fluxo completo de agendamento na tab Agendar. A tab abre na lista de especialidades; ao escolher uma, o usuário entra em um wizard de três passos na mesma tab (profissional → data e horário → revisão e confirmação). O POST cria a consulta com status inicial `scheduled` no backend. Após sucesso, a tab mostra um resumo com ações para ver o histórico ou agendar outra consulta.

O fluxo usa apenas endpoints já existentes e verificados no backend e no Insomnia: listar especialidades, listar profissionais por especialidade e criar agendamento. Não há endpoint de disponibilidade; a grade de horários é definida no app e conflitos reais retornam HTTP 409.

## User Stories

1. Como paciente, quero abrir a tab Agendar e ver especialidades reais da API, para começar um agendamento sem dados fictícios.
2. Como paciente, quero ver um estado de carregamento enquanto as especialidades são buscadas, para entender que o app está trabalhando.
3. Como paciente, quero ver “Nenhuma especialidade encontrada.” quando a lista vier vazia, para distinguir ausência de dados de falha.
4. Como paciente, quero ver uma mensagem de erro quando a listagem de especialidades falhar, para saber que algo deu errado.
5. Como paciente, quero poder tentar novamente após erro na listagem de especialidades, para recuperar sem reiniciar o app.
6. Como paciente, quero ver o título “Especialidade” na porta de entrada do agendamento, para saber o que devo escolher primeiro.
7. Como paciente, quero tocar em uma especialidade em lista vertical de cards/linhas, para iniciar o wizard com aquela especialidade fixada.
8. Como paciente, quero que o wizard mostre “Passo 1 de 3 · Profissional”, para saber onde estou no fluxo.
9. Como paciente, quero ver profissionais da especialidade escolhida em cards com nome e especialidade, para escolher quem vai me atender.
10. Como paciente, quero ver loading, empty e erro com retry na lista de profissionais, para o mesmo padrão confiável do restante do app.
11. Como paciente, quero tocar em um profissional e avançar automaticamente para o próximo passo, para fluir rápido sem botão Continuar.
12. Como paciente, quero ver “Passo 2 de 3 · Data e horário”, para escolher quando será a consulta.
13. Como paciente, quero escolher a data com o date picker do sistema, para usar um controle familiar.
14. Como paciente, quero que só datas de hoje até hoje + 30 dias sejam permitidas, para não agendar fora de uma janela razoável.
15. Como paciente, quero ver uma grade de horários de 08:00 a 18:00 com inícios a cada 45 minutos e último início às 17:15, para escolher um horário comercial previsível.
16. Como paciente, quero que no dia de hoje só apareçam horários ainda futuros, para não tentar agendar no passado (RN-01 no client).
17. Como paciente, quero tocar em um horário e avançar automaticamente para a revisão, para manter o mesmo padrão de seleção do profissional.
18. Como paciente, quero ver “Passo 3 de 3 · Revisão”, para conferir tudo antes de confirmar.
19. Como paciente, quero ver na revisão especialidade, profissional, data, horário de início e término estimado (+45 min), para entender a duração da consulta.
20. Como paciente, quero preencher observações opcionais em campo multilinha na revisão, para enviar notas relevantes quando quiser.
21. Como paciente, quero que observações vazias não sejam enviadas (ou sejam nulas), para não poluir o payload.
22. Como paciente, quero tocar em “Confirmar agendamento” para criar a consulta na API, para concluir o fluxo do PDF.
23. Como paciente, quero ver feedback de carregamento durante o POST, para saber que a confirmação está em andamento.
24. Como paciente, quero ver um Alert/Dialog com a mensagem da API se a criação falhar (validação, conflito ou rede), para entender o problema e tentar de novo.
25. Como paciente, quero, após sucesso, ver que a consulta foi agendada com sucesso com um resumo, para ter confirmação clara.
26. Como paciente, quero a ação “Ver no histórico” após o sucesso, para ir à tab Histórico e encontrar a nova consulta.
27. Como paciente, quero que ao tocar “Ver no histórico” a tab Agendar volte à lista de especialidades em background, para não reencontrar a tela de sucesso ao retornar.
28. Como paciente, quero a ação “Agendar outra” após o sucesso, para recomeçar o fluxo na lista de especialidades.
29. Como paciente, quero que o histórico seja invalidado após um agendamento bem-sucedido, para a lista refletir a nova consulta sem truques manuais.
30. Como paciente, quero voltar no wizard (UI e back do sistema) de revisão → data/hora → profissional → lista de especialidades, para corrigir escolhas anteriores.
31. Como paciente, quero que ao voltar da lista de especialidades (porta de entrada) o comportamento padrão do app se mantenha, porque não há rascunho nessa tela.
32. Como paciente, quero que o rascunho do wizard exista só em memória enquanto a tab estiver montada, para não depender de persistência local neste escopo.
33. Como paciente, quero que sair e voltar à tab sem desmontar preserve o rascunho, e que desmontar a tab o descarte, para um comportamento simples e previsível.
34. Como paciente, quero mensagens e labels em português na interface, para compreender o fluxo.
35. Como paciente, quero que o fluxo respeite tema claro/escuro e a linguagem visual neutra com azul primário, para manter consistência com o shell e o Histórico.
36. Como paciente, quero estados visíveis de loading, erro e vazio nas listagens do fluxo, alinhado aos requisitos do aplicativo no PDF.
37. Como desenvolvedor mobile, quero usar apenas endpoints verificados no backend e no Insomnia, para não inventar contrato.
38. Como desenvolvedor mobile, quero usar React Query em todas as requisições deste fluxo, para cache, loading, erro e invalidação previsíveis.
39. Como desenvolvedor mobile, quero isolar o objeto de API da feature de appointments dos hooks React Query, para seguir a arquitetura do projeto.
40. Como desenvolvedor mobile, quero reutilizar o cliente HTTP Axios com base URL via variável de ambiente, para apontar ao backend local/emulador.
41. Como desenvolvedor mobile, quero usar o paciente de demonstração fixo exigido pela API no body do POST, para criar consultas sem autenticação.
42. Como desenvolvedor mobile, quero montar `scheduled_at` em ISO 8601 com fuso do dispositivo (offset local), para cumprir a validação do backend.
43. Como desenvolvedor mobile, quero que o backend calcule `ends_at` e o status inicial `scheduled`, para o app não enviar campos que a API rejeita ou ignora por contrato.
44. Como desenvolvedor mobile, quero usar Zod apenas no domínio novo do fluxo de agendamento (schemas e `z.infer`), para tipagem e validação sem `interface` de domínio neste fluxo.
45. Como desenvolvedor mobile, quero manter as interfaces TypeScript já existentes do Histórico nesta entrega, para não misturar refatoração ampla com o novo fluxo.
46. Como desenvolvedor mobile, quero usar FlashList em todas as listas do fluxo (especialidades, profissionais, horários e demais listas), para performance alinhada ao restante do mobile.
47. Como desenvolvedor mobile, quero usar `@react-native-community/datetimepicker` em modo date e `date-fns` para datas/offsets, para implementar a janela de 30 dias e o ISO com clareza.
48. Como desenvolvedor mobile, quero manter o wizard e a porta de entrada na rota da tab Agendar, sem stack de rotas por passo, para espelhar a simplicidade do Histórico.
49. Como desenvolvedor mobile, quero aplicar as skills de architecture, code style e TypeScript guardrails, para manter o código alinhado ao repositório.
50. Como mantenedor, quero testes de comportamento observável do fluxo de agendamento, para cobrir happy path, erros de listagem, 409/erro de POST, navegação Voltar e CTAs de sucesso sem acoplar a detalhes internos.

## Implementation Decisions

- Escopo estritamente mobile; backend, migrations, seeds, Insomnia e contratos de API não mudam nesta entrega.
- Endpoints permitidos (dupla verificação backend + Insomnia):
  - `GET /api/specialties`
  - `GET /api/professionals?specialty_id={id}`
  - `POST /api/appointments` com body `patient_id`, `professional_id`, `scheduled_at` e `observations` opcional
- Não existem endpoints de slots, disponibilidade, horário de funcionamento, reagendamento ou edição de consulta.
- Resposta da API usa envelope Laravel Resource: coleção em `data[]`, item criado em `data` com HTTP 201.
- Status inicial da consulta criada é sempre `scheduled` (definido no backend). Duração fixa de 45 minutos e `ends_at` calculados no backend.
- `patient_id` fixo de demonstração: `00000000-0000-4000-8000-000000000001` (mesmo default de `DEMO_PATIENT_ID` / configuração do backend e do Histórico).
- Cliente HTTP Axios já existente; base URL via `EXPO_PUBLIC_API_URL`, com path sob `/api`. No emulador Android o host típico é `10.0.2.2`.
- Feature domain: `appointments` (mesmo domínio do Histórico).
  - Estender o API object isolado com listagem de especialidades, profissionais e criação de agendamento.
  - Hooks React Query para essas operações.
  - Schemas Zod + tipos via `z.infer` apenas para o que for novo neste fluxo de agendamento (catálogo usado no wizard, body de create, respostas parseadas desse fluxo). Não migrar as `interfaces` do Histórico nesta entrega.
  - Componentes de UI do fluxo (porta de entrada, passos do wizard, grade de horários, revisão, sucesso, empty/error/loading do agendamento) na feature, orquestrados pela rota da tab Agendar.
- Rota da tab Agendar permanece a tab existente e orquestra o estado de tela (porta de entrada vs wizard vs sucesso) e o rascunho em memória; sem stack de rotas por passo e sem componentes enormes inline além do permitido pela architecture skill.
- Estrutura de UX fechada:
  1. Porta de entrada: lista vertical de especialidades (FlashList). Toque inicia o wizard com a especialidade selecionada.
  2. Passo 1 de 3 · Profissional: cards com nome e especialidade (FlashList). Toque seleciona e avança.
  3. Passo 2 de 3 · Data e horário: date picker nativo (modo date) + grade de horários (FlashList). Toque no horário avança.
  4. Passo 3 de 3 · Revisão: resumo + observações opcionais + “Confirmar agendamento” (POST).
  5. Sucesso: mensagem “Consulta agendada com sucesso.”, resumo e CTAs “Ver no histórico” / “Agendar outra”.
- Copy PT-BR fechada:
  - Porta de entrada: “Especialidade”
  - Empty especialidades: “Nenhuma especialidade encontrada.”
  - Passo 1: “Passo 1 de 3 · Profissional”
  - Empty profissionais: “Nenhum profissional encontrado.”
  - Passo 2: “Passo 2 de 3 · Data e horário”
  - Passo 3: “Passo 3 de 3 · Revisão”
  - Botão: “Confirmar agendamento”
  - Sucesso: “Consulta agendada com sucesso.”
  - CTAs: “Ver no histórico” / “Agendar outra”
  - Observações: “Observações (opcional)”
- Indicação de progresso: texto com título do passo (“Passo X de 3 · …”) + controle Voltar na UI; sem stepper visual elaborado.
- Data e horário:
  - `@react-native-community/datetimepicker` em modo date.
  - Mínimo: hoje; máximo: hoje + 30 dias.
  - Grade local de inícios: 08:00 até 17:15 inclusive, passo de 45 minutos (duração da consulta 45 min, fim da janela comercial 18:00).
  - No dia corrente, filtrar horários cujo instante já passou.
  - `date-fns` para manipulação de datas, janela de 30 dias e montagem do instante.
  - `scheduled_at` no POST: ISO 8601 com offset do fuso do dispositivo (não forçar `America/Sao_Paulo` nem converter manualmente para `Z` no client).
  - Término estimado na revisão: início + 45 minutos (somente UI; backend continua sendo a fonte de `ends_at`).
- Observações: multilinha opcional na revisão; string vazia/whitespace não envia o campo ou envia null.
- Erros do POST: Alert/Dialog genérico com mensagem compreensível derivada da resposta da API (422, 409, rede/outros); usuário permanece na revisão e pode tentar de novo.
- Sucesso do POST:
  - Invalidar queries de appointments do Histórico.
  - Mostrar estado de sucesso na tab Agendar.
  - “Agendar outra”: limpa rascunho e volta à lista de especialidades.
  - “Ver no histórico”: troca para a tab Histórico e reseta Agendar para a lista de especialidades em background (não manter a tela de sucesso).
- Rascunho: apenas estado React em memória enquanto a tab estiver montada; sem AsyncStorage; sem reset automático em todo `useFocusEffect` ao focar a tab.
- Back do sistema (Android): espelha Voltar do wizard (revisão → data/hora → profissional → especialidades). Na porta de entrada de especialidades, comportamento padrão do app. Sem dialog de “descartar agendamento?” a cada back.
- Dependências novas permitidas neste escopo: `zod`, `date-fns`, `@react-native-community/datetimepicker`. FlashList, React Query e Axios já existem.
- UI alinhada ao shell: neutros, azul primário, espaçamentos em múltiplos de quatro, bordas/radius discretos, claro/escuro automático. Preferir componentes já adotados no mobile (Button, Text, Dialog e correlatos) quando couber; Alert/Dialog de erro de POST conforme decisão de produto.
- Validação client mínima além do Zod de payload/domínio: seleções obrigatórias implícitas pelos passos; horários passados removidos da grade; não duplicar todas as regras do Laravel no client.
- Android permanece o alvo de validação prioritária, como nas entregas anteriores.
- Skills obrigatórias em qualquer trabalho em `/mobile`: `react-native-architecture-auditor`, `react-native-code-style`, `react-native-typescript-guardrails`.

### Wizard state (decisão de fluxo)

Estados de tela da tab Agendar (conceitual):

- `specialty_list` — porta de entrada
- `wizard_professional` — passo 1
- `wizard_datetime` — passo 2
- `wizard_review` — passo 3
- `success` — pós-POST

Rascunho em memória (conceitual): `specialty`, `professional`, `date`, `time` (ou instante combinado), `observations`. Trocar de especialidade só ocorre voltando à porta de entrada e recomeçando (limpa o rascunho).

## Testing Decisions

- Testar comportamento observável pelo usuário (RNTL), não internals de FlashList, React Query, Zod, date-fns, DateTimePicker nativo ou estrutura de pastas.
- Seam principal (mais alto): composição da tab Agendar / fluxo de agendamento — mesmo nível do Histórico.
- Prior art: testes do Histórico em mobile (mock da camada de API / client HTTP, sem rede real).
- Mockar a camada de API da feature `appointments` (specialties, professionals, create) nos testes de UI.
- Cenários mínimos acordados:
  - especialidades: loading, empty, erro com retry, lista com dados
  - toque em especialidade inicia o wizard (passo profissional)
  - profissionais: loading/empty/erro/lista conforme necessário ao fluxo
  - seleção de profissional avança para data/horário
  - seleção de horário avança para revisão
  - revisão exibe resumo relevante (incluindo término estimado)
  - POST sucesso mostra tela de sucesso e invalida/reflete integração com histórico via invalidação mockável
  - POST erro (incluir 409) mostra Alert/Dialog e permanece no fluxo de revisão
  - Voltar no wizard percorre os passos até a lista de especialidades
  - “Agendar outra” volta à lista de especialidades
  - “Ver no histórico” navega para a tab Histórico e reseta Agendar para especialidades
- Não exigir E2E de device, snapshots de árvore interna, testes do backend nesta entrega, nem matriz completa de timezones.
- Lint e testes existentes do mobile devem continuar executáveis.

## Out of Scope

- Alterações no backend, migrations, seeds ou Insomnia.
- Endpoints ou UI de disponibilidade, slots do profissional, expediente, feriados ou bloqueios.
- Reagendamento, edição ou exclusão de consulta.
- Confirmar ou concluir consulta (status transitions além do create → `scheduled`).
- Autenticação, sessão ou cadastro de paciente real.
- Stack de rotas por passo do wizard ou rota dedicada fora da tab Agendar.
- Persistência de rascunho (AsyncStorage) ou offline-first.
- Migração Zod das interfaces já usadas pelo Histórico.
- Zustand ou React Hook Form para este fluxo.
- Grade de horários com intervalo diferente de 45 minutos ou janela diferente de 08:00–18:00 / último início 17:15, salvo nova decisão de produto.
- Busca textual em especialidades ou profissionais.
- Forçar timezone fixo `America/Sao_Paulo` no payload.
- Notificações push, lembretes ou calendário do sistema operacional.
- iOS/web como alvo de validação prioritária.
- Design system completo além do necessário para o fluxo.

## Further Notes

- Fonte de verdade do produto: `specs/260803-teste-dev-mobile.pdf`. Este PRD é a entrega incremental do fluxo “Agendar consulta” (seção 3.1), alinhada ao backend atual e aos PRDs `002-home-shell-tabs` e `003-appointment-history`.
- O shell permanece a base de navegação; este PRD substitui o empty-only da tab Agendar por fluxo real.
- Cancelamento e detalhe de consultas continuam no Histórico; o sucesso do agendamento apenas invalida a lista e oferece atalho de navegação.
- Desvio intencional já existente no projeto: status da API em inglês (`scheduled`, etc.) com labels PT na UI do Histórico; o create não escolhe status no client.
- Desvio de UX em relação a um calendário “strip de 30 dias”: a data é escolhida via DateTimePicker nativo; a grade de horários permanece customizada no app por ausência de API de slots.
- Issue tracker GitHub não estava disponível/configurado neste repositório no momento da redação; o artefato canônico desta entrega é o arquivo em `specs/prds-mobile/`.
- Decisões fechadas na conversa de design (grill-me), em ordem de dependência:
  1. Wizard multi-step na tab após porta de entrada de especialidade (não stack por passo; não tela única longa).
  2. Especialidade fora do contador 1–3; voltar do passo 1 retorna à lista e limpa rascunho.
  3. Data/hora: date picker + grade 45 min 08:00–18:00 (último 17:15); máx. 30 dias; hoje só futuros.
  4. Revisão com POST no mesmo passo; observações opcionais; término estimado +45 min na UI.
  5. Sucesso na tab com “Ver no histórico” (reset Agendar + troca tab) e “Agendar outra”.
  6. Rascunho só em memória; back do sistema = Voltar do wizard.
  7. Profissional em cards nome+especialidade; toque avança (profissional e horário).
  8. Erro de POST via Alert/Dialog com mensagem da API.
  9. Tech: feature `appointments`, React Query, Zod só no fluxo novo, FlashList em todas as listas, `date-fns`, DateTimePicker community.
  10. Testes no seam da tab Agendar com o conjunto B (happy path + 409 + voltar + CTAs).
