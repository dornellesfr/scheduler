<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Professional;
use App\Models\Specialty;
use Carbon\CarbonImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $specialties = [
            '11111111-1111-4111-8111-111111111111' => 'Cardiologia',
            '22222222-2222-4222-8222-222222222222' => 'Dermatologia',
            '33333333-3333-4333-8333-333333333333' => 'Pediatria',
        ];

        foreach ($specialties as $id => $name) {
            Specialty::updateOrCreate(['id' => $id], ['name' => $name]);
        }

        $professionals = [
            ['id' => '41111111-1111-4111-8111-111111111111', 'specialty_id' => array_key_first($specialties), 'name' => 'Dra. Ana Martins'],
            ['id' => '42222222-2222-4222-8222-222222222222', 'specialty_id' => array_key_first(array_slice($specialties, 0, 1, true)), 'name' => 'Dr. Bruno Costa'],
            ['id' => '43333333-3333-4333-8333-333333333333', 'specialty_id' => array_key_first(array_slice($specialties, 1, 1, true)), 'name' => 'Dra. Carla Mendes'],
            ['id' => '44444444-4444-4444-8444-444444444444', 'specialty_id' => array_key_first(array_slice($specialties, 1, 1, true)), 'name' => 'Dr. Diego Lima'],
            ['id' => '45555555-5555-4555-8555-555555555555', 'specialty_id' => array_key_first(array_slice($specialties, 2, 1, true)), 'name' => 'Dra. Elisa Rocha'],
            ['id' => '46666666-6666-4666-8666-666666666666', 'specialty_id' => array_key_first(array_slice($specialties, 2, 1, true)), 'name' => 'Dr. Fabio Alves'],
        ];

        foreach ($professionals as $professional) {
            Professional::updateOrCreate(['id' => $professional['id']], $professional);
        }

        $patientId = '00000000-0000-4000-8000-000000000001';
        Patient::updateOrCreate(['id' => $patientId], ['name' => 'Paciente Demonstração']);

        $future = CarbonImmutable::now()->addDays(2)->startOfHour();
        $past = CarbonImmutable::now()->subDays(2)->startOfHour();
        $appointments = [
            ['id' => '51111111-1111-4111-8111-111111111111', 'professional_id' => $professionals[0]['id'], 'scheduled_at' => $future->setTime(8, 0), 'status' => 'scheduled'],
            ['id' => '52222222-2222-4222-8222-222222222222', 'professional_id' => $professionals[1]['id'], 'scheduled_at' => $future->setTime(9, 0), 'status' => 'scheduled'],
            ['id' => '53333333-3333-4333-8333-333333333333', 'professional_id' => $professionals[2]['id'], 'scheduled_at' => $future->setTime(10, 0), 'status' => 'confirmed'],
            ['id' => '54444444-4444-4444-8444-444444444444', 'professional_id' => $professionals[3]['id'], 'scheduled_at' => $future->setTime(11, 0), 'status' => 'confirmed'],
            ['id' => '55555555-5555-4555-8555-555555555555', 'professional_id' => $professionals[4]['id'], 'scheduled_at' => $past->setTime(8, 0), 'status' => 'completed'],
            ['id' => '56666666-6666-4666-8666-666666666666', 'professional_id' => $professionals[5]['id'], 'scheduled_at' => $past->setTime(9, 0), 'status' => 'completed'],
            ['id' => '57777777-7777-4777-8777-777777777777', 'professional_id' => $professionals[0]['id'], 'scheduled_at' => $past->setTime(10, 0), 'status' => 'canceled'],
            ['id' => '58888888-8888-4888-8888-888888888888', 'professional_id' => $professionals[1]['id'], 'scheduled_at' => $past->setTime(11, 0), 'status' => 'canceled'],
        ];

        foreach ($appointments as $appointment) {
            Appointment::updateOrCreate(
                ['id' => $appointment['id']],
                [...$appointment, 'patient_id' => $patientId, 'ends_at' => $appointment['scheduled_at']->addMinutes(45)],
            );
        }
    }
}
