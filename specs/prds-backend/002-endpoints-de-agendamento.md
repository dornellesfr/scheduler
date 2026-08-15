## Problem Statement

O backend já possui o modelo de dados e os dados de demonstração para especialidades, profissionais, paciente e consultas, mas ainda não oferece a API REST necessária para o aplicativo mobile. Sem esses endpoints, o paciente não consegue consultar opções de agendamento, criar uma consulta, visualizar seu histórico ou cancelar uma consulta permitida.

A API precisa expor somente o contrato mínimo definido pelo documento fonte da verdade, validar todas as entradas no backend, aplicar as regras de negócio fora da camada HTTP e retornar respostas JSON previsíveis. Falhas previstas não podem ser escondidas em respostas HTML, mensagens genéricas ou exceções de banco expostas ao cliente.

## Solution

Implementar os seis endpoints REST mínimos para o módulo de agendamento, usando controllers finos, Form Requests para validação, Services para regras de negócio, Models Eloquent para persistência e API Resources para serialização.

O fluxo permitirá que o aplicativo liste especialidades e profissionais, consulte o histórico do paciente de demonstração, crie agendamentos futuros com duração fixa de 45 minutos, consulte detalhes e cancele consultas nos status permitidos. A API usará PostgreSQL como banco de execução e os testes de feature validarão o comportamento observável por HTTP, incluindo conflitos de agenda e erros previstos.

## User Stories

1. As a demonstration patient, I want to list available specialties, so that I can choose the medical area for my appointment.
2. As a demonstration patient, I want to list professionals for a selected specialty, so that I can choose a professional who belongs to that specialty.
3. As a demonstration patient, I want to see my appointments, so that I can consult my attendance history.
4. As a demonstration patient, I want to filter my appointments by status, so that I can find scheduled, confirmed, completed or canceled consultations.
5. As a demonstration patient, I want an empty result to be represented as a successful empty list, so that the mobile application can show an appropriate empty state.
6. As a demonstration patient, I want to create an appointment with a professional, date and time, so that I can schedule a consultation.
7. As a demonstration patient, I want the API to associate every new appointment with the demonstration patient, so that appointments cannot be created for an unauthorized patient.
8. As a demonstration patient, I want the API to reject an unknown professional, so that an appointment cannot reference invalid data.
9. As a demonstration patient, I want the API to reject an appointment in the past, so that I cannot schedule an invalid consultation.
10. As a demonstration patient, I want the API to reject a professional already booked at that time, so that I do not create a conflicting appointment.
11. As a demonstration patient, I want the API to reject an overlapping appointment for me, so that I cannot have two consultations at the same time.
12. As a demonstration patient, I want adjacent appointment intervals to be allowed, so that one consultation ending when another starts is not treated as an overlap.
13. As a demonstration patient, I want every new appointment to start with status `scheduled`, so that the initial lifecycle state is predictable.
14. As a demonstration patient, I want the backend to calculate the appointment end time, so that clients cannot create inconsistent durations.
15. As a demonstration patient, I want to include optional observations, so that relevant notes can be stored with the appointment.
16. As a demonstration patient, I want to view appointment details, so that I can review the professional, specialty, date, time, status and observations.
17. As a demonstration patient, I want appointment details to include professional and specialty information, so that the mobile application does not need extra requests to display the consultation context.
18. As a demonstration patient, I want to cancel a scheduled appointment, so that I can release a consultation I will not attend.
19. As a demonstration patient, I want to cancel a confirmed appointment, so that the cancellation behavior follows the supported business rule.
20. As a demonstration patient, I want completed and canceled appointments to reject cancellation, so that the appointment lifecycle cannot be changed through an invalid operation.
21. As a demonstration patient, I want canceled appointment time ranges to become available again, so that a released professional and patient interval can be reused.
22. As a mobile client, I want all successful responses to use a consistent `data` envelope, so that response parsing is predictable.
23. As a mobile client, I want validation errors to identify invalid fields, so that I can show understandable messages to the user.
24. As a mobile client, I want business conflicts to use HTTP `409`, so that I can distinguish a valid request blocked by current schedule state from malformed input.
25. As a mobile client, I want missing resources to use HTTP `404`, so that unavailable appointments and relationships can be handled explicitly.
26. As a mobile client, I want unexpected failures to return a generic JSON response, so that internal details are not exposed to users.
27. As a developer, I want status values centralized in a typed enum, so that requests, persistence and responses cannot drift into unsupported values.
28. As a developer, I want the demonstration patient identifier configurable through environment configuration, so that the identifier is not duplicated throughout business logic.
29. As a developer, I want API behavior tested through HTTP feature tests, so that the public contract is verified instead of implementation details.
30. As a developer, I want API tests to run against PostgreSQL, so that PostgreSQL-specific overlap constraints are tested in the same database technology used by the application.

## Implementation Decisions

- Implement exactly these six routes from the minimum API contract, with no additional routes: list specialties, list professionals filtered by specialty, list appointments filtered by demonstration patient and optionally status, create appointment, show appointment details, and cancel appointment.
- Organize the backend as routes, controllers, Form Requests, Services, Eloquent Models and API Resources. Controllers handle HTTP transport only; Services contain appointment creation and cancellation rules; Models contain persistence mappings and relationships; Resources define public JSON representations.
- Do not introduce Repository, DTO or separate UseCase layers for this scope. The approved Service layer is sufficient to isolate business rules without adding indirection that is not required by the six endpoints.
- Add strict PHP typing to new backend code, including `declare(strict_types=1)`, typed method signatures, typed Service inputs and outputs, and explicit Eloquent casts.
- Use the status values `scheduled`, `confirmed`, `completed` and `canceled` in requests, filters, database values and responses. This is an intentional documented deviation from the Portuguese status labels in the PDF, preserving the English values already adopted by the database PRD.
- Centralize appointment statuses in a string-backed `AppointmentStatus` enum and use the enum for model casting and business-rule checks.
- Configure the demonstration patient through `DEMO_PATIENT_ID`, using the existing fixed UUID as the documented default. The POST body must include `patient_id`, and the backend must validate that it is a valid UUID, exists and matches the configured demonstration patient.
- The appointment creation body contains only `patient_id`, `professional_id`, `scheduled_at` and optional `observations`. Clients cannot submit `status` or `ends_at`.
- Validate `patient_id` and `professional_id` as UUIDs and existing records. Validate `scheduled_at` as strict ISO 8601 with an explicit timezone, rejecting ambiguous values without a timezone. Validate that its instant is in the future.
- Accept `observations` as nullable text. Reject arrays, objects and other non-string values. Preserve the database PRD decision that this is unrestricted text rather than adding an artificial application length limit.
- Calculate `ends_at` in the backend using the fixed 45-minute appointment duration represented by a named constant. Persist the resulting interval with timezone-aware timestamps.
- Compare requested times as absolute instants in UTC. Serialize `scheduled_at` and `ends_at` in successful responses as ISO 8601 UTC values ending in `Z`; the mobile application is responsible for local display conversion.
- Set every newly created appointment to `scheduled` regardless of client input.
- Use a transaction for appointment creation. Perform clear pre-checks where useful, while relying on PostgreSQL exclusion constraints as the final protection against concurrent overlaps.
- Treat overlap conflicts for the same active professional or patient as HTTP `409 Conflict`. Canceled appointments do not block reuse. Half-open intervals allow adjacent appointments, such as `14:00–14:45` followed by `14:45–15:30`.
- Keep the patient-overlap rule from the database PRD as an intentional domain clarification beyond the minimum PDF rule. A patient cannot have overlapping appointments, including appointments from different specialties, but may have appointments at different times.
- Require `specialty_id` for the professionals list. Return UUID/type validation or invalid filter input as HTTP `422`; a valid specialty with no professionals returns HTTP `200` and an empty list.
- Require `patient_id` for the appointments list and restrict it to the configured demonstration patient. Accept an optional exact, lowercase `status` filter from the four enum values. Invalid status or patient input returns HTTP `422`.
- Return appointment lists ordered by `scheduled_at` descending. Return specialties and professionals ordered by `name` ascending.
- Return only `id` and `name` for specialties. Return `id`, `name` and `specialty_id` for professionals.
- Return appointments with `id`, `patient_id`, nested professional data, nested specialty data, `scheduled_at`, `ends_at`, `status` and `observations`. Nested relationships avoid extra mobile requests while remaining within the existing API contract.
- Use `{ "data": [...] }` for collections and `{ "data": { ... } }` for a single resource. Return HTTP `200` for reads and successful cancellation, and HTTP `201` for creation.
- Use Portuguese messages for user-facing error text while retaining English technical field names and status values. Validation errors use HTTP `422` and an `errors` object; missing resources use HTTP `404`; invalid cancellation state uses HTTP `422`; schedule conflicts use HTTP `409`.
- Configure API exception handling so expected failures always return JSON. Do not expose SQL, stack traces or internal exception details to clients; unexpected failures are logged and returned as a generic HTTP `500` response.
- Details and cancellation operate only on appointments belonging to the demonstration patient. An appointment outside that scope is treated as unavailable and returns HTTP `404`.
- Cancellation accepts an empty body, requires a valid appointment UUID, and changes only `scheduled` or `confirmed` appointments to `canceled`. The response contains the updated appointment resource.
- Use PostgreSQL for the API runtime and for feature tests. The current SQLite test configuration must be replaced or aligned because the schema relies on `btree_gist`, `tstzrange` and PostgreSQL exclusion constraints.
- Implement in stages: API routing/configuration/exception handling; read endpoints; creation validation and Service; details and cancellation; HTTP feature tests; README contract and technical decisions.

## Testing Decisions

- Test externally observable HTTP behavior at the feature-test seam. Tests should assert status codes, JSON structure, returned values and persisted business outcomes, not controller method calls, private Service implementation details or framework internals.
- Use PostgreSQL for the test database so professional and patient overlap behavior, canceled interval reuse and the existing exclusion constraints are tested faithfully.
- Test specialties listing returns `200`, the `data` envelope, only the public fields and alphabetical ordering.
- Test professionals listing requires `specialty_id`, filters by specialty, returns the agreed fields and alphabetical ordering, rejects malformed or unknown specialty identifiers, and returns an empty collection for a valid specialty without professionals.
- Test appointments listing requires the demonstration `patient_id`, returns nested professional and specialty data, orders by newest `scheduled_at` first, supports each valid status filter, rejects invalid status values and returns an empty collection when no appointment matches.
- Test appointment creation succeeds with valid UUIDs, strict timezone-aware ISO 8601 input and optional observations; persists `scheduled` status; calculates a 45-minute end; and returns HTTP `201` with UTC timestamps.
- Test creation rejects malformed or missing fields, wrong JSON types, a non-demonstration patient, an unknown professional, a past instant, and a datetime without timezone using HTTP `422` and field-level errors where applicable.
- Test creation returns `409` when the professional overlaps an active appointment and when the patient overlaps an active appointment. Test adjacent intervals are accepted and canceled appointments do not block reuse.
- Test appointment details return the nested resource for an available demonstration-patient appointment and return `404` for an invalid, missing or non-demonstration appointment.
- Test cancellation accepts an empty body, changes `scheduled` and `confirmed` appointments to `canceled`, returns the updated resource, and returns `404` or `422` for unavailable or non-cancelable appointments according to the public contract.
- Test all expected API failures return JSON rather than HTML and do not expose SQL or stack trace details.
- Existing repository prior art consists of database migration/seeder integration decisions rather than API feature tests; therefore the new HTTP feature tests establish the highest available seam for this feature while complementing the existing database integration coverage.

## Out of Scope

- Patient registration, user registration and authentication.
- Additional patient lookup or patient-management endpoints.
- Appointment confirmation, completion or status-transition endpoints.
- Appointment update, rescheduling or deletion endpoints.
- Availability, working hours, holidays, blocked periods or appointment slots.
- Variable appointment duration, appointment types, recurring appointments or scheduling history.
- Pagination, sorting query parameters or advanced search beyond the defined status filter.
- Global sophisticated error-envelope infrastructure beyond the agreed clear JSON responses.
- Repository, DTO or separate UseCase abstractions without a concrete need.
- Changes to the mobile application implementation, navigation or visual presentation.

## Further Notes

- The source of truth is the mobile developer test PDF. The use of English status values is an intentional deviation already adopted in the database PRD and must be documented in the README.
- The existing database PRD already defines UUID entities, relationships, PostgreSQL overlap constraints, seeded demonstration data and the fixed patient UUID. This PRD consumes those decisions rather than redefining the schema.
- The seeded data contains multiple statuses and should remain usable through the status filter and detail/cancellation flows. The API must not add routes solely to manage seeded state.
- The public README must document prerequisites, environment configuration, the demonstration patient identifier, endpoint contracts, status vocabulary, error behavior, PostgreSQL test requirement and the implementation status.
