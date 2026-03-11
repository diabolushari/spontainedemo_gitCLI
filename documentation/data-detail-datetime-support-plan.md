# DataDetail Datetime Field Support: Spec and Implementation Plan

## 1. Summary

We currently support `date`, `dimension`, `measure`, `text`, but not a dedicated `datetime` field type.  
This change adds first-class `datetime` support so data tables can store and query timestamp values (date + time), not
only date-only values.

Primary outcomes:

1. Setup flow can configure fields as `datetime`.
2. Dynamic data table schema creates DB `DATETIME` columns for those fields.
3. Data detail show/filter/export paths include and correctly handle datetime values.
4. Existing `date` behavior remains backward compatible.

## 2. Current State (Observed)

### Backend

1. Dynamic schema creation currently creates temporal fields only as `date`:
    - `app/Services/SubjectArea/CreateDataTable.php`
2. DataDetail metadata stores temporal fields in `data_table_dates` via `DataTableDate`:
    - `app/Models/DataTable/DataTableDate.php`
3. Setup service initializes `dates`, `dimensions`, `measures`, `texts`, `relations` (no `datetimes`):
    - `app/Services/DataTable/SetupDataTable.php`
4. DataDetail show loads `dateFields` + other field groups:
    - `app/Http/Controllers/DataDetail/DataDetailController.php`
5. Export includes temporal fields from `dateFields`:
    - `app/Exports/DataTableExport.php`

### Frontend

1. Field type picker currently has `date`, `dimension`, `measure`, `text` only:
    - `resources/js/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm.tsx`
2. Setup form payload currently sends `dates`, `dimensions`, `measures`, `texts` (no `datetimes`):
    - `resources/js/Components/SetupDataTable/SetupDataTableForm.tsx`

### Data Loader dependency (important)

There is existing date-format parsing logic that always outputs `Y-m-d`, which can drop time-of-day values:

- `app/Services/DataLoader/JsonStructure/PerformJSONProcessing.php`

This must be adjusted if datetime values come through field mappings.

## 3. Goals and Non-Goals

### Goals

1. Add a `datetime` field type in setup configuration.
2. Persist datetime field metadata.
3. Create SQL `DATETIME` columns for datetime fields in dynamic tables.
4. Show, filter, and export datetime fields.
5. Preserve existing behavior for existing date fields and tables.

### Non-Goals (Phase 1)

1. Full subset/date-expression redesign for time-granularity filtering.
2. Timezone conversion UX overhaul (phase 1 stores/returns DB-native values).
3. Refactor unrelated filter architecture beyond required datetime support.

## 4. Proposed Design

### 4.1 Data Modeling Strategy

Recommended: keep a single temporal metadata table (`data_table_dates`) and add a new discriminator column.

- Add `temporal_type` to `data_table_dates`:
    - values: `date`, `datetime`
    - default: `date`

Why this approach:

1. Lower change surface than creating a separate `data_table_datetimes` table.
2. Preserves existing `dateFields` relation and downstream services.
3. Backward-compatible migration path (existing rows become `date`).

### 4.2 Request/DTO Contract Changes

### DataDetail setup request

Add `datetimes` payload to setup request DTO.

- File: `app/Http/Requests/DataDetail/DataDetailFormRequest.php`
- Add property:
    - `public ?array $datetimes`
- Keep same item shape as `dates` (`column`, `fieldName`) for consistency.

### Loader field mapping DTO

If field mappings include datetime fields, allow `datetime` in validation.

- File: `app/Http/Requests/DataLoader/FieldMappingData.php`
- Change:
    - `#[In(['date', 'datetime', 'dimension', 'measure', 'text', 'relation'])]`

### 4.3 Dynamic Table Schema Creation

- File: `app/Services/SubjectArea/CreateDataTable.php`
- Add method: `addDateTimeFields(...)`
- Behavior:
    - For each configured datetime field: `$table->dateTime($column)->nullable()->index();`
- Keep existing date fields as `$table->date(...);`

### 4.4 Setup Metadata Initialization

- File: `app/Services/DataTable/SetupDataTable.php`
- Add datetime initialization path.
- Recommended refactor:
    - Keep `initDates` for date fields.
    - Add `initDateTimes` for datetime fields.
    - Use one internal helper to insert into `data_table_dates` with `temporal_type`.

Expected writes into `data_table_dates`:

1. Date field row: `temporal_type = 'date'`
2. Datetime field row: `temporal_type = 'datetime'`

### 4.5 Show + Filter Behavior

### Show page data load

- File: `app/Http/Controllers/DataDetail/DataDetailController.php`
- Keep loading `dateFields`; include `temporal_type` in returned records.

### Filter backend

- File: `app/Services/DataTable/DataTableFilter.php`
- Treat `datetime` with the same allowed operators as date:
    - `=`, `_not`, `_from`, `_to`
- Apply direct comparisons against datetime column values.

### Filter frontend

Files:

1. `resources/js/Components/DataDetail/Filter/useAvailableFiltersFromDataDetail.ts`
2. `resources/js/Components/DataDetail/Filter/generateInitialFieldsDatadetail.ts`
3. `resources/js/Components/DataDetail/Filter/DataDetailFilter.tsx`
4. `resources/js/Components/DataExplorer/SubsetFilter/subsetFilterOperations.ts`

Changes:

1. Return `type: 'date'` for date fields and `type: 'datetime'` for datetime fields.
2. Add operator mapping for `datetime` (`=`, `_not`, `_from`, `_to`).
3. Use datetime input control for datetime field filters (for example `input type='datetime-local'`).

Note: current date filters are typed as string in one hook; this should be corrected as part of this work to avoid
inconsistent behavior.

### 4.6 Export Behavior

### Data table export

- File: `app/Exports/DataTableExport.php`
- Ensure temporal headers include both date + datetime fields.
- Datetime values must not be truncated to date during export.

No route/controller contract change required:

- `app/Http/Controllers/DataDetail/ExportDataTableController.php`

### 4.7 Loader Date/Datetime Parsing

To prevent silent time-loss when importing data from APIs/JSON:

- File: `app/Services/DataLoader/JsonStructure/PerformJSONProcessing.php`
- Change conversion output by mapped field type:
    - `date` -> `Y-m-d`
    - `datetime` -> `Y-m-d H:i:s`

Frontend field mapping type additions:

1. `resources/js/Components/DataLoader/useDataTableToJsonMapping.tsx`
2. `resources/js/Components/DataLoader/DataTableToJsonMapping.tsx`
3. `resources/js/Components/DataLoader/DataTableToSqlMapping.tsx`
4. `resources/js/Components/SetupDataTable/SetupDataTableV2.tsx`

### 4.8 Type Definitions

Update shared TS interfaces so frontend logic can branch by temporal type:

- File: `resources/js/interfaces/data_interfaces.tsx`
- Add to `TableDateField`:
    - `temporal_type?: 'date' | 'datetime'`

## 5. Implementation Plan (Phased)

### Phase 1: Schema and Backend Foundations

1. Add migration for `data_table_dates.temporal_type` with default `date`.
2. Update `DataTableDate` model fillable/casts/docblocks.
3. Extend `DataDetailFormRequest` to accept `datetimes`.
4. Update `CreateDataTable` to create `DATETIME` columns.
5. Update `SetupDataTable` to initialize datetime metadata rows.

Deliverable: new tables can be created with both date and datetime columns.

### Phase 2: Setup UI and Payload Wiring

1. Add `datetime` option in field type selector.
2. Update setup form payload generation to send `datetimes`.
3. Update setup mapping generation (`fieldMapping`) to emit `field_type: 'datetime'` where applicable.

Deliverable: users can configure datetime fields in setup UI and submit successfully.

### Phase 3: Show, Filter, Export

1. Surface temporal type in DataDetail field displays.
2. Update DataDetail filter type/operator mapping for datetime.
3. Add datetime filter input handling.
4. Validate export includes datetime values with time preserved.

Deliverable: datetime values visible, filterable, and exportable.

### Phase 4: Loader Compatibility

1. Extend loader field type validation (`FieldMappingData`).
2. Update loader mapping UI type unions.
3. Update JSON processing format output for datetime fields.

Deliverable: API/JSON imports preserve datetime precision.

### Phase 5: Testing and Documentation

1. Add feature/unit tests (see section 7).
2. Update `documentation/` data-detail/loader architecture notes.
3. Add changelog entry if repository process requires it.

Deliverable: verified and documented change ready for rollout.

## 6. Acceptance Criteria

1. A user can create a DataDetail with at least one `datetime` field.
2. Dynamic table has SQL `DATETIME` column for each configured datetime field.
3. Metadata row for datetime field exists in `data_table_dates` with `temporal_type='datetime'`.
4. DataDetail show page displays datetime field columns and values.
5. Datetime filter supports equals/not/from/to and returns expected rows.
6. Exported file includes datetime column header + datetime values with time component.
7. Existing `date` fields continue to behave exactly as before.
8. Loader parsing does not truncate datetime values to date-only.

## 7. Test Plan

Add tests in `tests/Feature` and `tests/Unit` (currently no direct test coverage exists for this flow):

1. Feature: create DataDetail with date + datetime fields; assert schema types.
2. Feature: DataDetail show filter with datetime `_from` and `_to`.
3. Feature: export includes datetime values.
4. Unit: `CreateDataTable` creates `date` and `datetime` columns correctly.
5. Unit: `PerformJSONProcessing` outputs `Y-m-d H:i:s` for datetime field mappings.
6. Regression: existing date-only DataDetail creation + export still pass.

## 8. Risks and Mitigations

1. Risk: Existing date filter code currently treats date fields as string in one frontend hook.
    - Mitigation: include filter type cleanup in phase 3.
2. Risk: Timezone ambiguity for displayed/exported timestamps.
    - Mitigation: document phase-1 behavior (DB-native value), define timezone policy before phase 2+.
3. Risk: Hidden dependencies on `dateFields` semantics (subset/chart paths).
    - Mitigation: validate key paths with smoke tests; if needed, gate datetime fields from unsupported flows in phase
        1.

## 9. Open Questions

1. Should phase-1 datetime be stored/displayed strictly in UTC?
2. Should Data Explorer/Subsets support datetime filters in this same release?
3. Preferred UI control for datetime filter input:
    - native `datetime-local`
    - separate date + time controls
4. Should exports normalize datetime to a fixed format string or keep raw DB serialization?

## 10. Effort Estimate

Estimated engineering effort: 4-6 dev days total (excluding QA sign-off), assuming one engineer and no major regressions
in subset/chart modules.
