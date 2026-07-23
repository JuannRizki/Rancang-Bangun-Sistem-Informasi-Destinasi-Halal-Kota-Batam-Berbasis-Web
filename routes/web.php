<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return redirect('http://127.0.0.1:3000/login');
})->name('login');

Route::get('/register', function () {
    return redirect('http://127.0.0.1:3000/register');
})->name('register');
