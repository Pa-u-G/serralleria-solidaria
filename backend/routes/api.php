<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CharacteristicTypeController;
use App\Http\Controllers\CharacteristicController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\ProductPackController;

Route::get('/categories', [CategoriesController::class, 'index']);

Route::get('/products', [ProductsController::class, 'index']);
Route::get('/products/{id}', [ProductsController::class, 'show']);

Route::post('/create_product', [ProductsController::class, 'store']);
Route::put('/edit_product/{id}', [ProductsController::class, 'update']);
Route::patch('/product/{id}', [ProductsController::class, 'change_status']);
Route::delete('/product_image/{id}', [ProductsController::class, 'delete_image']);
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
Route::delete('/packs/image/{image_id}', [PackController::class, 'delete_image']);


// tienda:


// prodctos-categoria

Route::get('/store/category/{categoryId}/products', [ProductsController::class, 'getProductsByCategory']);
Route::get('/store/category/{categoryId}/info', [ProductsController::class, 'getCategoryInfo']);

Route::get('/store/product/{id}', [ProductsController::class, 'getProduct']);