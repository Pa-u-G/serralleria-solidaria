<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;

Route::get('/categories', [CategoriesController::class, 'index']);

Route::get('/products', [ProductsController::class, 'index']);
Route::get('/products/{id}', [ProductsController::class, 'show']);

Route::post('/create_product', [ProductsController::class, 'store']);
Route::put('/edit_product/{id}', [ProductsController::class, 'update']);

Route::delete('/delete_product/{id}', [ProductsController::class, 'destroy']);
