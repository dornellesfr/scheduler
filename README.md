# Scheduler

## Editar pelo VS Code

Abra a pasta do projeto que está no computador, e não uma pasta interna do
container:

```sh
code /home/fernando/Documents/_pessoal/scheduler
```

No VS Code, a árvore do projeto deve mostrar `backend`, `mobile` e
`docker-compose.yml`. Não use `Attach to Running Container` nem `Reopen in
Container` para editar este projeto.

O Docker apenas executa os serviços. Os volumes do `docker-compose.yml`
mantêm os arquivos sincronizados:

- `./backend` -> `/var/www/html`
- `./mobile` -> `/app`

Portanto, edite normalmente os arquivos em `backend/` e `mobile/` pelo VS
Code. As alterações aparecem no container automaticamente.

## Executar

Na raiz do projeto:

```sh
docker compose up --build
```

Para parar os serviços:

```sh
docker compose down
```

## Paciente de demonstração

O backend usa o paciente fixo `00000000-0000-4000-8000-000000000001`, criado pelo
seeder junto com especialidades, profissionais e consultas de demonstração.
