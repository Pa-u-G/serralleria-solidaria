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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('direction_id');
            $table->foreign('direction_id')->references('id')->on('directions')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('facturation_id');
            $table->foreign('facturation_id')->references('id')->on('facturations')->onUpdate('cascade')->onDelete('cascade');
            $table->string('status', 255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
