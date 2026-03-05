<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\UsersController;

Route::get('/posts', function() {
    return [
        ["id" => 1, "title" => "Primer post"],
        ["id" => 2, "title" => "Segundo post"]
    ];
});

Route::get('/categories', [CategoriesController::class, 'index']);

Route::get('/users', [UsersController::class, 'index']);