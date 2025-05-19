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
        Schema::create('paletes', function (Blueprint $table) {
            $table->id();
            $table->integer('quantidade');
            $table->string('localizacao');
            $table->dateTime('dataEntrada');
            $table->dateTime('dataSaida')->nullable();
            $table->foreignId('idArtigo')->references('id')->on('artigos');
            $table->foreignId('idLinhasDE')->references('id')->on('linhas_documento');
            $table->foreignId('idUser')->references('id')->on('users');
            $table->foreignId('idLinhaFatura')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paletes');
    }
};
