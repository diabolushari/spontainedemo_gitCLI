# Loader APIs Module Documentation

## Table of Contents

- [Purpose](#purpose)
- [Overview](#overview)
- [Features](#features)
- [Module Components](#module-components)
- [API Endpoints](#api-endpoints)
- [Data Structure](#data-structure)
- [Usage Examples](#usage-examples)

## Purpose

The Loader APIs module is designed to create and manage definitions for JSON APIs that serve as external data sources
for DataDetail tables (data tables) in the KSEB Analytics platform. This module enables the platform to:

- Define external JSON API endpoints as reusable data sources for data tables
- Configure API authentication headers and request parameters
- Map JSON response structures for consistent data consumption
- Provide a unified interface for accessing diverse external data sources
- Enable scheduled data loading from external APIs into DataDetail tables, which then provide data for dashboard
  visualization and API consumption by other systems

## Data Flow Architecture

The Loader APIs module follows a structured data flow pattern:

1. **API Configuration**: Administrators define external JSON API endpoints using the Loader APIs module
2. **Job Scheduling**: DataLoaderJobs are configured to use these APIs as data sources, with scheduled execution times
3. **Data Extraction**: Jobs fetch data from external APIs according to the defined schedule
4. **Data Transformation**: API responses are mapped to DataDetail table schemas using the response structure
   definitions
5. **Data Storage**: Transformed data is stored in DataDetail tables (data tables)
6. **Data Consumption**: DataDetail tables serve two purposes:
    - Provide data for dashboard visualization and analytics
    - Expose APIs for consumption by other external systems

This architecture ensures data consistency, enables scheduled data updates, and provides a reliable foundation for both
internal dashboards and external integrations.

## Overview

The Loader APIs module acts as a bridge between external JSON APIs and DataDetail tables (data tables) in the analytics
platform. It allows administrators to configure external API endpoints once and reuse them across multiple data loading
jobs that populate DataDetail tables. These data tables then serve as the foundation for dashboard components and
provide APIs for consumption by other systems, ensuring consistent data access patterns and reducing configuration
overhead.

## Features

### 1. API Definition Management

- **Create API Definitions**: Define new external JSON API endpoints with complete configuration
- **Edit Configurations**: Modify existing API definitions including URLs, methods, headers, and response structures
- **Delete APIs**: Remove outdated or unused API definitions
- **View Details**: Display comprehensive information about configured APIs

### 2. HTTP Method Support

- **GET Requests**: Support for retrieving data from external APIs
- **POST Requests**: Support for APIs requiring data submission for response

### 3. Authentication & Headers Configuration

- **Custom Headers**: Configure authentication headers (API keys, Bearer tokens, etc.) with intelligent autocomplete
  suggestions
- **Header Suggestions**: Built-in suggestions for common HTTP headers including:
    - Authorization headers (Bearer, Basic, API-Key, Token)
    - Content-Type options (application/json, application/xml, etc.)
    - Accept headers for response format specification
    - User-Agent strings for client identification
    - API-specific headers (X-API-Key, X-RapidAPI-Key, etc.)
    - Caching and encoding headers (Cache-Control, Accept-Encoding)
    - CORS and security headers
- **Value Suggestions**: Context-aware value suggestions based on selected header keys
- **Dynamic Header Values**: Support for key-value pair header configuration
- **Request Body Parameters**: Configure POST request body parameters with helpful placeholders

### 4. Response Structure Mapping

- **JSON Structure Definition**: Define the expected structure of API responses using a hierarchical tree interface
- **Data Type Mapping**: Map response fields to specific JSON data types (primitive, object, array, primitive-array)
- **Nested Object Support**: Handle complex nested JSON structures with unlimited nesting levels
- **Primary Field Selection**: Designate primary fields that contain the main data content
- **Interactive Field Management**: Add, remove, and modify field definitions dynamically
- **DataDetail Integration**: Map response structures to DataDetail table schema for efficient data storage

### 7. Data Loading & Testing

- **Smart Autocomplete**: Intelligent header name and value suggestions reduce typing errors and improve configuration
  speed
- **Contextual Help**: Descriptions for common HTTP headers help users understand their purpose
- **Keyboard Navigation**: Full keyboard support for navigating through suggestions (Arrow keys, Enter, Escape)
- **Responsive Design**: Optimized interface that works across different screen sizes
- **Accessibility Features**: Proper ARIA labels and keyboard interactions for screen readers
- **Real-time Validation**: Immediate feedback on header configuration errors
- **Scheduled Data Loading**: Configure DataLoaderJobs to fetch data from APIs and populate DataDetail tables on
  scheduled intervals
- **Response Preview**: Preview up to 10 sample records from API responses during configuration
- **Error Handling**: Comprehensive error reporting for failed API calls and data loading operations
- **Connection Testing**: Validate API configurations before saving
- **Data Table Integration**: Seamless integration with DataDetail tables for structured data storage

## Module Components

### 1. Controller Layer

- **DataLoaderAPIController**: Handles CRUD operations for API definitions
- **DataLoaderAPIDataController**: Manages data fetching from configured APIs

### 2. Model Layer

- **LoaderAPI Model**: Represents API configuration with properties:
    - `name`: Human-readable API identifier
    - `description`: Detailed description of the API purpose
    - `url`: Complete API endpoint URL
    - `method`: HTTP method (GET/POST)
    - `headers`: Array of request headers
    - `body`: Array of request body parameters (for POST)
    - `response_structure`: JSON structure definition for response mapping

### 3. Request Validation

- **DataLoaderAPIFormRequest**: Validates API configuration data
- **DataLoaderAPISearchRequest**: Handles search and filtering parameters

### 4. Service Layer

- **DataLoaderFactory**: Creates appropriate data fetchers based on source type
- **DataLoaderSource**: Abstracts data source configurations

## API Endpoints

### Resource Routes (loader-apis)

| Method    | Endpoint                 | Action  | Purpose                                  |
|-----------|--------------------------|---------|------------------------------------------|
| GET       | `/loader-apis`           | index   | List all configured APIs with pagination |
| GET       | `/loader-apis/create`    | create  | Display API creation form                |
| POST      | `/loader-apis`           | store   | Save new API configuration               |
| GET       | `/loader-apis/{id}`      | show    | Display specific API details             |
| GET       | `/loader-apis/{id}/edit` | edit    | Display API editing form                 |
| PUT/PATCH | `/loader-apis/{id}`      | update  | Update existing API configuration        |
| DELETE    | `/loader-apis/{id}`      | destroy | Delete API configuration                 |

### Data Fetching Route

| Method | Endpoint                            | Purpose                        |
|--------|-------------------------------------|--------------------------------|
| GET    | `/loader-json-api-data/{loaderAPI}` | Fetch data from configured API |

## Data Structure

### API Configuration Schema

```json
{
  "name": "string (max: 255)",
  "description": "string (max: 2000, nullable)",
  "method": "string (GET|POST)",
  "url": "string (max: 2000)",
  "headers": [
    {
      "key": "string",
      "value": "string|null"
    }
  ],
  "body": [
    {
      "key": "string",
      "value": "string|null"
    }
  ],
  "response_structure": {
    // JsonStructureDefinition object (see detailed schema below)
  }
}
```

### Response Structure Definition Schema

The `response_structure` field uses a hierarchical tree structure to define the expected JSON response format:

```json
{
  "id": "number (unique identifier)",
  "field_name": "string (field name in JSON response)",
  "field_type": "string (array|object|primitive|primitive-array)",
  "primary_field": "boolean (marks field as primary identifier)",
  "children": [
    // Array of nested JSONDefinition objects for complex structures
  ]
}
```

#### Field Types Explained

- **`array`**: Array of Objects - Contains multiple objects with the same structure
- **`object`**: Single Object - Contains nested fields/properties
- **`primitive`**: Primitive Value - Simple data types (string, number, boolean, null)
- **`primitive-array`**: Array of Primitives - Array containing simple data types

#### Response Field Types

The response level of the response structure can only be:

- **`array`**: When the API returns an array of objects
- **`object`**: When the API returns a single object

#### Primary Fields

- Primary fields are marked with `primary_field: true`
- Used to identify fields that contain the main data content from API responses
- Multiple fields can be designated as primary
- Helps distinguish between metadata (like status, messages) and actual data content
- Essential for data extraction and processing in DataDetail tables

### Data Fetching Response Schema

```json
{
  "error": false,
  "errorMessage": "Query executed successfully, X records found.",
  "result": [
    // Array of up to 10 sample records from the API
  ]
}
```

## Usage Examples

### 1. Creating a Weather API Configuration

```php
// Example configuration for a weather API
[
    'name' => 'Weather Data API',
    'description' => 'External weather service for regional climate data',
    'method' => 'GET',
    'url' => 'https://api.weather.com/v1/current',
    'headers' => [
        ['key' => 'Authorization', 'value' => 'Bearer YOUR_API_KEY'],
        ['key' => 'Content-Type', 'value' => 'application/json']
    ],
    'body' => [], // Empty for GET request
    'response_structure' => [
        'id' => 1,
        'field_name' => 'response',
        'field_type' => 'object',
        'primary_field' => false,
        'children' => [
            [
                'id' => 2,
                'field_name' => 'location',
                'field_type' => 'object',
                'primary_field' => true,
                'children' => [
                    [
                        'id' => 3,
                        'field_name' => 'city',
                        'field_type' => 'primitive',
                        'primary_field' => false,
                        'children' => []
                    ],
                    [
                        'id' => 4,
                        'field_name' => 'coordinates',
                        'field_type' => 'primitive-array',
                        'primary_field' => false,
                        'children' => []
                    ]
                ]
            ],
            [
                'id' => 5,
                'field_name' => 'temperature',
                'field_type' => 'primitive',
                'primary_field' => true,
                'children' => []
            ],
            [
                'id' => 6,
                'field_name' => 'forecast',
                'field_type' => 'array',
                'primary_field' => false,
                'children' => [
                    [
                        'id' => 7,
                        'field_name' => 'day',
                        'field_type' => 'primitive',
                        'primary_field' => false,
                        'children' => []
                    ],
                    [
                        'id' => 8,
                        'field_name' => 'temp_high',
                        'field_type' => 'primitive',
                        'primary_field' => false,
                        'children' => []
                    ]
                ]
            ]
        ]
    ]
]
```

### 2. Creating a POST API Configuration

```php
// Example configuration for a data submission API
[
    'name' => 'Energy Consumption API',
    'description' => 'Submit meter readings and get consumption analysis',
    'method' => 'POST',
    'url' => 'https://api.energy.com/v2/consumption',
    'headers' => [
        ['key' => 'X-API-Key', 'value' => 'YOUR_API_KEY']
    ],
    'body' => [
        ['key' => 'meter_id', 'value' => 'required'],
        ['key' => 'date_range', 'value' => 'last_30_days']
    ],
    'response_structure' => [
        'id' => 1,
        'field_name' => 'response',
        'field_type' => 'array',
        'primary_field' => false,
        'children' => [
            [
                'id' => 2,
                'field_name' => 'meter_id',
                'field_type' => 'primitive',
                'primary_field' => true,
                'children' => []
            ],
            [
                'id' => 3,
                'field_name' => 'consumption_data',
                'field_type' => 'object',
                'primary_field' => false,
                'children' => [
                    [
                        'id' => 4,
                        'field_name' => 'daily_usage',
                        'field_type' => 'primitive-array',
                        'primary_field' => false,
                        'children' => []
                    ],
                    [
                        'id' => 5,
                        'field_name' => 'total_consumption',
                        'field_type' => 'primitive',
                        'primary_field' => true,
                        'children' => []
                    ]
                ]
            ]
        ]
    ]
]
```

### 3. Response Structure Field Type Examples

#### Example JSON Response for Weather API:

```json
{
  "location": {
    "city": "Thiruvananthapuram",
    "coordinates": [8.5241, 76.9366]
  },
  "temperature": 28.5,
  "forecast": [
    {
      "day": "Monday",
      "temp_high": 32
    },
    {
      "day": "Tuesday",
      "temp_high": 30
    }
  ]
}
```

#### Field Type Mapping:

- `location` → **object** (contains nested fields)
- `city` → **primitive** (string value)
- `coordinates` → **primitive-array** (array of numbers)
- `temperature` → **primitive** (number value)
- `forecast` → **array** (array of objects)
- `day` → **primitive** (string in forecast objects)
- `temp_high` → **primitive** (number in forecast objects)

---
