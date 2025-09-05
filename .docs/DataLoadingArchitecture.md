# Data Loading Architecture Documentation

## Overview

This document explains the data loading ecosystem that works with DataDetail to populate dynamically created database tables in the KSEB Analytics system.

## Components

### 1. DataDetail - Table Definition

The `DataDetail` model serves as the central configuration for:

- **Table Structure**: Defines the schema and field types
- **Metadata**: Stores table name, description, and business context
- **Relationships**: Links to field definitions and data loading jobs

### 2. DataLoaderJob - Orchestration Engine

The `DataLoaderJob` model manages the automated data loading process:

#### Key Features

- **Scheduling**: Supports various cron patterns (daily, weekly, monthly, custom)
- **Data Sources**: Can fetch from APIs or database queries
- **Field Mapping**: Maps source data fields to target table columns
- **Job Dependencies**: Supports predecessor jobs for sequential execution
- **Status Tracking**: Monitors execution history and outcomes

#### Configuration Options

```php
'cron_type' => 'daily|weekly|monthly|custom',
'source_type' => 'api|query',
'delete_existing_data' => true|false,
'duplicate_identification_field' => 'field_name'
```

### 3. Data Sources

#### LoaderAPI - External API Integration

Fetches data from REST APIs with configurable:

- **HTTP Methods**: GET, POST, PUT, DELETE
- **Headers**: Authentication tokens, content types, custom headers
- **Request Body**: JSON payloads for POST/PUT requests
- **Response Structure**: Defines expected JSON response format

```php
'method' => 'GET|POST|PUT|DELETE',
'headers' => [
    ['key' => 'Authorization', 'value' => 'Bearer token'],
    ['key' => 'Content-Type', 'value' => 'application/json']
],
'body' => [
    ['key' => 'param1', 'value' => 'value1'],
    ['key' => 'param2', 'value' => 'value2']
]
```

#### DataLoaderQuery - Database Integration

Executes SQL queries against configured database connections:

- **Connection Management**: Links to predefined database connections
- **Query Execution**: Runs complex SQL with joins, aggregations, and filters
- **Data Transformation**: Applies business logic during extraction

## Data Flow Architecture

```text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   DataDetail    │    │  DataLoaderJob   │    │  Data Sources   │
│                 │    │                  │    │                 │
│ • Table Schema  │    │ • Scheduling     │    │ • LoaderAPI     │
│ • Field Types   │◄───┤ • Orchestration  │───►│ • DataLoaderQuery│
│ • Metadata      │    │ • Field Mapping  │    │ • Connections   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database Tables                              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Table 1   │  │   Table 2   │  │   Table N   │            │
│  │             │  │             │  │             │            │
│  │ • Date Fields│  │ • Dimension │  │ • Measure   │            │
│  │ • Dimensions │  │   Fields    │  │   Fields    │            │
│  │ • Measures   │  │ • Text      │  │ • Text      │            │
│  │ • Text Fields│  │   Fields    │  │   Fields    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Execution Workflow

### 1. Job Scheduling

```text
Cron Scheduler
    ↓
Check Active Jobs (start_date <= now <= end_date)
    ↓
Evaluate Cron Patterns
    ↓
Queue Eligible Jobs
```

### 2. Data Extraction

```text
DataLoaderJob Execution
    ↓
Identify Source Type (API or Query)
    ↓
┌─────────────────┬─────────────────┐
│   API Source    │  Query Source   │
│                 │                 │
│ • HTTP Request  │ • SQL Execution │
│ • Parse JSON    │ • Result Set    │
│ • Map Fields    │ • Data Transform│
└─────────────────┴─────────────────┘
    ↓
Apply Field Mapping
    ↓
Validate Data Types
    ↓
Insert/Update Target Table
```

### 3. Data Loading Strategies

#### Replace Strategy

```php
'delete_existing_data' => true
```

- Truncates target table before loading
- Ensures clean data state
- Suitable for full refreshes

#### Append Strategy

```php
'delete_existing_data' => false
```

- Adds new records to existing data
- Preserves historical information
- Requires duplicate handling

#### Upsert Strategy

```php
'duplicate_identification_field' => 'unique_key'
```

- Updates existing records, inserts new ones
- Prevents data duplication
- Maintains data integrity

## Field Mapping Configuration

Maps source data fields to target table columns:

```php
'field_mapping' => [
    'source_field_1' => 'target_column_1',
    'source_field_2' => 'target_column_2',
    'api.nested.field' => 'target_column_3'
]
```

### Mapping Rules

- **Direct Mapping**: Simple field-to-column mapping
- **Nested JSON**: Supports dot notation for nested API responses
- **Data Transformation**: Basic type conversion (string to number, date formatting)
- **Default Values**: Handles missing source fields

## Error Handling and Monitoring

### Job Status Tracking

The `DataLoaderJobStatus` model tracks:

- **Execution Start/End Times**
- **Success/Failure Status**
- **Error Messages and Stack Traces**
- **Record Counts (processed, inserted, updated, failed)**

### Monitoring Capabilities

```php
// Get latest job status
$job = DataLoaderJob::with('latest')->find($id);
$lastStatus = $job->latest->status;

// Get execution history
$statuses = $job->statuses()->take(10)->get();

// Check for failed jobs
$failedJobs = DataLoaderJob::whereHas('latest', function($query) {
    $query->where('status', 'failed');
})->get();
```

## Configuration Examples

### Daily API Data Load

```php
DataLoaderJob::create([
    'name' => 'Daily Customer API Sync',
    'description' => 'Syncs customer data from CRM API',
    'data_detail_id' => $customerTable->id,
    'source_type' => 'api',
    'api_id' => $crmApi->id,
    'cron_type' => 'daily',
    'schedule_time' => '02:00:00',
    'delete_existing_data' => false,
    'duplicate_identification_field' => 'customer_id',
    'field_mapping' => [
        'id' => 'customer_id',
        'name' => 'customer_name',
        'email' => 'email_address',
        'created_at' => 'registration_date'
    ]
]);
```

### Weekly Database Report

```php
DataLoaderJob::create([
    'name' => 'Weekly Sales Summary',
    'description' => 'Aggregated sales data for reporting',
    'data_detail_id' => $salesSummary->id,
    'source_type' => 'query',
    'query_id' => $salesQuery->id,
    'cron_type' => 'weekly',
    'day_of_week' => 1, // Monday
    'schedule_time' => '06:00:00',
    'delete_existing_data' => true,
    'field_mapping' => [
        'sale_date' => 'week_ending',
        'total_amount' => 'sales_total',
        'customer_count' => 'unique_customers'
    ]
]);
```

## Best Practices

### Performance Optimization

1. **Batch Processing**: Process large datasets in chunks
2. **Index Strategy**: Create appropriate indexes on target tables
3. **Connection Pooling**: Reuse database connections
4. **Memory Management**: Clear variables after processing large datasets

### Data Quality

1. **Validation Rules**: Implement field-level validation
2. **Error Logging**: Capture and store detailed error information
3. **Data Profiling**: Monitor data quality metrics
4. **Rollback Strategy**: Implement transaction rollback for critical failures

### Monitoring and Alerting

1. **Job Status Dashboard**: Real-time monitoring of job execution
2. **Failure Notifications**: Alert administrators of job failures
3. **Performance Metrics**: Track execution times and data volumes
4. **Health Checks**: Regular validation of data integrity

## Troubleshooting Guide

### Common Issues

#### Job Not Executing

- Check if job is within active date range
- Verify cron pattern configuration
- Ensure scheduler service is running

#### Data Not Loading

- Validate API endpoint accessibility
- Check database connection status
- Review field mapping configuration
- Examine error logs in job status

#### Performance Issues

- Analyze query execution plans
- Review data volume and batch sizes
- Check for missing indexes
- Monitor system resource usage

#### Data Quality Problems

- Validate source data format
- Check field mapping accuracy
- Review duplicate identification logic
- Implement data validation rules
