<?php

use App\Http\Controllers\HomepageController;
use App\Http\Controllers\Subset\SubsetLevelDataController;
use App\Http\Controllers\Utils\MetaHierarchyItemDetailController;
use App\Http\Controllers\Utils\OrganizationExportController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\WidgetsEditor\WidgetAiSearchController;
use App\Http\Controllers\Api\PageEditorApiController;
use App\Http\Controllers\Api\WidgetApiController;
use App\Http\Controllers\Utils\SubsetGroupDetailedController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigLayoutUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartDeleteController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableDeleteController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigOverviewUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigRankingUpdateController;
use App\Http\Controllers\Blocks\BlocksConfigUpdate\BlocksConfigTrendUpdateController;
use App\Http\Controllers\Blocks\BlocksController;
use App\Http\Controllers\Blocks\BlocksUpdateConfigController;
use App\Http\Controllers\Blocks\BlocksUpdateDimensionController;
use App\Http\Controllers\Blocks\DataExplorerCard\DataExplorerCardUpdateController;
use App\Http\Controllers\ChartData\DataDetailDateController;
use App\Http\Controllers\ChartData\DataDetailListController;
use App\Http\Controllers\ChartData\DataDetailSubsetGroupController;
use App\Http\Controllers\ChartData\DataExplorerDataController;
use App\Http\Controllers\ChartData\SubsetDimensionFieldItemController;
use App\Http\Controllers\ChartData\SubsetDimensionFieldsController;
use App\Http\Controllers\ChartData\SubsetGroupDetailController;
use App\Http\Controllers\ChartData\SubsetGroupItemsController;
use App\Http\Controllers\ChartData\SubsetGroupListController;
use App\Http\Controllers\ChartData\SubsetGroupNameController;
use App\Http\Controllers\ChartData\SubsetMeasuresController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\ChatHistory\ChatHistoryController;
use App\Http\Controllers\ChatHistory\FavoriteController;
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
use App\Http\Controllers\DataLoader\StoreLoaderQueryWithConnectionController;
use App\Http\Controllers\DataLoader\TestDataLoaderAPIController;
use App\Http\Controllers\DistributionHierarchy\OfficeListController;
use App\Http\Controllers\DistributionHierarchy\OfficeSearchController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\InsightsGen\GetInsights;
use App\Http\Controllers\InsightsGen\InsightsGen;
use App\Http\Controllers\Map\OfficeCoordinateListController;
use App\Http\Controllers\Meta\DataClassificationPropertyController;
use App\Http\Controllers\Meta\MetaDataController;
use App\Http\Controllers\Meta\MetaDataGroupController;
use App\Http\Controllers\Meta\MetaDataSearchController;
use App\Http\Controllers\Meta\MetaGroupAddItemController;
use App\Http\Controllers\Meta\MetaGroupDeleteItemController;
use App\Http\Controllers\Meta\MetaHierarchyAddItemController;
use App\Http\Controllers\Meta\MetaHierarchyController;
use App\Http\Controllers\Meta\MetaHierarchyDataController;
use App\Http\Controllers\Meta\MetaHierarchyDeleteItemController;
use App\Http\Controllers\Meta\MetaHierarchyLevelController;
use App\Http\Controllers\Meta\MetaHierarchySearchController;
use App\Http\Controllers\Meta\MetaStructureController;
use App\Http\Controllers\Meta\MetaStructureSearchController;
use App\Http\Controllers\MetaHierarchy\MetaHierarchyItemController;
use App\Http\Controllers\Utils\MetaHierarchyItemSearchController;
use App\Http\Controllers\NavController\DefaultDashboardPageController;
use App\Http\Controllers\NavController\DefaultDashboardPageGetController;
use App\Http\Controllers\NavController\NavController;
use App\Http\Controllers\NavController\NavEditorController;
use App\Http\Controllers\NavController\NavGroupController;
use App\Http\Controllers\NavController\NavItemController;
use App\Http\Controllers\NavController\NavItemsListController;
use App\Http\Controllers\OperationsController;
use App\Http\Controllers\PageBuilder\PageBuilderController;
use App\Http\Controllers\PageEditor\CustomPageController;
use App\Http\Controllers\PageEditor\PageEditorController;
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
use App\Http\Controllers\Utils\LoaderAPIListController;
use App\Http\Controllers\Utils\LoaderConnectionListController;
use App\Http\Controllers\Utils\LoaderQueryListController;
use App\Http\Controllers\Utils\StoreLoaderAPIController;
use App\Http\Controllers\Utils\SubsetHavingDimensionMeasureController;
use App\Http\Controllers\Utils\SubsetMaxValueController;
use App\Http\Controllers\Utils\SubsetDetailGetController;
use App\Http\Controllers\WidgetsEditor\WidgetCollectionController;
use App\Http\Controllers\WidgetsEditor\WidgetCollectionSearchController;
use App\Http\Controllers\WidgetsEditor\WidgetSearchController;
use App\Http\Controllers\WidgetsEditor\WidgetsEditorController;
use App\Models\DataLoader\DataLoaderJob;
use App\Services\DataLoader\Query\RunScheduledJob;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!auth()->check()) {
        return redirect()->route('login');
    }

    return redirect()->route('homepage');
});

Route::get('/dashboard', function () {
    return redirect()->route('data-detail.index');
})->middleware(['auth'])->name('dashboard');

Route::get('/home', [HomepageController::class, 'index'])->name('homepage');

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
Route::put('block/config/data-explorer/update/{id}', DataExplorerCardUpdateController::class)->name('config.data-explorer.update');
Route::put('block/config/layout/update/{id}', BlocksConfigLayoutUpdateController::class)->name('config.layout.update');

//chart

Route::get('/sample-line-chart', [ChartController::class, 'showLineChart'])->name('charts.line');

//api for subset, data table
Route::get('/api/data-detail', DataDetailListController::class);
Route::get('/api/subset/{subsetId}', SubsetMeasuresController::class);
Route::get('/api/subset-group', SubsetGroupListController::class);
Route::get('/api/subset-group/{subsetGroupId}', SubsetGroupItemsController::class);
Route::get('/api/subset-group-detail/{subsetGroupId}', SubsetGroupDetailController::class);
Route::get('/api/subset-groups/subset-having-dimension-measure/{group}', SubsetHavingDimensionMeasureController::class)
    ->name('subset-having-dimension-measure');
Route::get('/api/data-detail/date/{dataDetailId}', DataDetailDateController::class)
    ->name('data-detail.date');
Route::get('api/subset/dimension/{subsetId}', SubsetDimensionFieldsController::class)
    ->name('subset.dimension.fields');
Route::get('/subset-group/{id}', SubsetGroupNameController::class);
Route::get('/api/subset/dimension/fields/{subsetColumn}/{subsetId}/', SubsetDimensionFieldItemController::class);
Route::get('/api/data-explorer/{subsetGroup}', DataExplorerDataController::class)
    ->name('data-explorer');
Route::get('/api/data-detail/subset-group/{dataDetailId}', DataDetailSubsetGroupController::class);

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
Route::get('meta-hierarchy-item-search', MetaHierarchyItemSearchController::class)
    ->name('meta-hierarchy-item-search');
Route::get('meta-structure-search', MetaStructureSearchController::class)
    ->name('meta-structure-search');
Route::delete('meta-group-delete-item/{id}', MetaGroupDeleteItemController::class)
    ->name('meta-group-delete-item');
Route::delete('meta-hierarchy-delete-item/{metaHierarchyItem}', MetaHierarchyDeleteItemController::class)
    ->name('meta-hierarchy-delete-item');
Route::get('meta-hierarchy-level/{metaHierarchyLevel}', [MetaHierarchyLevelController::class, 'show'])
    ->name('meta-hierarchy-level.show');
Route::get('meta-hierarchy/{metaHierarchy}/levels', [MetaHierarchyLevelController::class, 'getByHierarchy'])
    ->name('meta-hierarchy.levels');

Route::get('meta-hierarchy-data/{metaHierarchy}', MetaHierarchyDataController::class)
    ->name('meta-hierarchy-data.show');

Route::resource('data-classification-property', DataClassificationPropertyController::class)
    ->parameters(['data-classification-property' => 'dataClassificationProperty']);

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

Route::get('loader-json-api-data/{loaderAPI}', DataLoaderAPIDataController::class)
    ->name('loader-json-api-data');

Route::post('get-api-response-structure', TestDataLoaderAPIController::class)
    ->name('get-api-response-structure');

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
Route::post('/chat-history/{chatHistory}/favorite', [FavoriteController::class, 'addFavorite'])->name('chat-history.add-favorite');
Route::delete('/chat-history/{chatHistory}/favorite/{messageId}', [FavoriteController::class, 'removeFavorite'])->name('chat-history.remove-favorite');

Route::get('/nav-editor', [NavEditorController::class, 'index'])->name('nav.editor');

Route::resource('nav-group', NavGroupController::class)->only([
    'update',
    'store',
    'destroy',
]);

Route::resource('nav-item', NavItemController::class)->only([
    'update',
    'store',
    'destroy',
]);

Route::get('nav-item/list', NavItemsListController::class);
Route::post('/nav-items/{navItem}/set-default', DefaultDashboardPageController::class)
    ->name('nav-items.set-default');

Route::get('nav-items/default', DefaultDashboardPageGetController::class)->name('dashboard.default-page');

Route::get('nav-data', NavController::class);

Route::get('/data-detail-column-search/{dataDetail}', DataDetailColumnSearchController::class)
    ->name('data-detail-column-search');

Route::resource('widget-editor', WidgetsEditorController::class)
    ->parameters(['widget-editor' => 'widget']);
Route::resource('widget-collection', WidgetCollectionController::class)
    ->parameters(['widget-collection' => 'widgetCollection']);
Route::get('page-editor/widget/{widget}', [PageEditorController::class, 'getWidget'])->name('page-editor.get-widget');
Route::post('page-editor/preview', [PageEditorController::class, 'storePreview'])->name('page-editor.preview.store');
Route::get('page-editor/preview/{key}', [CustomPageController::class, 'preview'])->name('page-editor.preview.show');
Route::resource('page-editor', PageEditorController::class);

Route::get('widget-search', WidgetSearchController::class)->name('widget.search');
Route::get('widget-collection-search', WidgetCollectionSearchController::class)->name('widget-collection.search');
Route::get('widget-ai-search', WidgetAiSearchController::class)->name('widget.ai.search');

Route::post('widgets/save', [WidgetApiController::class, 'store'])->name('widgets.api.store');
Route::put('widgets/save/{widget}', [WidgetApiController::class, 'update'])->name('widgets.api.update');

Route::post('pages/save', [PageEditorApiController::class, 'store'])->name('pages.api.store');
Route::put('pages/save/{page}', [PageEditorApiController::class, 'update'])->name('pages.api.update');
Route::get('pages/list', [PageEditorApiController::class, 'index'])->name('pages.api.index');
Route::get('pages/{page}', [PageEditorApiController::class, 'show'])->name('pages.api.show');

//Util APIS
Route::get('loader-apis-list', LoaderAPIListController::class)
    ->name('loader-apis-list');

Route::get('loader-queries-list', LoaderQueryListController::class)
    ->name('loader-queries-list');

Route::get('loader-connections-list', LoaderConnectionListController::class)
    ->name('loader-connections-list');

Route::post('api/store-loader-query', StoreLoaderQueryWithConnectionController::class)
    ->name('api-store-loader-query');

Route::post('api/store-loader-json-api', StoreLoaderAPIController::class)
    ->name('api-store-loader-json-api');

Route::get('subset-field-max-value/{subsetDetail}', SubsetMaxValueController::class)
    ->name('subset-field-max-value');

Route::get('subset-group-detailed/{group}', SubsetGroupDetailedController::class)
    ->name('subset-group-detailed');

Route::get('api/subset-detail/{subsetDetail}', SubsetDetailGetController::class)
    ->name('subset.detail.get');

Route::resource('organization', OrganizationController::class);
Route::get('organization-export', OrganizationExportController::class)
    ->name('organization.export');

Route::get('meta-hierarchy-item-detail/{metaHierarchyItem}', MetaHierarchyItemDetailController::class)
    ->name('meta-hierarchy-item-detail');

Route::get('subset-level-data/{subsetDetail}', SubsetLevelDataController::class)
    ->name('subset-level-data');

require __DIR__ . '/auth.php';

Route::get('/{slug}', [CustomPageController::class, 'show'])->name('custom-page');
