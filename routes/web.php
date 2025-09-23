<?php

use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\ChatHistory\ChatHistoryController;
use App\Http\Controllers\DataDetail\DataDetailColumnSearchController;
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
use App\Http\Controllers\DataLoader\LoaderAPIRecordController;
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
use App\Http\Controllers\ReferenceData\ReferenceDataAPIController;
use App\Http\Controllers\ReferenceData\ReferenceDataController;
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
use App\Models\DataLoader\DataLoaderJob;
use App\Services\DataLoader\Query\RunScheduledJob;
use Illuminate\Support\Facades\Route;

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

Route::get('loader-api-record/{loaderAPI}', LoaderAPIRecordController::class)
    ->name('loader-api-record');

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

Route::get('/insight-gen', InsightsGen::class)
    ->name('insight-gen');

Route::get('/get-insights', GetInsights::class)
    ->name('get-insights');

Route::apiResource('/chat-history', ChatHistoryController::class);

Route::get('/data-detail-column-search/{dataDetail}', DataDetailColumnSearchController::class)
    ->name('data-detail-column-search');

Route::get('/test-flatten-json', function () {
    $testData = [[
        'name' => 'Revenue Summary - All data',
        'id' => 362,
        'description' => 'This contains data about month-wise bill generation by office, at various voltage levels and consumer categories.\nThe metrics captured are  total live consumers at a particular office, the number of consumers who owere billed, total consumptions in units,  total value demanded, and average unit rate that was used to calculate the bill. This is important in understanding consumption patterns within various user categories, and determining regions where billing activity is anomalous, and also finding out how consumption patterns are in various categories billed at different average unit rates (for example,  agricultural tariffs are usually lower, and may be sold at a rate lower than it takes for KSEB to produce the electricity, whereas commercial rates may be sold at a positive margin.) this is one way in which average unit rates and categories can provide importanty insights. Also, this subset may be used to determine consumption pattern changes over time.',
        'hierarchy' => 'Office Hierarchy',
        'data_family' => 'Revenue Summary',
        'data_family_description' => 'Category-wise revenue data',
        'proactive_insight_instructions' => 'Check for pattern anomalies across office levels : \n-  large change in consumption\n- large varience across offices in billed consumers vs live consumers\n- high growth in customer counts that have very high unit rate\n- high growth in customer counts that have very low unit rate',
        'visualization_instructions' => '-  if user is requesting multiple months, limit to trend chart with one requested metric (live consumers OR billed consumers OR total demand OR average unit rate or total consumption) on the Y axis, and month on the X axis - x axis must be  in ascending order\n\n\n-  if requested data has multiple offices, limit to bar graph with office on the x axis and the requested metric on the y axis.\n\n-  if requested data is a metric by category or voltage, generate a pie chart. Dimension: voltage or category, metric: requested metric.',
        'dates' => [],
        'dimensions' => [
            [
                'column' => 'month',
                'name' => 'month',
                'description' => 'Month and year in MMYYYY format',
                'values' => [
                    '202411',
                    '202410',
                    '202407',
                    '202409',
                    '202408',
                    '202406',
                    '202405',
                    '202412',
                    '202301',
                    '202302',
                    '202303',
                    '202305',
                    '202311',
                    '202310',
                    '202306',
                    '202304',
                    '202403',
                    '202309',
                    '202402',
                    '202401',
                    '202404',
                    '202312',
                    '202308',
                    '202307',
                    '202212',
                    '202501',
                    '2',
                    '202503',
                    'end of file',
                ],
            ],
            [
                'column' => 'voltage',
                'name' => 'Voltage',
                'description' => 'Low Tenssion (LT), High Tension (HT) or Extra High Tension (EHT)',
                'values' => [
                    'LT',
                    'EHT',
                    'HT',
                ],
            ],
            [
                'column' => 'consumer_category',
                'name' => 'Consumer Category',
                'description' => 'Consumer category that the connection belongs to (e.g. Domestic, commercial, agriculture etc.)',
                'values' => [
                    'DOMESTIC',
                    'STATE GOVERNMENT  DEPARTMENTS',
                    'NON PAYING GROUP',
                    'PRIVATE INSTITUTIONS',
                    'KSEBoard',
                    'LOCAL BODIES',
                    'PUBLIC INSTITUTIONS',
                    'STATE PUBLIC SECTOR UNDERTAKINGS',
                    'CENTRAL GOVERNMENT DEPARTMENTS',
                    'CENTRAL PUBLIC SECTOR UNDERTAKINGS',
                    '0-50 units',
                    '51-100 units',
                    '101-150 units',
                    '151-200 units',
                    '201-250 units',
                    'INDUSTRIAL',
                    'LICENSEE',
                    'RAILWAY-TRACTION',
                    'GENERAL',
                    'METRO RAIL',
                    'COMMERCIAL',
                    'ELE.VEHICLES CHARGING STNs',
                    'AGRICULTURE',
                    'Commercial',
                    'Industrial',
                    'Industrial-PWW',
                    'Agriculture',
                    'Public Lighting',
                    'TEMPORARY CONNECTIONS',
                    'SPSU',
                    'Licencees',
                    'Railways Traction',
                    'Private',
                    'CPSU',
                    'Inter State',
                    'CPP',
                    'SEZ',
                    'State Govt',
                    'Co.Op Sector',
                    'KWA',
                    'Railway Station/Offices',
                    'Bank',
                    'Central Govt',
                    'Self Financing College',
                    'Govt Medical Collge',
                    'BSNL',
                    'Religious Institutions',
                    'Station Inv',
                    'Local body',
                    'Trust',
                    'Co.Op Society',
                    'Irrigation',
                    'Garrison Engineers',
                    'Power Grid',
                    'AIDED COLLEGES',
                    'Doordarshan/AIR',
                    'NON-INDUSTRIAL',
                ],
            ],
        ],
        'measures' => [
            [
                'column' => 'live_consumers',
                'name' => 'Live Consumers',
                'description' => null,
                'aggregation' => null,
            ],
            [
                'column' => 'billed_consumers',
                'name' => 'Billed Consumers',
                'description' => null,
                'aggregation' => null,
            ],
            [
                'column' => 'total_consumption__units_',
                'name' => 'Total Consumption (Units)',
                'description' => null,
                'aggregation' => null,
            ],
            [
                'column' => 'total_demand__rs_',
                'name' => 'Total Demand (Rs)',
                'description' => null,
                'aggregation' => null,
            ],
            [
                'column' => 'average_unit_rate__rs_',
                'name' => 'Average Unit Rate (Rs)',
                'description' => null,
                'aggregation' => null,
            ],
        ],
    ]];

    $flattenService = new \App\Services\DataLoader\JsonStructure\FlattenJsonResponse;
    $flattened = $flattenService->flatten($testData, '.', 'response');

    return response()->json($flattened);
})->name('test-flatten-json');

require __DIR__.'/auth.php';
