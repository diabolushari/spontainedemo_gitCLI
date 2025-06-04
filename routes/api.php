<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChartData\ChartDataController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/data-details', [ChartDataController::class, 'getDataDetails']);
Route::get('/subsets/{dataDetailId}', [ChartDataController::class, 'getSubsetsByDataDetail']);
// Route::get('/test-api', function () {
//     return response()->json(['message' => 'API working']);
// });
