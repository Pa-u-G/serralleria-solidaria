<?php

use Illuminate\Support\Facades\Route;

Route::get('/posts', function() {
    return [
        ["id" => 1, "title" => "Primer post"],
        ["id" => 2, "title" => "Segundo post"]
    ];
});