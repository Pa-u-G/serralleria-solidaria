<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CharacteristicTypeController;
use App\Http\Controllers\CharacteristicController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\ProductPackController;
use App\Http\Controllers\SolutionsController;

// ============================================
// RUTAS PÚBLICAS (No requereixen autenticació)
// ============================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); 

// ----------------------------------------- TIENDA (PÚBLICO) ----------------------------------------- //
// Productos - PÚBLICOS
Route::get('/products', [ProductsController::class, 'index']); 
Route::get('/products/{id}', [ProductsController::class, 'show']); 

// Categories - PÚBLICAS
Route::get('/categories', [CategoriesController::class, 'index']); 

// Solutions - PÚBLICAS (per veure llistat a la botiga)
Route::get('/solutions', [SolutionsController::class, 'publicIndex']); 
Route::post('/solutions', [SolutionsController::class, 'store']); 

// Productos por categoría 
Route::get('/store/products', [ProductsController::class, 'getAllProducts']);
Route::get('/store/category/{categoryId}/products', [ProductsController::class, 'getProductsByCategory']);
Route::get('/store/category/{categoryId}/info', [ProductsController::class, 'getCategoryInfo']);
Route::get('/store/filters', [ProductsController::class, 'getFilters']);

Route::get('/store/product/{id}', [ProductsController::class, 'getProduct']);

// ============================================
// RUTAS PROTEGIDAS (Requereixen token - Només admin)
// ============================================
Route::middleware('api.token')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ----------------------------------------- ADMIN ----------------------------------------- //
    
    // Categories (Admin)
    Route::put('/categories/{id}', [CategoriesController::class, 'update']);
    Route::patch('/categories/{id}', [CategoriesController::class, 'update']);
    Route::post('/categories', [CategoriesController::class, 'store']);
    Route::delete('/categories/{id}', [CategoriesController::class, 'destroy']); 

    // Productos (Admin)
    Route::post('/create_product', [ProductsController::class, 'store']);
    Route::put('/edit_product/{id}', [ProductsController::class, 'update']);
    Route::patch('/product/{id}', [ProductsController::class, 'change_status']);
    Route::delete('/product_image/{id}', [ProductsController::class, 'delete_image']);

    // Tipos de característica (Admin)
    Route::get('/characteristics-types', [CharacteristicTypeController::class, 'index']);
    Route::post('/characteristics-types', [CharacteristicTypeController::class, 'store']);
    Route::put('/characteristics-types/{id}', [CharacteristicTypeController::class, 'update']);
    Route::patch('/characteristics-types/{id}', [CharacteristicTypeController::class, 'update']);

    // Características (Admin)
    Route::post('/characteristics', [CharacteristicController::class, 'store']);
    Route::put('/characteristics/{id}', [CharacteristicController::class, 'update']);
    Route::patch('/characteristics/{id}', [CharacteristicController::class, 'update']);

    // Packs (Admin)
    Route::apiResource('packs', PackController::class);
    Route::post('/product-pack', [ProductPackController::class, 'store']);
    Route::put('/product-pack', [ProductPackController::class, 'update']);
    Route::delete('/product-pack/{product}/{pack}', [ProductPackController::class, 'destroy']);
    Route::delete('/packs/image/{image_id}', [PackController::class, 'delete_image']);

    // Soluciones (Admin)
    Route::get('/solutions-admin', [SolutionsController::class, 'index']);
});