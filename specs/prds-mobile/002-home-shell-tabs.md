# PRD: Mobile Home Shell With Tabs

## Problem Statement

O aplicativo mobile já possui a base Expo Router, mas sua rota inicial ainda exibe apenas uma mensagem de inicialização. O usuário precisa de uma entrada real no produto: depois do splash nativo, o aplicativo deve abrir uma home organizada em tabs para acessar o histórico de consultas e o agendamento de uma nova consulta.

Esta primeira entrega não deve antecipar a integração com a API nem implementar os fluxos completos de negócio. Ela precisa estabelecer somente a navegação, a linguagem visual mínima e os estados vazios que servirão de base para as próximas entregas.

## Solution

Criar o shell inicial do aplicativo mobile com o splash nativo automático do Expo e um grupo de tabs do Expo Router. A home terá duas tabs nativas: “Histórico”, aberta por padrão, e “Agendar”. Cada tab terá seu título, ícone Lucide e um estado vazio contextual, sem dados fictícios, botões ou chamadas de rede.

O root da navegação redirecionará para o Histórico assim que o JavaScript do aplicativo carregar. O splash não será uma rota nem um componente JavaScript separado. A configuração nativa terá apenas fundos neutros para os temas claro e escuro, sem logo ou asset customizado.

As regras obrigatórias para o desenvolvimento do `/mobile` e o padrão visual mínimo serão documentados no `AGENTS.md` da raiz. A documentação do mobile também será atualizada para refletir que o shell existe, mas os fluxos e a API continuam pendentes.

## User Stories

1. Como paciente, quero que o aplicativo exiba o splash nativo enquanto carrega, para que eu não veja uma tela JavaScript intermediária durante a inicialização.
2. Como paciente, quero chegar automaticamente à home após o carregamento, para começar a usar o aplicativo sem uma ação extra.
3. Como paciente, quero que a home seja organizada em tabs, para alternar entre as principais áreas do aplicativo de forma previsível.
4. Como paciente, quero acessar uma tab de histórico de consultas, para encontrar a área onde minhas consultas serão exibidas.
5. Como paciente, quero acessar uma tab para agendar nova consulta, para encontrar a ação principal de agendamento no local esperado.
6. Como paciente, quero que o Histórico seja a tab inicial, para ter uma visão imediata da área de consultas ao abrir o aplicativo.
7. Como paciente, quero ver o rótulo “Histórico” na barra inferior, para identificar a tab sem depender apenas do ícone.
8. Como paciente, quero ver o rótulo “Agendar” na barra inferior, para identificar a ação de iniciar um agendamento.
9. Como paciente, quero ver um ícone de histórico na tab de Histórico, para reconhecer visualmente a área.
10. Como paciente, quero ver um ícone de calendário com adição na tab de Agendar, para reconhecer visualmente a criação de uma consulta.
11. Como paciente, quero que a tab selecionada seja destacada em azul, para saber qual área está ativa.
12. Como paciente, quero que o Histórico tenha o título “Histórico de consultas”, para entender o conteúdo esperado da área.
13. Como paciente, quero ver “Nenhuma consulta encontrada.” quando não houver dados, para distinguir um estado vazio de uma falha de carregamento.
14. Como paciente, quero que o estado vazio do Histórico seja visualmente centralizado, para perceber claramente que ainda não há conteúdo.
15. Como paciente, quero que a tab de agendamento tenha o título “Agendar nova consulta”, para entender a finalidade da área.
16. Como paciente, quero ver a mensagem “O agendamento de consultas estará disponível em breve.” antes da implementação do fluxo, para saber que a área existe e ainda está pendente.
17. Como paciente, quero que a mensagem de agendamento não apresente botões falsos, para não iniciar uma operação que ainda não existe.
18. Como paciente, quero que o aplicativo não apresente consultas fictícias, para não confundir conteúdo de demonstração com dados reais.
19. Como paciente, quero que a home respeite os temas claro e escuro do dispositivo, para manter a leitura confortável em diferentes configurações.
20. Como paciente, quero que fundos, superfícies e textos usem cores neutras, para manter uma interface legível e consistente.
21. Como paciente, quero que ações e seleções usem azul como cor primária, para reconhecer a interação principal do aplicativo.
22. Como paciente, quero que títulos, textos e espaçamentos sigam uma hierarquia consistente, para compreender a interface rapidamente.
23. Como paciente, quero que bordas e arredondamentos sejam discretos, para manter uma aparência simples sem excesso de elementos decorativos.
24. Como paciente, quero que os ícones sigam uma mesma biblioteca visual, para evitar inconsistência entre as tabs.
25. Como desenvolvedor mobile, quero usar o Tab navigator do Expo Router, para manter a navegação baseada em arquivos e o comportamento padrão da plataforma.
26. Como desenvolvedor mobile, quero manter as rotas das tabs separadas do redirect inicial, para que o root permaneça simples e a navegação seja fácil de expandir.
27. Como desenvolvedor mobile, quero preservar o `QueryClientProvider` existente sem usá-lo nas tabs, para não remover infraestrutura preparada para etapas futuras.
28. Como desenvolvedor mobile, quero não criar hooks, stores, mocks ou serviços de API nesta entrega, para manter o shell limitado ao escopo aprovado.
29. Como desenvolvedor mobile, quero usar TypeScript nas novas rotas, para seguir a linguagem do código existente e os guardrails definidos para o mobile.
30. Como desenvolvedor mobile, quero que qualquer alteração futura em `/mobile` carregue as skills de arquitetura, estilo e TypeScript, para manter as decisões técnicas consistentes.
31. Como desenvolvedor mobile, quero que o Android seja o alvo de validação desta entrega, para concentrar o esforço no ambiente de desenvolvimento atual.
32. Como desenvolvedor mobile, quero preservar a configuração existente de iOS e web, para não fazer alterações destrutivas fora do escopo Android.
33. Como mantenedor, quero um smoke test mínimo para o conteúdo visível do shell, para detectar regressões básicas sem criar uma suíte exagerada.
34. Como mantenedor, quero que a documentação do mobile descreva o shell atual e suas pendências, para que a execução e o estado do projeto não fiquem ambíguos.

## Implementation Decisions

- Usar o splash nativo automático do Expo, sem criar rota, componente JavaScript, animação, atraso artificial, logo ou asset novo.
- Configurar apenas cores neutras de fundo para os temas claro e escuro no app config, mantendo o splash visualmente simples.
- Usar um grupo de navegação de tabs do Expo Router com duas rotas: histórico e novo agendamento.
- Manter a rota inicial responsável somente pelo redirecionamento para o Histórico.
- Abrir o Histórico por padrão após o carregamento.
- Usar o Tab navigator padrão do Expo Router, sem tab bar customizada.
- Exibir “Histórico” e “Agendar” como rótulos da barra inferior, com os títulos completos nas respectivas telas.
- Usar os ícones Lucide `History` e `CalendarPlus` nas tabs e nos estados vazios correspondentes.
- Usar azul como cor de seleção/ação e neutros para fundos, superfícies e textos.
- Usar espaçamentos em múltiplos de quatro, hierarquia clara de títulos, bordas e arredondamentos discretos e estados vazios visualmente centralizados.
- Respeitar o modo claro/escuro automático já configurado no aplicativo.
- Mostrar somente os estados vazios definidos: “Nenhuma consulta encontrada.” e “O agendamento de consultas estará disponível em breve.”
- Não adicionar dados fictícios, botões, formulários, filtros, detalhes, cancelamento ou qualquer fluxo de negócio.
- Manter `QueryClientProvider`, cliente Axios e variáveis de ambiente existentes, mas não realizar chamadas de API nem criar hooks de integração.
- Atualizar o `AGENTS.md` da raiz para registrar que `/mobile` usa TypeScript e que as skills `react-native-architecture-auditor`, `react-native-code-style` e `react-native-typescript-guardrails` são obrigatórias em qualquer trabalho no diretório.
- Registrar no `AGENTS.md` o padrão visual mínimo do mobile, sem criar tokens, biblioteca de componentes ou design system neste momento.
- Atualizar somente o trecho necessário do `mobile/README.md` para descrever o shell, o splash nativo e as pendências.
- Manter o suporte/configuração de iOS e web intacto, mas validar a execução desta entrega somente no Android.
- Não adicionar dependências novas para a implementação do shell.

## Testing Decisions

- Testes devem verificar comportamento observável pelo usuário, como a presença dos títulos e mensagens dos estados vazios, e não detalhes internos do navigator ou da configuração do provider.
- Ajustar o smoke test existente para validar o conteúdo inicial relevante do Histórico usando React Native Testing Library.
- Não adicionar snapshots, testes de implementação, mocks de API, testes de filtros, testes de agendamento ou cobertura de navegação além do necessário para o smoke test mínimo.
- A troca de tabs deve ser validada manualmente no emulador Android nesta entrega; testes automatizados de navegação ficam para quando houver comportamento real nas tabs.
- Verificar que o lint, a formatação e o teste existente continuam executáveis com a nova estrutura de rotas.
- Verificar visualmente no Android o redirect inicial, os dois rótulos da tab bar, os ícones, a tab Histórico selecionada e os estados vazios.

## Out of Scope

- Integração com API, Axios em execução, React Query em execução ou qualquer chamada de rede.
- Autenticação, cadastro, sessão e persistência.
- Fluxo de agendamento, seleção de especialidade, profissional, data, horário, revisão e confirmação.
- Histórico real, filtro por status, atualização manual, detalhes e cancelamento de consultas.
- Dados mockados ou consultas fictícias.
- Botões, formulários, validações, loading states ou error states de negócio.
- Telas dedicadas de detalhes, confirmação ou etapas do agendamento.
- Stores Zustand, hooks de domínio, serviços, modelos ou interfaces de API.
- Design system completo, tokens de design, biblioteca de componentes, assets de marca ou splash customizado.
- Tab bar customizada ou navegação alternativa ao Expo Router.
- Remoção do suporte existente para iOS e web.
- Validação específica de iOS e web nesta etapa.
- Alterações no backend, banco de dados, Docker ou contratos de API.
- Suíte extensa de testes, snapshots e testes unitários de detalhes de implementação.

## Further Notes

- O PDF do teste descreve o produto completo, incluindo agendamento, histórico e cancelamento. Este PRD representa apenas a primeira entrega incremental do shell visual e de navegação.
- O PDF menciona JavaScript, mas o código atual do mobile já está em TypeScript e o usuário determinou o uso das skills de TypeScript. Essa é uma decisão intencional para esta implementação.
- “Não fazer telas dedicadas” significa não criar telas adicionais para detalhes ou etapas de negócio nesta fase; as duas tabs necessárias continuam sendo rotas próprias do navigator.
- O splash nativo deve desaparecer conforme o app carrega normalmente. Não existe bootstrap assíncrono nesta entrega que justifique controle manual do splash.
- A atualização do `AGENTS.md` deve usar referências relativas às skills dentro do repositório, evitando caminhos absolutos específicos da máquina.
- A implementação futura deve começar por este PRD e só então alterar o `/mobile`.
