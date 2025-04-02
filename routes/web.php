<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ArtigoController;
use App\Http\Controllers\DocumentoController;
use Inertia\Inertia;

// Rotas da página inicial (Frontend)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('servicos', function(){
    return Inertia::render('servicos');
})->name('servicos');

Route::get('precos', function(){
    return Inertia::render('precos');
})->name('precos');

Route::get('contactos', function(){
    return Inertia::render('contactos');
})->name('contactos');

Route::get('sobre-nos', function(){
    return Inertia::render('sobre-nos');
})->name('sobre-nos');

Route::middleware(['auth', 'verified'])->group(function () {
    //Rota da dashboard
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Rotas da Gestão de Users
    Route::get('gestao-users/listar', [UserController::class, 'index'])->name('gestao-users');
    Route::get('gestao-users/adicionar', function () { return Inertia::render('gestaoUsers/adicionar-user'); })->name('adicionar');
    Route::post('adicionar-user', [UserController::class, 'store'])->name('adicionar-user.store');
    Route::get('gestao-users/editar/{id}', [UserController::class, 'edit'])->name('editar.edit');
    Route::patch('gestao-users/editar/{id}', [UserController::class, 'update'])->name('editar-user.update');
    Route::delete('/remover-user/{id}', [UserController::class, 'destroy'])->name('remover-user.destroy');

    // Rotas da Gestão de Clientes
    Route::get('gestao-clientes/listar', [ClienteController::class, 'index'])->name('cliente.index');
    Route::get('gestao-clientes/adicionar', function () { return Inertia::render('gestao-clientes/adicionar-cliente'); })->name('adicionar.create');
    Route::post('adicionar-cliente', [ClienteController::class, 'store'])->name('adicionar-cliente.store');
    Route::get('gestao-clientes/editar/{id}', [ClienteController::class, 'edit'])->name('editar.edit');
    Route::patch('gestao-clientes/editar/{id}', [ClienteController::class, 'update'])->name('editar-cliente.update');
    Route::delete('/remover-cliente/{id}', [ClienteController::class, 'destroy'])->name('remover-cliente.destroy');

    // Rotas da Gestão de Artigos
    Route::get('gestao-artigos/listar', [ArtigoController::class, 'index'])->name('artigo.index');
    Route::get('gestao-artigos/adicionar', [ArtigoController::class, 'create'])->name('adicionar.create');
    Route::post('adicionar-artigo', [ArtigoController::class, 'store'])->name('adicionar-artigo.store');
    Route::get('gestao-artigos/editar/{id}', [ArtigoController::class, 'edit'])->name('editar.edit');
    Route::patch('gestao-artigos/editar/{id}', [ArtigoController::class, 'update'])->name('editar-artigo.update');
    Route::delete('/remover-artigo/{id}', [ArtigoController::class, 'destroy'])->name('remover-artigo.destroy');

    // Rotas da Gestão de documentos
    Route::get('gestao-documentos/listar', [DocumentoController::class, 'index'])->name('documento.index');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
