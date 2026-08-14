<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialties', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        DB::statement('CREATE UNIQUE INDEX specialties_name_lower_unique ON specialties (LOWER(name))');
    }

    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};
