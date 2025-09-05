# SubsetDetail API Access Documentation

## Overview

This document explains how to access SubsetDetail data through the API layer, primarily through the `SubsetDataController`. The controller provides RESTful access to subset data with filtering, transformation, and optimization capabilities.

## Controller Overview

### SubsetDataController

**Location**: `app/Http/Controllers/Subset/SubsetDataController.php`

**Route**: `GET /api/subset/{subsetDetail}/data`

**Purpose**: Provides HTTP access to subset data with advanced filtering and latest value detection.

## Request Flow

```text
HTTP Request
    ↓
SubsetDataController::__invoke()
    ↓
┌─────────────────────┬─────────────────────┐
│   Filter Processing │  Latest Value Logic │
│                     │                     │
│ • Extract filters   │ • Find max value    │
│ • Apply conditions  │ • Set as filter     │
└─────────────────────┴─────────────────────┘
    ↓
GetSubsetData Service
    ↓
Query Execution & Results
    ↓
JSON Response
```

## Request Parameters

### Standard Filters

Any field defined in the subset can be used as a filter parameter:

```bash
# Filter by dimension fields
GET /api/subset/123/data?office_name=Regional&department=Sales

# Filter by measure fields (range filters)
GET /api/subset/123/data?total_sales_min=1000&total_sales_max=50000

# Filter by date fields
GET /api/subset/123/data?report_date=2025-08-01
```

### Special Parameters

#### `latest` Parameter

Automatically finds and uses the maximum value of a specified field:

```bash
# Use the latest date available
GET /api/subset/123/data?latest=report_date

# Use the latest value of any field
GET /api/subset/123/data?latest=transaction_id
```

**Implementation**:

```php
if ($request->filled('latest')) {
    $maxValue = $findMaxValue->findMaxValue($subsetDetail, $request->input('latest'));
    if ($maxValue != null && $maxValue->max_value != null) {
        $filters[$request->input('latest')] = $maxValue->max_value;
        $latestValue = $maxValue->max_value;
    }
}
```

#### Query Builder Options

```bash
# Exclude non-measurement fields from results
GET /api/subset/123/data?exclude_non_measurements=true

# Include summary calculations
GET /api/subset/123/data?summary=true

# Specify fields to return
GET /api/subset/123/data?fields=office_name,total_sales,report_date
```

## Response Format

### Standard Response

```json
{
    "data": [
        {
            "report_date": "2025-08-06",
            "office_name": "Regional Office A",
            "total_sales": 150000.00,
            "customer_count": 45,
            "growth_rate": 12.5
        },
        {
            "report_date": "2025-08-06",
            "office_name": "Regional Office B",
            "total_sales": 89000.00,
            "customer_count": 32,
            "growth_rate": 8.3
        }
    ],
    "latest_value": "2025-08-06"
}
```

### Response Properties

- **`data`**: Array of records matching the filters and subset configuration
- **`latest_value`**: The maximum value found when using the `latest` parameter (null if not used)

## Service Layer Integration

### GetSubsetData Service

The controller uses the `GetSubsetData` service for query building:

```php
$query = $getSubsetData
    ->setFilters($filters)           // Apply request filters
    ->withSummary(false)             // Disable summary mode
    ->excludeNonMeasurements(false)  // Include all field types
    ->withSubsetDetail($subsetDetail->id)  // Set subset context
    ->getQuery();                    // Build the query
```

### SubsetFindMaxValue Service

For the `latest` parameter functionality:

```php
$maxValue = $findMaxValue->findMaxValue($subsetDetail, $request->input('latest'));
```

**Features**:

- Finds maximum value in any subset field
- Handles date, numeric, and string fields
- Returns null if field not found or no data
- Applies subset filters when finding max value

## API Usage Examples

### Basic Data Retrieval

```javascript
// Fetch all data from a subset
const response = await fetch('/api/subset/123/data');
const result = await response.json();
console.log(result.data); // Array of records
```

### Filtered Data Retrieval

```javascript
// Fetch data with filters
const params = new URLSearchParams({
    office_name: 'Regional',
    department: 'Sales',
    report_date_min: '2025-01-01',
    report_date_max: '2025-12-31'
});

const response = await fetch(`/api/subset/123/data?${params}`);
const result = await response.json();
```

### Latest Value Usage

```javascript
// Get data for the latest available date
const response = await fetch('/api/subset/123/data?latest=report_date');
const result = await response.json();

console.log(result.latest_value); // "2025-08-06"
console.log(result.data); // Records for 2025-08-06 only
```

### TypeScript Integration

```typescript
interface SubsetDataResponse {
    data: Record<string, any>[];
    latest_value: string | number | null;
}

interface SubsetApiClient {
    fetchData(subsetId: number, filters?: Record<string, any>): Promise<SubsetDataResponse>;
    fetchLatest(subsetId: number, dateField: string): Promise<SubsetDataResponse>;
}

class SubsetService implements SubsetApiClient {
    async fetchData(subsetId: number, filters: Record<string, any> = {}): Promise<SubsetDataResponse> {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/subset/${subsetId}/data?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async fetchLatest(subsetId: number, dateField: string): Promise<SubsetDataResponse> {
        return this.fetchData(subsetId, { latest: dateField });
    }
}
```

## Error Handling

### Common Error Scenarios

#### Subset Not Found (404)

```json
{
    "message": "No query results for model [App\\Models\\Subset\\SubsetDetail] 123"
}
```

#### Invalid Filter Fields (400)

```json
{
    "message": "Invalid filter field: invalid_field_name",
    "errors": {
        "filter": ["Field 'invalid_field_name' is not available in this subset"]
    }
}
```

#### Database Errors (500)

```json
{
    "message": "Database query failed",
    "error": "SQLSTATE[42S22]: Column not found"
}
```

### Error Handling Best Practices

```javascript
async function fetchSubsetData(subsetId, filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/subset/${subsetId}/data?${params}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Subset not found');
            } else if (response.status === 400) {
                const error = await response.json();
                throw new Error(`Invalid request: ${error.message}`);
            } else {
                throw new Error(`Server error: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch subset data:', error);
        throw error;
    }
}
```

## Performance Optimization

### Query Optimization

1. **Use Specific Filters**: Apply filters to reduce data volume
2. **Field Selection**: Use the `fields` parameter to limit returned columns
3. **Row Limits**: Leverage subset's `max_rows_to_fetch` configuration
4. **Index Strategy**: Ensure filtered fields are indexed

### Caching Strategies

```javascript
class CachedSubsetService extends SubsetService {
    private cache = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    async fetchData(subsetId: number, filters: Record<string, any> = {}): Promise<SubsetDataResponse> {
        const cacheKey = `${subsetId}-${JSON.stringify(filters)}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }

        const data = await super.fetchData(subsetId, filters);
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });

        return data;
    }
}
```

## Advanced Usage Patterns

### Real-time Data Updates

```javascript
class RealtimeSubsetService extends SubsetService {
    async subscribeToUpdates(subsetId: number, callback: (data: SubsetDataResponse) => void) {
        // Poll for latest data
        const pollInterval = setInterval(async () => {
            try {
                const data = await this.fetchLatest(subsetId, 'updated_at');
                callback(data);
            } catch (error) {
                console.error('Failed to fetch updates:', error);
            }
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(pollInterval);
    }
}
```

### Batch Data Loading

```javascript
class BatchSubsetService extends SubsetService {
    async fetchMultipleSubsets(requests: Array<{subsetId: number, filters?: Record<string, any>}>): Promise<SubsetDataResponse[]> {
        const promises = requests.map(req =>
            this.fetchData(req.subsetId, req.filters)
        );

        return Promise.all(promises);
    }
}
```

### Export Integration

```javascript
class ExportSubsetService extends SubsetService {
    async exportToCsv(subsetId: number, filters: Record<string, any> = {}): Promise<Blob> {
        const data = await this.fetchData(subsetId, filters);

        // Convert to CSV format
        const csv = this.convertToCSV(data.data);
        return new Blob([csv], { type: 'text/csv' });
    }

    private convertToCSV(data: Record<string, any>[]): string {
        if (!data.length) return '';

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => `"${row[header] || ''}"`).join(',')
            )
        ].join('\n');

        return csvContent;
    }
}
```

## Integration with Frontend Frameworks

### React Integration

```tsx
import { useState, useEffect } from 'react';

function useSubsetData(subsetId: number, filters: Record<string, any> = {}) {
    const [data, setData] = useState<SubsetDataResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const result = await subsetService.fetchData(subsetId, filters);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [subsetId, JSON.stringify(filters)]);

    return { data, loading, error };
}

// Usage in component
function SalesReport({ subsetId }: { subsetId: number }) {
    const { data, loading, error } = useSubsetData(subsetId, {
        latest: 'report_date'
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No data available</div>;

    return (
        <div>
            <h2>Sales Report - {data.latest_value}</h2>
            <table>
                <thead>
                    <tr>
                        {data.data.length > 0 && Object.keys(data.data[0]).map(key => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex}>{String(value)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

## Testing

### Unit Testing

```php
// Test for SubsetDataController
public function test_subset_data_controller_returns_data()
{
    $subset = SubsetDetail::factory()->create();
    $response = $this->get("/api/subset/{$subset->id}/data");

    $response->assertOk()
            ->assertJsonStructure([
                'data' => [],
                'latest_value'
            ]);
}

public function test_latest_parameter_functionality()
{
    $subset = SubsetDetail::factory()->create();
    $response = $this->get("/api/subset/{$subset->id}/data?latest=report_date");

    $response->assertOk();
    $data = $response->json();
    $this->assertNotNull($data['latest_value']);
}
```

### Integration Testing

```javascript
describe('SubsetDataController API', () => {
    test('fetches subset data successfully', async () => {
        const response = await fetch('/api/subset/123/data');
        const data = await response.json();

        expect(response.ok).toBe(true);
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('latest_value');
        expect(Array.isArray(data.data)).toBe(true);
    });

    test('applies filters correctly', async () => {
        const response = await fetch('/api/subset/123/data?office_name=Regional');
        const data = await response.json();

        expect(data.data.every(row => row.office_name === 'Regional')).toBe(true);
    });

    test('latest parameter works correctly', async () => {
        const response = await fetch('/api/subset/123/data?latest=report_date');
        const data = await response.json();

        expect(data.latest_value).toBeDefined();
        if (data.data.length > 0) {
            expect(data.data.every(row => row.report_date === data.latest_value)).toBe(true);
        }
    });
});
```

This comprehensive API documentation provides developers with everything they need to effectively integrate with the SubsetDetail data access layer.
