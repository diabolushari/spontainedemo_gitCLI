<?php

require_once 'vendor/autoload.php';

use App\Http\Requests\DataLoader\FieldMappingData;
use App\Services\DataLoader\JsonStructure\PerformJSONProcessing;

// Create test data - flattened JSON response
$flattenedData = [
    [
        'response.data.id' => 1,
        'response.data.name' => 'John Doe',
        'response.data.email' => 'john@example.com',
        'response.data.created_at' => '2023-01-01',
    ],
    [
        'response.data.id' => 2,
        'response.data.name' => 'Jane Smith',
        'response.data.email' => 'jane@example.com',
        'response.data.created_at' => '2023-01-02',
    ],
];

// Create field mapping configuration
$fieldMapping = [
    new FieldMappingData(
        column: 'user_id',
        fieldName: 'User ID',
        fieldType: 'dimension',
        jsonFieldPath: 'response.data.id',
        dateFormat: null
    ),
    new FieldMappingData(
        column: 'full_name',
        fieldName: 'Full Name',
        fieldType: 'text',
        jsonFieldPath: 'response.data.name',
        dateFormat: null
    ),
    new FieldMappingData(
        column: 'email_address',
        fieldName: 'Email Address',
        fieldType: 'text',
        jsonFieldPath: 'response.data.email',
        dateFormat: null
    ),
    new FieldMappingData(
        column: 'signup_date',
        fieldName: 'Signup Date',
        fieldType: 'date',
        jsonFieldPath: 'response.data.created_at',
        dateFormat: 'Y-m-d'
    ),
];

// Test the field mapping
$performFieldMapping = new PerformJSONProcessing;
$result = $performFieldMapping->handle($flattenedData, $fieldMapping);

echo "Original flattened data:\n";
print_r($flattenedData);

echo "\nMapped data:\n";
print_r($result);

echo "\nExpected result: JSON field paths should be replaced with data table column names\n";
