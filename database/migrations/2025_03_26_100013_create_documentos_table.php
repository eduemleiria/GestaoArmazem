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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('estado');
            $table->string('tipoDoc');
            $table->dateTime('data')->nullable();
            $table->string('moradaC')->nullable();
            $table->string('moradaD')->nullable();
            $table->string('matricula')->nullable();
            $table->foreignId('idCliente')->references('id')->on('clientes');
            $table->foreignId('idUser')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
