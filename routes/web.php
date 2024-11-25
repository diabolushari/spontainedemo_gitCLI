<?php

use App\Http\Controllers\DataDetail\DataDetailController;
use App\Http\Controllers\DataDetail\DataTableExcelUploadController;
use App\Http\Controllers\DataDetail\ExportDataTableController;
use App\Http\Controllers\DataExplorer\DataExplorerController;
use App\Http\Controllers\DataLoader\DataLoaderConnectionController;
use App\Http\Controllers\DataLoader\DataLoaderJobController;
use App\Http\Controllers\DataLoader\DataLoaderQueryController;
use App\Http\Controllers\DataLoader\DataLoaderQueryDataController;
use App\Http\Controllers\DataLoader\QueryListController;
use App\Http\Controllers\DistributionHierarchy\OfficeListController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\Meta\MetaDataController;
use App\Http\Controllers\Meta\MetaDataGroupController;
use App\Http\Controllers\Meta\MetaDataSearchController;
use App\Http\Controllers\Meta\MetaGroupAddItemController;
use App\Http\Controllers\Meta\MetaGroupDeleteItemController;
use App\Http\Controllers\Meta\MetaHierarchyAddItemController;
use App\Http\Controllers\Meta\MetaHierarchyController;
use App\Http\Controllers\Meta\MetaHierarchyDeleteItemController;
use App\Http\Controllers\Meta\MetaHierarchySearchController;
use App\Http\Controllers\Meta\MetaStructureController;
use App\Http\Controllers\Meta\MetaStructureSearchController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\ReferenceData\ReferenceDataAPIController;
use App\Http\Controllers\ReferenceData\ReferenceDataController;
use App\Http\Controllers\ServiceDeliveryController;
use App\Http\Controllers\SubjectArea\SubjectAreaController;
use App\Http\Controllers\Subset\FindLevelController;
use App\Http\Controllers\Subset\SubsetCreateController;
use App\Http\Controllers\Subset\SubsetDataController;
use App\Http\Controllers\Subset\SubsetDeleteController;
use App\Http\Controllers\Subset\SubsetDropdownApiController;
use App\Http\Controllers\Subset\SubsetListController;
use App\Http\Controllers\Subset\SubsetOfficeLevelDataController;
use App\Http\Controllers\Subset\SubsetPreviewController;
use App\Http\Controllers\Subset\SubsetStoreController;
use App\Http\Controllers\Subset\SubsetSummaryController;
use App\Http\Controllers\Subset\SubsetTableController;
use App\Http\Controllers\SubsetGroup\SubsetGroupController;
use App\Http\Controllers\SubsetGroup\SubsetGroupItemController;
use App\Http\Controllers\TabController;
use App\Models\DataLoader\DataLoaderJob;
use App\Services\DataLoader\Query\RunScheduledJob;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    Cache::set('key', 'value', 60);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/', function () {
    return redirect()->route('dashboard');
});
Route::get('/dashboard', function () {
    return redirect()->route('data-detail.index');
})->middleware(['auth', 'verified'])->name('dashboard');

//reference data
Route::resource('reference-data', ReferenceDataController::class);
Route::get('parameter-list', [ReferenceDataAPIController::class, 'parameterList'])
    ->name('parameter-list');
Route::get('unique-ref-data-values', [ReferenceDataAPIController::class, 'uniqueValues'])
    ->name('unique-red-data-values');
Route::get('cascaded-ref-data', [ReferenceDataAPIController::class, 'cascadedValues'])
    ->name('cascaded-ref-data');

//meta data
Route::resource('meta-structure', MetaStructureController::class)
    ->parameters(['meta-structure' => 'metaStructure']);
Route::resource('meta-data', MetaDataController::class)
    ->parameters(['meta-data' => 'metaData']);
Route::resource('meta-data-group', MetaDataGroupController::class)
    ->parameters(['meta-data-group' => 'metaDataGroup']);
Route::resource('meta-hierarchy', MetaHierarchyController::class)
    ->parameters(['meta-hierarchy' => 'metaHierarchy']);
Route::get('meta-data-search', MetaDataSearchController::class)
    ->name('meta-data-search');
Route::post('meta-group-add-item', MetaGroupAddItemController::class)
    ->name('meta-group-add-item');
Route::post('meta-hierarchy-add-item', MetaHierarchyAddItemController::class)
    ->name('meta-hierarchy-add-item');
Route::get('meta-hierarchy-search', MetaHierarchySearchController::class)
    ->name('meta-hierarchy-search');
Route::get('meta-structure-search', MetaStructureSearchController::class)
    ->name('meta-structure-search');
Route::delete('meta-group-delete-item/{id}', MetaGroupDeleteItemController::class)
    ->name('meta-group-delete-item');
Route::delete('meta-hierarchy-delete-item/{metaHierarchyItem}', MetaHierarchyDeleteItemController::class)
    ->name('meta-hierarchy-delete-item');

//subject areas & data details
Route::resource('subject-area', SubjectAreaController::class)
    ->parameters(['subject-areas' => 'subjectArea']);
Route::resource('data-detail', DataDetailController::class)
    ->parameters(['data-detail' => 'dataDetail']);

Route::resource('loader-connections', DataLoaderConnectionController::class)
    ->parameters(['loader-connections' => 'dataLoaderConnection']);

Route::resource('loader-queries', DataLoaderQueryController::class)
    ->parameters(['loader-queries' => 'dataLoaderQuery']);

Route::get('loader-query-data/{dataLoaderQuery}', DataLoaderQueryDataController::class)
    ->name('loader-query-data');

Route::resource('loader-jobs', DataLoaderJobController::class)
    ->parameters(['loader-jobs' => 'dataLoaderJob']);

Route::get('queries-in-connection', QueryListController::class)
    ->name('queries-in-connection');

Route::get('tab', [TabController::class, 'show'])->name('tab');

Route::get('export-data-table/{dataDetail}', ExportDataTableController::class)
    ->name('export-data-table');

Route::post('import-data-table/{dataDetail}', DataTableExcelUploadController::class)
    ->name('import-data-table');

Route::resource('service-delivery', ServiceDeliveryController::class);
Route::resource('operation', OperationsController::class);
Route::resource('finance', FinancialController::class);

Route::get('subset/create/{dataDetail}', SubsetCreateController::class)
    ->name('subset.create');

Route::post('subset/{dataDetail}', SubsetStoreController::class)
    ->name('subset.store');

Route::get('subset/{subsetDetail}', SubsetDataController::class)
    ->name('subset.show');

Route::get('subset-summary/{subsetDetail}', SubsetSummaryController::class)
    ->name('subset.summary');

Route::get('office-level-summary/{subsetDetail}', SubsetOfficeLevelDataController::class)
    ->name('office-level-summary');

Route::get('subset-preview/{subsetDetail}', SubsetPreviewController::class)
    ->name('subset.preview');

Route::delete('subset/{detail}', SubsetDeleteController::class)
    ->name('subset.destroy');

Route::get('subset-list', SubsetListController::class)
    ->name('subset.list');

Route::get('subset-level', SubsetDropdownApiController::class)
    ->name('subset.level');

Route::get('find-level', FindLevelController::class)
    ->name('find-level');

Route::get('dataset/{subsetDetail}', SubsetTableController::class)
    ->name('subset.table');

Route::get('office-list', OfficeListController::class)
    ->name('office-list');

//Route::get('test/{dataLoaderJob}', function (DataLoaderJob $dataLoaderJob, RunScheduledJob $job) {
//
//    $dataLoaderJob->load('loaderQuery.loaderConnection', 'detail');
//
//    return $job->run($dataLoaderJob);
//
//});

Route::get('phpinfo', function () {
    phpinfo();
});

Route::get('explorer/{subsetGroup}', DataExplorerController::class);

Route::resource('subset-groups', SubsetGroupController::class)
    ->parameters(['subset-groups' => 'subsetGroup']);

Route::apiResource('subset-group-items', SubsetGroupItemController::class)
    ->parameters(['subset-group-items' => 'subsetGroupItem']);

require __DIR__.'/auth.php';
