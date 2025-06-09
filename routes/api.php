<?php

use App\Http\Controllers\API\ApiDocumentoController;
use App\Http\Controllers\API\ApiLinhaDocumentoController;
use App\Http\Controllers\API\ApiLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/* Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
 */

Route::apiResource('login', ApiLoginController::class);
Route::apiResource('gestao-documentos', ApiDocumentoController::class);
Route::apiResource('gestao-linha-documento', ApiLinhaDocumentoController::class);
Route::get('gestao-linha-documento/por-entrar', [ApiLinhaDocumentoController::class, 'porEntrar']);