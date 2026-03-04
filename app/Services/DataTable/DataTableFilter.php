<?php

declare(strict_types=1);

namespace App\Services\DataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DataTableFilter
{
    /**
     * Applies filters to the query based on request params, with improved validation and alignment to frontend operators.
     */
    public function apply(Builder $query, Request $request, DataDetail $dataDetail): void
    {
        // Get all valid fields (expanded to include textFields for 'string' type)
        $validDimensions = $dataDetail->dimensionFields->pluck('column')->toArray();
        $validDates = $dataDetail->dateFields->where('temporal_type', 'date')->pluck('column')->toArray();
        $validDateTimes = $dataDetail->dateFields->where('temporal_type', 'datetime')->pluck('column')->toArray();
        $validMeasures = $dataDetail->measureFields->pluck('column')->toArray();
        $validText = $dataDetail->textFields->pluck('column')->toArray(); // Added for 'string' type

        // Add other field types as needed (e.g., relationFields)

        // Loop over all query params (flat, like 'section_code_not' => 'val')
        foreach ($request->query() as $key => $value) {
            $value = trim((string) $value); // Ensure string and trim
            if (empty($value)) {
                continue; // Skip empty values
            }

            // Improved regex to handle '=' and longer suffixes like '_greater_than'
            preg_match('/^([a-zA-Z0-9_]+)([_=][a-z_]+)?$/', $key, $matches);
            if (count($matches) < 2) {
                continue; // Invalid key format
            }

            $field = $matches[1];
            $operatorSuffix = $matches[2] ?? ''; // e.g., '_not', '=', '_greater_than'

            // Normalize '=' or empty to imply exact match
            if ($operatorSuffix === '' || $operatorSuffix === '=') {
                $operatorSuffix = '='; // Standardized for validation and switch
            }

            // Determine field type based on valid lists (mirrors frontend types)
            $type = null;
            if (in_array($field, $validDates)) {
                $type = 'date';
            } elseif (in_array($field, $validDateTimes)) {
                $type = 'datetime';
            } elseif (in_array($field, $validDimensions)) {
                $type = 'dimension';
            } elseif (in_array($field, $validText)) {
                $type = 'string';
            } elseif (in_array($field, $validMeasures)) {
                $type = 'number';
            } // Add 'office' handling if you have a validOffice list, e.g., $type = 'office';

            // Validate field existence (skip invalid)
            if ($type === null) {
                continue;
            }

            // Get allowed operators for this type (mirrors your frontend availableOperators)
            $allowedOperators = $this->getAllowedOperators($type);

            // Validate operator (improved: only allow what's defined per type)
            if (! in_array($operatorSuffix, $allowedOperators)) {
                Log::warning("Invalid operator '{$operatorSuffix}' for field '{$field}' of type '{$type}'"); // Optional logging

                continue;
            }

            // Determine if it's a dimension (joined) or raw column
            $isDimension = $type === 'dimension'; // Adjust if needed for other types
            $column = $isDimension ? "{$field}_record.name" : "{$dataDetail->table_name}.{$field}";

            // Handle operators (updated to match frontend suffixes and add date range support)
            switch ($operatorSuffix) {
                case '=': // Exact match (=) - for all types
                    $query->where($column, '=', $value);
                    break;
                case '_not': // Not equal (!=) - for date, dimension, string, number
                    $query->where($column, '!=', $value);
                    break;
                case '_from': // >= (for date ranges)
                    $query->where($column, '>=', $value);
                    break;
                case '_to': // <= (for date ranges)
                    $query->where($column, '<=', $value);
                    break;
                case '_greater_than': // > (for numbers/measures)
                    $query->where($column, '>', $value);
                    break;
                case '_greater_than_or_equal': // >= (for numbers/measures)
                    $query->where($column, '>=', $value);
                    break;
                case '_less_than': // < (for numbers/measures)
                    $query->where($column, '<', $value);
                    break;
                case '_less_than_or_equal': // <= (for numbers/measures)
                    $query->where($column, '<=', $value);
                    break;

                    // Retained from original (optional; add to frontend if needed)
                case '_in': // IN (e.g., for dimensions/strings)
                    $values = explode(',', $value);
                    $query->whereIn($column, $values);
                    break;
                case '_not_in': // NOT IN
                    $values = explode(',', $value);
                    $query->whereNotIn($column, $values);
                    break;
                case '_like': // LIKE %value% (e.g., for strings)
                    $query->where($column, 'LIKE', '%'.$value.'%');
                    break;

                default:
                    // Unknown operator: skip and log
                    Log::warning("Unhandled operator '{$operatorSuffix}' for field '{$field}'");
                    break;
            }
        }
    }

    /**
     * Returns allowed operator suffixes based on field type (mirrors frontend availableOperators).
     *
     * @return string[]
     */
    private function getAllowedOperators(string $type): array
    {
        switch ($type) {
            case 'date':
            case 'datetime':
                return ['=', '_not', '_from', '_to'];
            case 'dimension':
            case 'string':
                return ['=', '_not'];
            case 'number':
                return ['=', '_not', '_greater_than', '_greater_than_or_equal', '_less_than', '_less_than_or_equal'];
            case 'office': // Special case from frontend
                return ['='];
            default:
                return [];
        }

        // Optional: Add '_in', '_not_in', '_like' to relevant types if you expand frontend
    }
}
