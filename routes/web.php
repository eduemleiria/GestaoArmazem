<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClienteController;
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
    Route::get('dashboard', function () { return Inertia::render('dashboard'); })->name('dashboard');

    // Rotas da Gestão de Users
    Route::get('gestao-users/listar', [UserController::class, 'index'])->name('gestao-users');
    Route::get('gestao-users/adicionar', function () { return Inertia::render('gestaoUsers/adicionar-user'); })->name('adicionar');
    Route::post('adicionar-user', [UserController::class, 'store'])->name('adicionar-user.store');
    Route::get('gestao-users/editar/{id}', [UserController::class, 'edit'])->name('editar.edit');
    Route::patch('gestao-users/editar/{id}', [UserController::class, 'update'])->name('editar-user.update');
    Route::delete('/remover-user/{id}', [UserController::class, 'destroy'])->name('remover-user.destroy');

    // Rotas da Gestão de Clientes
    Route::get('gestao-clientes/listar', [ClienteController::class, 'index'])->name('index');
    Route::get('gestao-clientes/adicionar', function () { return Inertia::render('gestao-clientes/adicionar-cliente'); })->name('adicionar');
    Route::post('adicionar-cliente', [ClienteController::class, 'store'])->name('adicionar-cliente.store');
    Route::get('gestao-clientes/editar/{id}', [ClienteController::class, 'edit'])->name('editar.edit');
    Route::patch('gestao-clientes/editar/{id}', [ClienteController::class, 'update'])->name('editar-cliente.update');
    Route::delete('/remover-cliente/{id}', [ClienteController::class, 'destroy'])->name('remover-cliente.destroy');

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
