<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;

Route::get('/categories', [CategoriesController::class, 'index']);
Route::put('/categories/{id}', [CategoriesController::class, 'update']);
Route::patch('/categories/{id}', [CategoriesController::class, 'update']);
Route::post('/categories', [CategoriesController::class, 'store']); 