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
        Schema::create('linhas_fatura', function (Blueprint $table) {
            $table->id();
            $table->float('subtotal');
            $table->integer('dias');
            $table->foreignId('idPalete')->references('id')->on('paletes');
            $table->foreignId('idFatura')->references('id')->on('faturas');
            $table->foreignId('idUser')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linhas_fatura');
    }
};
