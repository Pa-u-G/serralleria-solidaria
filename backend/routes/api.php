<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CharacteristicTypeController;
use App\Http\Controllers\CharacteristicController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\ProductPackController;

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

// Packs
Route::apiResource('packs', PackController::class);

Route::post('/product-pack', [ProductPackController::class, 'store']);
Route::put('/product-pack', [ProductPackController::class, 'update']);
Route::delete('/product-pack/{product}/{pack}', [ProductPackController::class, 'destroy']);