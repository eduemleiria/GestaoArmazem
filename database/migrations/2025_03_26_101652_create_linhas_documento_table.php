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
        Schema::create('linhas_documento', function (Blueprint $table) {
            $table->id();
            $table->integer('quantidade');
            $table->string('localizacao')->nullable();
            $table->foreignId('idArtigo')->references('id')->on('artigos');
            $table->foreignId('idDocumento')->references('id')->on('documentos');
            $table->foreignId('idUser')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linhas_documento');
    }
};
