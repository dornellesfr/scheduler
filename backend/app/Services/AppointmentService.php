<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Exceptions\AppointmentConflictException;
use App\Exceptions\AppointmentStateException;
use App\Models\Appointment;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class AppointmentService
{
    public const DURATION_MINUTES = 45;

    public function create(array $attributes): Appointment
    {
        $scheduledAt = CarbonImmutable::parse($attributes['scheduled_at'])->utc();
        $endsAt = $scheduledAt->addMinutes(self::DURATION_MINUTES);

        try {
            return DB::transaction(function () use ($attributes, $scheduledAt, $endsAt): Appointment {
                $hasConflict = Appointment::query()
                    ->where('status', '!=', AppointmentStatus::CANCELED->value)
                    ->where(function ($query) use ($attributes): void {
                        $query->where('professional_id', $attributes['professional_id'])
                            ->orWhere('patient_id', $attributes['patient_id']);
                    })
                    ->where('scheduled_at', '<', $endsAt)
                    ->where('ends_at', '>', $scheduledAt)
                    ->exists();

                if ($hasConflict) {
                    throw new AppointmentConflictException;
                }

                return Appointment::create([
                    'patient_id' => $attributes['patient_id'],
                    'professional_id' => $attributes['professional_id'],
                    'scheduled_at' => $scheduledAt,
                    'ends_at' => $endsAt,
                    'status' => AppointmentStatus::SCHEDULED,
                    'observations' => $attributes['observations'] ?? null,
                ]);
            });
        } catch (AppointmentConflictException $exception) {
            throw $exception;
        } catch (QueryException $exception) {
            if ($exception->getCode() === '23P01') {
                throw new AppointmentConflictException;
            }

            throw $exception;
        }
    }

    public function cancel(Appointment $appointment): Appointment
    {
        if (! in_array($appointment->status, [AppointmentStatus::SCHEDULED, AppointmentStatus::CONFIRMED], true)) {
            throw new AppointmentStateException;
        }

        $appointment->update(['status' => AppointmentStatus::CANCELED]);

        return $appointment->refresh();
    }
}
