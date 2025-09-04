# DataDetail Model Documentation

## Overview

The `DataDetail` model is a core component of the KSEB Analytics system that manages the creation and configuration of data tables through the user interface. It serves as the blueprint for dynamic database table creation and defines the structure and metadata for data storage.

## Table of Contents

- [Model Structure](#model-structure)
- [Database Table Creation](#database-table-creation)
- [Data Loading Process](#data-loading-process)
- [Field Types](#field-types)
- [Relationships](#relationships)
- [Usage Examples](#usage-examples)

## Model Structure

### Location

`app/Models/DataDetail/DataDetail.php`

### Key Properties

```php
protected $fillable = [
    'name',           // Human-readable name for the data table
    'description',    // Optional description of the data table purpose
    'subject_area',   // Subject area classification (deprecated, use subject_area_id)
    'is_active',      // Boolean flag to enable/disable the data table
    'table_name',     // Actual database table name that will be created
    'created_by',     // User ID who created this data detail
    'updated_by',     // User ID who last updated this data detail
];
```

### Features

- **Soft Deletes**: Uses Laravel's `SoftDeletes` trait for safe record removal
- **Dynamic Table Creation**: Creates corresponding database tables automatically
- **Field Management**: Supports multiple field types for flexible data structure
- **Integration Ready**: Seamlessly integrates with data loading jobs

## Database Table Creation

When a `DataDetail` record is created through the UI:

1. **Table Generation**: A corresponding database table is automatically created using the `table_name` field
2. **Field Structure**: The table structure is defined by the associated field models:
   - Date fields (`DataTableDate`)
   - Dimension fields (`DataTableDimension`)
   - Measure fields (`DataTableMeasure`)
   - Text fields (`DataTableText`)
3. **Dynamic Schema**: The table schema adapts based on the field definitions

## Data Loading Process

Data is populated into the created tables through the **DataLoaderJob** system:

### Data Sources

#### 1. API Sources (`LoaderAPI`)

- Fetches data from external REST APIs
- Configurable HTTP methods, headers, and request bodies
- Supports JSON response parsing

#### 2. Database Query Sources (`DataLoaderQuery`)

- Executes SQL queries against configured database connections
- Supports complex data transformations
- Enables data aggregation and filtering

### Loading Workflow

```text
DataDetail (Table Definition)
    ↓
DataLoaderJob (Scheduling & Execution)
    ↓
LoaderAPI OR DataLoaderQuery (Data Source)
    ↓
Database Table (Data Storage)
```

## Field Types

### Date Fields (`dateFields()`)

- Stores temporal data
- Supports various date formats
- Used for time-series analysis

### Dimension Fields (`dimensionFields()`)

- Categorical data for grouping and filtering
- Supports hierarchical relationships
- Essential for OLAP operations

### Measure Fields (`measureFields()`)

- Numeric data for calculations and aggregations
- Supports various data types (integer, decimal, etc.)
- Used in analytical computations

### Text Fields (`textFields()`)

- Free-form text data
- Supports various string lengths
- Used for descriptive information

### ~~Relation Fields~~ (Deprecated)

The `relationFields()` method exists but is **not currently used** in the system. This functionality may be implemented in future versions.

## Relationships

### Subject Area (`subjectArea()`)

- **Type**: BelongsTo relationship
- **Purpose**: Categorizes data tables by business domain
- **Foreign Key**: `subject_area_id`

### Data Loader Jobs (`jobs()`)

- **Type**: HasMany relationship
- **Purpose**: Links to scheduled data loading operations
- **Foreign Key**: `data_detail_id`

### Field Relationships

All field types maintain HasMany relationships with DataDetail:

- `dateFields()` → `DataTableDate`
- `dimensionFields()` → `DataTableDimension`
- `measureFields()` → `DataTableMeasure`
- `textFields()` → `DataTableText`

## Usage Examples

### Creating a Data Detail

```php
$dataDetail = DataDetail::create([
    'name' => 'Customer Sales Data',
    'description' => 'Monthly customer sales information',
    'table_name' => 'customer_sales_monthly',
    'subject_area_id' => 1,
    'is_active' => true,
    'created_by' => auth()->id(),
]);
```

### Adding Field Definitions

```php
// Add a date field
$dataDetail->dateFields()->create([
    'field_name' => 'sale_date',
    'field_label' => 'Sale Date',
    'is_required' => true,
]);

// Add a measure field
$dataDetail->measureFields()->create([
    'field_name' => 'amount',
    'field_label' => 'Sale Amount',
    'data_type' => 'decimal',
    'precision' => 10,
    'scale' => 2,
]);

// Add a dimension field
$dataDetail->dimensionFields()->create([
    'field_name' => 'customer_id',
    'field_label' => 'Customer ID',
    'data_type' => 'integer',
]);
```

### Setting Up Data Loading

```php
// Create a data loader job
$job = DataLoaderJob::create([
    'name' => 'Daily Customer Sales Load',
    'data_detail_id' => $dataDetail->id,
    'source_type' => 'api', // or 'query'
    'api_id' => $apiConfig->id, // or query_id for database sources
    'cron_type' => 'daily',
    'schedule_time' => '02:00:00',
]);
```

### Querying Data

```php
// Get active data details
$activeDataDetails = DataDetail::where('is_active', true)->get();

// Get data detail with all fields
$dataDetailWithFields = DataDetail::with([
    'dateFields',
    'dimensionFields',
    'measureFields',
    'textFields'
])->find($id);

// Get data detail with associated jobs
$dataDetailWithJobs = DataDetail::with('jobs.latest')->find($id);
```

## Best Practices

1. **Naming Convention**: Use descriptive and consistent table names
2. **Field Planning**: Define all required fields before creating the data detail
3. **Data Validation**: Ensure data sources match the defined field structure
4. **Performance**: Consider indexing strategy for frequently queried fields
5. **Monitoring**: Regularly check data loader job statuses for data quality

## Integration Points

- **UI Layer**: Admin interface for creating and managing data details
- **Scheduler**: Automated data loading through cron jobs
- **Analytics**: Data consumption by reporting and visualization tools
- **API**: REST endpoints for programmatic access

## Future Enhancements

- Implementation of relation fields for foreign key relationships
- Advanced field validation rules
- Data lineage tracking
- Automated data quality checks
