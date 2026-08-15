<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('patients')->restrictOnDelete();
            $table->foreignUuid('professional_id')->constrained('professionals')->restrictOnDelete();
            $table->timestampTz('scheduled_at');
            $table->timestampTz('ends_at');
            $table->string('status')->default('scheduled');
            $table->text('observations')->nullable();
            $table->timestamps();

            $table->index('patient_id');
            $table->index('professional_id');
        });

        DB::statement('ALTER TABLE appointments ADD CONSTRAINT appointments_valid_time_range CHECK (ends_at > scheduled_at)');
        DB::statement("ALTER TABLE appointments ADD CONSTRAINT appointments_valid_status CHECK (status IN ('scheduled', 'confirmed', 'completed', 'canceled'))");

        DB::statement(<<<'SQL'
            ALTER TABLE appointments
            ADD CONSTRAINT appointments_professional_no_overlap
            EXCLUDE USING gist (
                professional_id WITH =,
                tstzrange(scheduled_at, ends_at, '[)') WITH &&
            ) WHERE (status <> 'canceled')
        SQL);

        DB::statement(<<<'SQL'
            ALTER TABLE appointments
            ADD CONSTRAINT appointments_patient_no_overlap
            EXCLUDE USING gist (
                patient_id WITH =,
                tstzrange(scheduled_at, ends_at, '[)') WITH &&
            ) WHERE (status <> 'canceled')
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
