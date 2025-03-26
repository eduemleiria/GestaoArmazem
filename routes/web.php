<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('gestao-users', function () {
        return Inertia::render('gestaoUsers/gestaoUsers');
    })->name('gestao-users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
