# SubsetDetail Model Documentation

## Overview

The `SubsetDetail` model serves as the **data access layer** for tables in the KSEB Analytics system. It acts as a "view" that defines how data from `DataDetail` tables should be accessed, filtered, and presented to users. SubsetDetail provides a configurable interface for querying specific data subsets with custom filters, field selections, and data transformations.

## Table of Contents

- [Model Structure](#model-structure)
- [Data Access Layer Concept](#data-access-layer-concept)
- [Field Configuration](#field-configuration)
- [Data Access Workflow](#data-access-workflow)
- [Relationships](#relationships)
- [API Integration](#api-integration)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)

## Model Structure

### Location

`app/Models/Subset/SubsetDetail.php`

### Key Properties

```php
protected $fillable = [
    'name',                              // Human-readable name for the subset
    'description',                       // Description of the subset purpose
    'data_detail_id',                   // Reference to the source DataDetail table
    'group_data',                       // Boolean flag for data grouping/aggregation
    'type',                             // Subset type (office_level, rollup_subset, composite_subset)
    'max_rows_to_fetch',               // Limit for query results
    'use_for_training_ai',             // Flag for AI training data usage
    'proactive_insight_instructions',   // AI instructions for insights
    'visualization_instructions',       // Instructions for data visualization
    'created_by',                      // User ID who created the subset
    'updated_by',                      // User ID who last updated the subset
];
```

### Features

- **Soft Deletes**: Uses Laravel's `SoftDeletes` trait for safe record removal
- **View-like Behavior**: Provides customizable data access to underlying tables
- **Field Filtering**: Selects specific fields from the source table
- **Data Transformation**: Applies expressions and aggregations
- **Performance Optimization**: Configurable row limits and caching

## Data Access Layer Concept

SubsetDetail functions as a **data access layer** that sits between the raw data tables (DataDetail) and the application's data consumption points:

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Tables   │    │  SubsetDetail   │    │  Applications   │
│   (DataDetail)  │    │  (Access Layer) │    │   (Frontend)    │
│                 │    │                 │    │                 │
│ • Raw Data      │◄───┤ • Field Selection│───►│ • Dashboards    │
│ • Full Schema   │    │ • Data Filtering │    │ • Reports       │
│ • All Records   │    │ • Aggregations  │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### View-like Characteristics

1. **Field Selection**: Choose specific columns from the source table
2. **Data Filtering**: Apply predefined filters and conditions
3. **Transformations**: Use expressions to modify data presentation
4. **Aggregations**: Group and summarize data for analysis
5. **Performance**: Optimize queries with row limits and indexing

## Field Configuration

SubsetDetail defines three types of field configurations that determine how data is accessed:

### Date Fields (`dates()`)

Configures temporal data access with filtering and dynamic date ranges:

```php
// Example SubsetDetailDate configuration
[
    'subset_column' => 'report_date',
    'field_id' => 1,
    'subset_field_name' => 'Report Date',
    'use_dynamic_date' => true,
    'dynamic_start_type' => 'current_date',
    'dynamic_start_offset' => -30,
    'dynamic_start_unit' => 'days',
    'dynamic_end_type' => 'current_date',
    'dynamic_end_offset' => 0,
    'dynamic_end_unit' => 'days'
]
```

**Features**:

- **Static Date Ranges**: Fixed start and end dates
- **Dynamic Date Ranges**: Relative to current date (last 30 days, this month, etc.)
- **Date Expressions**: Custom date formatting and calculations
- **Last Found Data**: Automatically use the latest available date

### Dimension Fields (`dimensions()`)

Configures categorical data access with filtering and hierarchical support:

```php
// Example SubsetDetailDimension configuration
[
    'subset_column' => 'office_name',
    'field_id' => 2,
    'subset_field_name' => 'Office Name',
    'filter_only' => false,
    'column_expression' => 'UPPER(office_name)',
    'hierarchy_id' => 1,
    'filters' => ['office_type' => 'regional']
]
```

**Features**:

- **Column Expressions**: Transform dimension values using SQL expressions
- **Hierarchy Integration**: Link to organizational hierarchies
- **Predefined Filters**: Apply default filter conditions
- **Filter-Only Mode**: Hide from output but use for filtering

### Measure Fields (`measures()`)

Configures numeric data access with aggregations and calculations:

```php
// Example SubsetDetailMeasure configuration
[
    'subset_column' => 'total_sales',
    'field_id' => 3,
    'subset_field_name' => 'Total Sales',
    'aggregation' => 'SUM',
    'expression' => 'sales_amount * exchange_rate',
    'weight_field_id' => 4,
    'sort_order' => 1
]
```

**Features**:

- **Aggregations**: SUM, AVG, COUNT, MIN, MAX operations
- **Expressions**: Custom calculations and transformations
- **Weighted Measures**: Apply weighting factors
- **Sorting**: Define default sort order

## Data Access Workflow

### 1. Subset Creation Process

```text
DataDetail (Source Table)
    ↓
Field Selection (Choose relevant fields)
    ↓
Field Configuration (Apply transformations/filters)
    ↓
SubsetDetail Creation (Define access layer)
    ↓
API Access (Data consumption via routes)
```

### 2. Query Execution Flow

```text
API Request → SubsetDataController
    ↓
GetSubsetData Service
    ↓
Apply Filters & Transformations
    ↓
Execute Query on Source Table
    ↓
Return Formatted Results
```

### 3. Data Retrieval Process

When data is requested through the `SubsetDataController`:

1. **Filter Application**: Apply request filters and subset-defined filters
2. **Field Selection**: Select only configured subset fields
3. **Expression Evaluation**: Execute field expressions and transformations
4. **Aggregation**: Apply grouping and aggregation if configured
5. **Limit Application**: Apply max_rows_to_fetch limitation
6. **Result Formatting**: Return structured JSON response

## Relationships

### Source Data (`dataDetail()`)

```php
/**
 * @return HasOne<DataDetail, $this>
 */
public function dataDetail(): HasOne
{
    return $this->hasOne(DataDetail::class, 'id', 'data_detail_id');
}
```

- **Type**: HasOne relationship
- **Purpose**: Links to the source data table
- **Foreign Key**: `data_detail_id`

### Field Relationship Details

#### Date Field Relationships (`dates()`)

```php
/**
 * @return HasMany<SubsetDetailDate, $this>
 */
public function dates(): HasMany
{
    return $this->hasMany(SubsetDetailDate::class, 'subset_detail_id', 'id');
}
```

#### Dimension Field Relationships (`dimensions()`)

```php
/**
 * @return HasMany<SubsetDetailDimension, $this>
 */
public function dimensions(): HasMany
{
    return $this->hasMany(SubsetDetailDimension::class, 'subset_detail_id', 'id');
}
```

#### Measure Field Relationships (`measures()`)

```php
/**
 * @return HasMany<SubsetDetailMeasure, $this>
 */
public function measures(): HasMany
{
    return $this->hasMany(SubsetDetailMeasure::class, 'subset_detail_id', 'id');
}
```

## API Integration

### Primary Access Route

**Controller**: `SubsetDataController`
**Route**: `/api/subset/{subsetDetail}/data`
**Method**: GET

### Request Parameters

```php
// Example API request
GET /api/subset/123/data?office_name=Regional&latest=report_date&limit=100
```

**Common Parameters**:

- **Field Filters**: Any dimension or measure field can be used as a filter
- **latest**: Automatically use the maximum value of a specified date field
- **limit**: Override the default max_rows_to_fetch
- **fields**: Comma-separated list of specific fields to return

### Response Format

```json
{
    "data": [
        {
            "report_date": "2025-08-06",
            "office_name": "Regional Office A",
            "total_sales": 150000.00,
            "customer_count": 45
        }
    ],
    "latest_value": "2025-08-06"
}
```

## Usage Examples

### Creating a Sales Subset

```php
// Create subset for monthly sales data
$subset = SubsetDetail::create([
    'name' => 'Monthly Sales Summary',
    'description' => 'Aggregated monthly sales by office',
    'data_detail_id' => $salesTable->id,
    'type' => 'rollup_subset',
    'group_data' => true,
    'max_rows_to_fetch' => 1000,
]);

// Configure date field for monthly grouping
$subset->dates()->create([
    'field_id' => $dateField->id,
    'subset_column' => 'month_year',
    'subset_field_name' => 'Month',
    'date_field_expression' => 'DATE_FORMAT(sale_date, "%Y-%m")',
    'use_dynamic_date' => true,
    'dynamic_start_offset' => -12,
    'dynamic_start_unit' => 'months'
]);

// Configure dimension for office grouping
$subset->dimensions()->create([
    'field_id' => $officeField->id,
    'subset_column' => 'office_name',
    'subset_field_name' => 'Office',
    'hierarchy_id' => $officeHierarchy->id
]);

// Configure measure for sales aggregation
$subset->measures()->create([
    'field_id' => $salesField->id,
    'subset_column' => 'total_sales',
    'subset_field_name' => 'Total Sales',
    'aggregation' => 'SUM',
    'sort_order' => 1
]);
```

### Accessing Subset Data

```php
// Via controller (typical API usage)
$controller = new SubsetDataController();
$response = $controller($subset, $getSubsetData, $findMaxValue, $request);

// Direct service usage
$data = $getSubsetData
    ->setFilters(['office_name' => 'Regional'])
    ->withSummary(true)
    ->withSubsetDetail($subset->id)
    ->getQuery()
    ->get();
```

### Frontend Integration

```typescript
// TypeScript interface for subset data
interface SubsetResponse {
    data: Array<{
        [key: string]: string | number | null;
    }>;
    latest_value?: string | number;
}

// API call example
const fetchSubsetData = async (subsetId: number, filters: Record<string, any>) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/subset/${subsetId}/data?${params}`);
    return response.json() as Promise<SubsetResponse>;
};
```

## Advanced Features

### Dynamic Date Filtering

```php
// Last 30 days from current date
'use_dynamic_date' => true,
'dynamic_start_type' => 'current_date',
'dynamic_start_offset' => -30,
'dynamic_start_unit' => 'days',
'dynamic_end_type' => 'current_date',
'dynamic_end_offset' => 0,
'dynamic_end_unit' => 'days'
```

### Column Expressions

```php
// Transform data using SQL expressions
'column_expression' => 'CONCAT(first_name, " ", last_name)',
'column_expression' => 'ROUND(sales_amount / target_amount * 100, 2)',
'column_expression' => 'CASE WHEN status = "active" THEN 1 ELSE 0 END'
```

### Hierarchical Filtering

```php
// Use organizational hierarchies for filtering
'hierarchy_id' => $regionHierarchy->id,
'filters' => [
    'region' => 'North',
    'department' => 'Sales'
]
```

### AI Integration

```php
// Configure for AI training and insights
'use_for_training_ai' => true,
'proactive_insight_instructions' => 'Focus on sales trends and seasonal patterns',
'visualization_instructions' => 'Use line charts for trends, bar charts for comparisons'
```

## Subset Types

### Office Level (`office_level`)

- Filters data to office-specific records
- Applies user's office context automatically
- Ideal for operational dashboards

### Rollup Subset (`rollup_subset`)

- Aggregates data across multiple dimensions
- Groups data for summary reporting
- Suitable for executive dashboards

### Composite Subset (`composite_subset`)

- Combines multiple data sources
- Supports complex business logic
- Used for advanced analytics

## Performance Considerations

### Query Optimization

1. **Row Limits**: Use `max_rows_to_fetch` to prevent large result sets
2. **Index Strategy**: Ensure filtered fields are properly indexed
3. **Expression Caching**: Cache results of complex expressions
4. **Pagination**: Implement pagination for large datasets

### Best Practices

1. **Field Selection**: Only include necessary fields in the subset
2. **Filter Efficiency**: Place most selective filters first
3. **Aggregation Strategy**: Group data at the appropriate level
4. **Monitoring**: Track query performance and adjust as needed

## Integration Points

- **Dashboards**: Primary data source for analytical dashboards
- **Reports**: Provides filtered data for reporting systems
- **APIs**: REST endpoints for external system integration
- **Export Functions**: Bulk data export capabilities
- **Real-time Updates**: Live data feeds for monitoring systems

## Troubleshooting

### Common Issues

1. **Empty Results**: Check filter configurations and date ranges
2. **Performance Problems**: Review field expressions and aggregations
3. **Data Inconsistencies**: Validate source table relationships
4. **Permission Errors**: Verify user access to underlying data tables

### Debugging Tools

- **Query Logging**: Enable SQL query logging for analysis
- **Field Validation**: Test field expressions independently
- **Filter Testing**: Verify filter logic with known data
- **Performance Profiling**: Monitor query execution times
