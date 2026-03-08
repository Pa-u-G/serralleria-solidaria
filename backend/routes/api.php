<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CharacteristicTypeController;
use App\Http\Controllers\CharacteristicController;

Route::get('/categories', [CategoriesController::class, 'index']);
Route::put('/categories/{id}', [CategoriesController::class, 'update']);
Route::patch('/categories/{id}', [CategoriesController::class, 'update']);
Route::post('/categories', [CategoriesController::class, 'store']);

// Tipos de característica
Route::get('/characteristics-types', [CharacteristicTypeController::class, 'index']);
Route::post('/characteristics-types', [CharacteristicTypeController::class, 'store']);
Route::put('/characteristics-types/{id}', [CharacteristicTypeController::class, 'update']);
Route::patch('/characteristics-types/{id}', [CharacteristicTypeController::class, 'update']);

// Características
Route::post('/characteristics', [CharacteristicController::class, 'store']);
Route::put('/characteristics/{id}', [CharacteristicController::class, 'update']);
Route::patch('/characteristics/{id}', [CharacteristicController::class, 'update']);