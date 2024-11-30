<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\RevenueTypeController;


Route::apiResource('notes', NoteController::class);
Route::apiResource('tasks', TaskController::class);
Route::resource('cash-registers', CashRegisterController::class);
Route::resource('banks', BankController::class);
Route::resource('revenues', RevenueController::class);
Route::resource('expenses', ExpenseController::class);
Route::resource('revenue-types', RevenueTypeController::class);
Route::resource('expense-types', ExpenseTypeController::class);
