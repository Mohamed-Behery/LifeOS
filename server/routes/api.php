<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;

Route::apiResource('notes', NoteController::class);

Route::apiResource('tasks', TaskController::class);
