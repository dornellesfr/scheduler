<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professionals', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('specialty_id')->constrained('specialties')->restrictOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->index('specialty_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professionals');
    }
};
