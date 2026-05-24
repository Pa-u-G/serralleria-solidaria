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
            $table->unsignedBigInteger('direction_id')->nullable();
            $table->unsignedBigInteger('facturation_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('status', 255);
            $table->boolean("install")->default(false);
            $table->decimal('total_price', 8, 2);
            $table->timestamps();
            
            
            $table->foreign('facturation_id')->references('id')->on('directions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('direction_id')->references('id')->on('directions')->onUpdate('cascade')->onDelete('cascade');
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
