<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentIndexRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AppointmentController extends Controller
{
    public function __construct(private readonly AppointmentService $service) {}

    public function index(AppointmentIndexRequest $request): AnonymousResourceCollection
    {
        $validated = $request->validated();

        $appointments = Appointment::query()
            ->with(['professional.specialty'])
            ->where('patient_id', $validated['patient_id'])
            ->when(isset($validated['status']), fn ($query) => $query->where('status', $validated['status']))
            ->orderByDesc('scheduled_at')
            ->get();

        return AppointmentResource::collection($appointments);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        return (new AppointmentResource($this->service->create($request->validated())->load('professional.specialty')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Appointment $appointment): AppointmentResource
    {
        abort_unless($appointment->patient_id === config('app.demo_patient_id'), 404);

        return new AppointmentResource($appointment->load('professional.specialty'));
    }

    public function destroy(Appointment $appointment): AppointmentResource
    {
        abort_unless($appointment->patient_id === config('app.demo_patient_id'), 404);

        return new AppointmentResource($this->service->cancel($appointment->load('professional.specialty')));
    }
}
