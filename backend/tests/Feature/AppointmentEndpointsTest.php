<?php

namespace Tests\Feature;

use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_specialties_are_listed_in_an_enveloped_alphabetical_collection(): void
    {
        $this->getJson('/api/specialties')
            ->assertOk()
            ->assertJsonStructure(['data' => [['id', 'name']]])
            ->assertJsonPath('data.0.name', 'Cardiologia');
    }

    public function test_professionals_require_a_specialty_filter(): void
    {
        $this->getJson('/api/professionals')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('specialty_id');
    }

    public function test_appointments_require_the_demo_patient(): void
    {
        $this->getJson('/api/appointments')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('patient_id');
    }

    public function test_valid_appointment_is_created_with_a_calculated_end(): void
    {
        $response = $this->postJson('/api/appointments', [
            'patient_id' => config('app.demo_patient_id'),
            'professional_id' => '43333333-3333-4333-8333-333333333333',
            'scheduled_at' => '2030-01-01T12:00:00-03:00',
            'observations' => 'Retorno',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'scheduled')
            ->assertJsonPath('data.scheduled_at', '2030-01-01T15:00:00.000000Z')
            ->assertJsonPath('data.ends_at', '2030-01-01T15:45:00.000000Z');
    }

    public function test_scheduled_appointment_can_be_canceled(): void
    {
        $appointment = Appointment::query()->where('status', 'scheduled')->firstOrFail();

        $this->postJson("/api/appointments/{$appointment->id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.id', $appointment->id)
            ->assertJsonPath('data.status', 'canceled');
    }
}
