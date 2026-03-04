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
        Schema::create('facturations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('type', 255);
            $table->string('nif', 255)->nullable();
            $table->string('cif', 255)->nullable();
            $table->string('street', 255);
            $table->string('street_number', 255);
            $table->string('postal_code', 255);
            $table->string('city', 255);
            $table->string('province', 255);
            $table->string('name', 255);
            $table->string('surnames', 255);
            $table->string('phone_number', 255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturations');
    }
};
