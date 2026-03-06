<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;

Route::get('/categories', [CategoriesController::class, 'index']);

Route::get('/products', [ProductsController::class, 'index']);
