# Scheduler

Aplicação de agendamento composta por uma API e um aplicativo mobile.

## Execução

A API e o banco de dados são executados com Docker. O aplicativo mobile é
executado localmente com o Expo Development Build.

- [Instalar Docker no Linux](https://docs.docker.com/engine/install/)
- [Instalar Docker Desktop no Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

Com o Docker instalado, configure os arquivos de ambiente e suba a API e o
banco de dados:

```sh
docker compose up --build
```

A API ficará disponível em `http://localhost:8000`.

Na inicialização, o backend instala as dependências, executa migrations e seeds.

Para parar os containers:

```sh
docker compose down
```

## Mobile

Instale o [Bun](https://bun.sh/docs/installation), o Android Studio e configure
um emulador Android ou um dispositivo físico conectado via USB.

Na pasta do aplicativo:

```sh
cd mobile
bun install
bun run dev:android
```

O comando gera, instala e abre o Expo Development Build no emulador ou
dispositivo Android.

## Variáveis de ambiente

Os arquivos `.env` não são versionados. Crie-os com as variáveis abaixo.

### Docker Compose

Arquivo `/.env`, usado pelo PostgreSQL e pelo backend:

```env
DB_PORT=5432
DB_DATABASE=scheduler
DB_USERNAME=scheduler
DB_PASSWORD=defina-uma-senha-local
```

### Backend

Arquivo `/backend/.env`:

```env
APP_NAME=Scheduler
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=scheduler
DB_USERNAME=scheduler
DB_PASSWORD=defina-uma-senha-local
SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync
DEMO_PATIENT_ID=00000000-0000-4000-8000-000000000001
```

No Docker, as variáveis `DB_*` do Compose são aplicadas ao backend. O valor de
`DB_PASSWORD` deve ser o mesmo usado no arquivo `/.env`.

### Mobile

O aplicativo precisa acessar a API pelo endereço da máquina que executa o
backend. Não use `localhost` em um dispositivo Android físico: nesse caso,
`localhost` aponta para o próprio celular.

Para descobrir o IP da máquina no Linux:

```sh
ip -4 addr show
```

Escolha o endereço da interface que está na mesma rede do dispositivo. Por
exemplo, se o IP da máquina for `192.168.1.6`, crie o arquivo `/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.6:8000/api
```

Use estas URLs conforme o ambiente:

- Emulador Android: `http://10.0.2.2:8000/api`
- Simulador iOS ou navegador: `http://localhost:8000/api`
- Dispositivo Android físico: `http://IP_DA_MAQUINA:8000/api`

O dispositivo físico e a máquina precisam estar na mesma rede. Verifique a
conectividade com:

```sh
curl http://IP_DA_MAQUINA:8000/api/specialties
```

Depois de alterar o `.env`, reinicie o Expo e recompile o Development Build:

```sh
cd mobile
bun run dev:android
```

O Android está configurado para permitir HTTP no ambiente local. Em produção,
prefira expor a API por HTTPS.

## Stack

### Backend

- PHP 8.2+
- Laravel 12
- PostgreSQL 16

### Mobile

- Bun
- React Native 0.86.0
- Expo SDK 57.0.12
- Expo Router
- TypeScript
- Uniwind e Tailwind CSS
- Axios e TanStack React Query
- Zod
- `@react-native-community/datetimepicker` e `date-fns`
- Async Storage
- Lucide React Native e FlashList
- Jest e React Native Testing Library

## Decisões técnicas

- Axios realiza as chamadas para a API e React Query gerencia cache, loading,
  retry e invalidação das consultas.
- Zod valida os dados do fluxo de agendamento e gera os tipos derivados.
- O calendário usa o `@react-native-community/datetimepicker`; `date-fns` é
  usado para manipulação e formatação das datas.
