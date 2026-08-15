# Scheduler Backend

API Laravel para o módulo de agendamento da aplicação mobile.

## Requisitos

- PHP 8.2+
- Composer
- PostgreSQL 16+ com a extensão `btree_gist`

Configure o `.env` a partir de `.env.example`. O identificador do paciente de demonstração é configurado em `DEMO_PATIENT_ID` e usa, por padrão, `00000000-0000-4000-8000-000000000001`.

Execute `php artisan migrate --seed` para criar o schema e os dados de demonstração.

## API

Todas as respostas bem-sucedidas usam o envelope `data`. Datas são retornadas em UTC no formato ISO 8601 terminado em `Z`.

- `GET /api/specialties`: lista `id` e `name`, em ordem alfabética.
- `GET /api/professionals?specialty_id={uuid}`: lista profissionais da especialidade, em ordem alfabética.
- `GET /api/appointments?patient_id={uuid}&status={status}`: lista consultas do paciente de demonstração, opcionalmente filtradas por `scheduled`, `confirmed`, `completed` ou `canceled`.
- `POST /api/appointments`: recebe `patient_id`, `professional_id`, `scheduled_at` com timezone explícito e `observations` opcional. A consulta é criada como `scheduled` e termina 45 minutos após o início.
- `GET /api/appointments/{id}`: retorna os detalhes da consulta do paciente de demonstração.
- `POST /api/appointments/{id}/cancel`: cancela consultas `scheduled` ou `confirmed` com corpo vazio.

Consultas sobrepostas para o mesmo profissional ou paciente retornam `409`. Validações retornam `422` com `errors`, recursos indisponíveis retornam `404` e falhas inesperadas retornam JSON genérico `500` sem detalhes internos. O cancelamento libera o intervalo para reutilização.

Os status técnicos permanecem em inglês (`scheduled`, `confirmed`, `completed`, `canceled`) como decisão intencional de compatibilidade com o schema existente, embora as mensagens de erro sejam em português.

Os testes de feature devem executar contra PostgreSQL, pois o schema usa `tstzrange`, `btree_gist` e constraints de exclusão.

## Estado da implementação

Os seis endpoints mínimos do módulo de agendamento estão implementados. Autenticação, cadastro de pacientes, disponibilidade e transições adicionais de status permanecem fora do escopo.
