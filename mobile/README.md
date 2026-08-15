# Scheduler Mobile

Aplicativo React Native com Expo Router, TypeScript, Uniwind e React Query.

## Requisitos

- Bun.
- Android Studio, Android SDK e um emulador Android para o alvo principal.
- Backend disponível em `http://localhost:8000`.

O setup completo do Docker, da API e da execução simultânea está no
[README da raiz](../README.md).

## Configuração

```sh
bun install
cp .env.example .env
```

O emulador Android usa `http://10.0.2.2:8000/api` por padrão. Para um
simulador iOS ou navegador, use `http://localhost:8000/api`. Para um dispositivo
físico, use `http://IP_DO_COMPUTADOR:8000/api` e mantenha os dispositivos na
mesma rede.

## Executar no Android

Com a API rodando em outro terminal:

```sh
bun run android
```

O suporte a iOS e web permanece disponível pela configuração do Expo, mas o
Android é o alvo de validação desta entrega.

## Qualidade

```sh
bun run lint
bun run format:check
bun test
```

Para formatar os arquivos:

```sh
bun run format
```

## Funcionalidades

- Histórico real do paciente de demonstração via API.
- Filtro por status, estados de carregamento, erro e lista vazia.
- Detalhes da consulta em diálogo.
- Cancelamento de consultas `scheduled` e `confirmed` com confirmação e
  atualização da lista.
- Fluxo de agendamento com seleção de especialidade, profissional, data,
  horário, revisão e confirmação.

O paciente de demonstração usa o ID
`00000000-0000-4000-8000-000000000001`. Não há autenticação, cadastro ou dados
fictícios de consultas.
