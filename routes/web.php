<?php

use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartDeleteController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableDeleteController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigRankingUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigTrendUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewUpdateController;
use App\Http\Controllers\Blocks\BlocksController;
use App\Http\Controllers\Blocks\BlocksUpdateConfigController;
use App\Http\Controllers\Blocks\BlocksUpdateDimensionController;
use App\Http\Controllers\ChartData\DataDetailDateController;
use App\Http\Controllers\ChartData\DataDetailListController;
use App\Http\Controllers\ChartData\SubsetDimensionFieldItemController;
use App\Http\Controllers\ChartData\SubsetDimensionFieldsController;
use App\Http\Controllers\ChartData\SubsetFieldsController;
use App\Http\Controllers\ChartData\SubsetGroupItemsController;
use App\Http\Controllers\ChartData\SubsetGroupListController;
use App\Http\Controllers\ChartData\SubsetGroupNameController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\ChatHistory\ChatHistoryController;
use App\Http\Controllers\DataDetail\DataDetailController;
use App\Http\Controllers\DataDetail\DataDetailSearchController;
use App\Http\Controllers\DataDetail\DataTableExcelUploadController;
use App\Http\Controllers\DataDetail\ExportDataTableController;
use App\Http\Controllers\DataDetail\GetAllFieldsController;
use App\Http\Controllers\DataExplorer\DataExplorerController;
use App\Http\Controllers\DataLoader\DataLoaderAPIController;
use App\Http\Controllers\DataLoader\DataLoaderAPIDataController;
use App\Http\Controllers\DataLoader\DataLoaderConnectionController;
use App\Http\Controllers\DataLoader\DataLoaderJobController;
use App\Http\Controllers\DataLoader\DataLoaderQueryController;
use App\Http\Controllers\DataLoader\DataLoaderQueryDataController;
use App\Http\Controllers\DataLoader\QueryListController;
use App\Http\Controllers\DistributionHierarchy\OfficeListController;
use App\Http\Controllers\DistributionHierarchy\OfficeSearchController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\InsightsGen\GetInsights;
use App\Http\Controllers\InsightsGen\InsightsGen;
use App\Http\Controllers\Map\OfficeCoordinateListController;
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
use App\Http\Controllers\MetaHierarchy\MetaHierarchyItemController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\PageBuilder\PageBuilderController;
use App\Http\Controllers\ReferenceData\ReferenceDataAPIController;
use App\Http\Controllers\ReferenceData\ReferenceDataController;
use App\Http\Controllers\SampleChart\ChartController;
use App\Http\Controllers\ServiceDeliveryController;
use App\Http\Controllers\StaticListController;
use App\Http\Controllers\SubjectArea\SubjectAreaController;
use App\Http\Controllers\Subset\FindLevelController;
use App\Http\Controllers\Subset\OfficeRankingsController;
use App\Http\Controllers\Subset\SubsetColumSearchController;
use App\Http\Controllers\Subset\SubsetController;
use App\Http\Controllers\Subset\SubsetCreateController;
use App\Http\Controllers\Subset\SubsetDataController;
use App\Http\Controllers\Subset\SubsetDeleteController;
use App\Http\Controllers\Subset\SubsetDropdownApiController;
use App\Http\Controllers\Subset\SubsetEditController;
use App\Http\Controllers\Subset\SubsetExportController;
use App\Http\Controllers\Subset\SubsetFieldsListController;
use App\Http\Controllers\Subset\SubsetListController;
use App\Http\Controllers\Subset\SubsetOfficeLevelDataController;
use App\Http\Controllers\Subset\SubsetPreviewController;
use App\Http\Controllers\Subset\SubsetRankedDataController;
use App\Http\Controllers\Subset\SubsetStoreController;
use App\Http\Controllers\Subset\SubsetSummaryController;
use App\Http\Controllers\Subset\SubsetTableController;
use App\Http\Controllers\Subset\SubsetUpdateController;
use App\Http\Controllers\SubsetDocumentation\SubsetDocumentationController;
use App\Http\Controllers\SubsetGroup\SubsetGroupController;
use App\Http\Controllers\SubsetGroup\SubsetGroupItemController;
use App\Http\Controllers\TabController;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Services\DataLoader\Query\RunScheduledJob;
use App\Services\DataTable\JoinDataTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return redirect()->route('data-detail.index');
})->middleware(['auth', 'verified'])->name('dashboard');

// Page building
Route::resource('page-builder', PageBuilderController::class);
Route::resource('blocks', BlocksController::class);
Route::put('builder/dimension/update/{id}', BlocksUpdateDimensionController::class)
    ->name('dimension.update');

// page block urls
Route::put('builder/config/update/{id}', BlocksUpdateConfigController::class)
    ->name('config.update');
Route::put('block/config/general/update/{id}', BlocksConfigGeneralUpdateController::class)
    ->name('config.general.update');
Route::put('block/config/trend/update/{id}', BlocksConfigTrendUpdateController::class)
    ->name('config.trend.update');
Route::put('block/config/ranking/update/{id}', BlocksConfigRankingUpdateController::class)
    ->name('config.ranking.update');
Route::put('block/config/overview/update/{id}', BlocksConfigOverviewUpdateController::class)
    ->name('config.overview.update');
Route::put('block/config/overview/chart/update/{id}', BlocksConfigOverviewChartUpdateController::class)
    ->name('config.overview.chart.update');
Route::put('block/config/overview/table/update/{id}', BlocksConfigOverviewTableUpdateController::class)->name('config.overview.table.update');
Route::delete('block/config/overview/table/update/{id}/{blockId}', BlocksConfigOverviewTableDeleteController::class)->name('config.overview.table.destroy');
Route::delete('block/config/overview/chart/update/{blockId}', BlocksConfigOverviewChartDeleteController::class)->name('config.overview.chart.destroy');




//chart
Route::get('/sample-line-chart', [ChartController::class, 'showLineChart'])->name('charts.line');

//api for subset, data table
Route::get('/api/data-detail', DataDetailListController::class);
Route::get('/api/subset/{subsetId}', SubsetFieldsController::class);
Route::get('/api/subset-group', SubsetGroupListController::class);
Route::get('/api/subset-group/{subsetGroupId}', SubsetGroupItemsController::class);
Route::get('/api/data-detail/date/{dataDetailId}', DataDetailDateController::class)
    ->name('data-detail.date');
Route::get('api/subset/dimension/{subsetId}', SubsetDimensionFieldsController::class)
    ->name('subset.dimension.fields');
Route::get('/subset-group/{id}', SubsetGroupNameController::class);
Route::get('/api/subset/dimension/fields/{subsetColumn}/{subsetId}/', SubsetDimensionFieldItemController::class);

//testing
Route::get('/test', function () {
    return Inertia::render('TestPage');
});

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
Route::get('data-detail/{dataDetail}/fields', GetAllFieldsController::class)
    ->name('data-detail.fields');

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

Route::get('subset/{subsetDetail}/edit', SubsetEditController::class)
    ->name('subset.edit');

Route::patch('subset/{subsetDetail}', SubsetUpdateController::class)
    ->name('subset.update');

Route::post('subset/{dataDetail}', SubsetStoreController::class)
    ->name('subset.store');

Route::get('subset/{subsetDetail}', SubsetDataController::class)
    ->name('subset.show');

Route::get('subset-column-search/{subsetDetail}', SubsetColumSearchController::class)
    ->name('subset.column.search');

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

Route::get('subsets', SubsetController::class)
    ->name('subsets');

Route::get('find-level', FindLevelController::class)
    ->name('find-level');

Route::get('dataset/{subsetDetail}', SubsetTableController::class)
    ->name('subset.table');

Route::get('office-list', OfficeListController::class)
    ->name('office-list');

Route::get('office-search', OfficeSearchController::class)
    ->name('office-search');

Route::get('data-explorer/{subsetGroup}', DataExplorerController::class)
    ->name('data-explorer');

Route::resource('subset-groups', SubsetGroupController::class)
    ->parameters(['subset-groups' => 'subsetGroup']);

Route::apiResource('subset-group-items', SubsetGroupItemController::class)
    ->parameters(['subset-group-items' => 'subsetGroupItem']);

Route::get('subset-export/{subsetDetail}', SubsetExportController::class)
    ->name('subset-export');

Route::get('office-rankings/{subsetGroupName}', OfficeRankingsController::class)
    ->name('office-rankings');

Route::get('subset-fields', SubsetFieldsListController::class)
    ->name('subset-fields');

Route::get('static-list', StaticListController::class)
    ->name('static-list');

Route::get('chat', ChatController::class)
    ->name('chat');

Route::get('subset-documentation', SubsetDocumentationController::class)
    ->name('subset-documentation');

Route::resource('loader-apis', DataLoaderAPIController::class)
    ->parameters(['loader-apis' => 'dataLoaderAPI']);

Route::get('loader-query-api-data/{loaderAPI}', DataLoaderAPIDataController::class)
    ->name('loader-query-api-data');

//autocomplete apis
Route::get('data-detail-search', DataDetailSearchController::class)
    ->name('data-detail.search');

Route::get('test/{loaderJob}', function (DataLoaderJob $loaderJob, RunScheduledJob $runScheduledJob) {

    $loaderJob
        ->load(
            'loaderQuery.loaderConnection',
            'detail',
            'predecessor',
            'api'
        );

    return $runScheduledJob->run($loaderJob)->toArray();
});

Route::get('subset-ranked-data/{subsetDetail}', SubsetRankedDataController::class)
    ->name('subset.ranked.data');

Route::get('/hierarchy-items/{metaHierarchy}', MetaHierarchyItemController::class)
    ->name('meta-hierarchies.hierarchy-items');

//map
Route::get('office-coordinates', OfficeCoordinateListController::class)
    ->name('office-coordinates')
    ->middleware('auth');

Route::get('test', function (JoinDataTable $joinDataTable) {
    $dataDetail = DataDetail::where('id', 42)->first();

    return $joinDataTable->join($dataDetail)
        ->selectRaw('MAX(month_year_record.name) as month_year')
        ->first();
});

require __DIR__ . '/auth.php';
Route::get('/insight-gen', InsightsGen::class)
    ->name('insight-gen');

Route::get('/get-insights', GetInsights::class)
    ->name('get-insights');

Route::apiResource('/chat-history', ChatHistoryController::class);

require __DIR__ . '/auth.php';
