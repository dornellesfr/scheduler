# Scheduler Backend

API REST em PHP 8.2+ com Laravel 12.

## Rotas

- `GET /api/specialties`
- `GET /api/professionals?specialty_id={uuid}`
- `GET /api/appointments?patient_id={uuid}&status={status}`
- `POST /api/appointments`
- `GET /api/appointments/{id}`
- `POST /api/appointments/{id}/cancel`
