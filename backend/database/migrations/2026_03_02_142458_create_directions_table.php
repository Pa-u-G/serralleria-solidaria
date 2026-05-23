<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('directions', function (Blueprint $table) {
            $table->id();
            $table->string('address', 255);
            $table->string('postal_code', 255);
            $table->string('city', 255);
            $table->string('nif', 255);
            $table->string('name', 255);
            $table->string('surnames', 255)->nullable();
            $table->string('phone_number', 255);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directions');
    }
};
