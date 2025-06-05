<?php

use App\Http\Controllers\API\ApiDocumentoController;
use App\Http\Controllers\API\ApiLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/* Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
 */

Route::apiResource('login', ApiLoginController::class);
Route::apiResource('gestao-documentos', ApiDocumentoController::class);