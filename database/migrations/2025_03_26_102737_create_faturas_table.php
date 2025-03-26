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
        Schema::create('faturas', function (Blueprint $table) {
            $table->id();
            $table->float('total');
            $table->dateTime('dataEmissao');
            $table->dateTime('dataInicio');
            $table->dateTime('dataFim');
            $table->foreignId('idCliente')->references('id')->on('clientes');
            $table->foreignId('idUser')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faturas');
    }
};
