<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Fallback route for Single Page Application (React)
|
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
