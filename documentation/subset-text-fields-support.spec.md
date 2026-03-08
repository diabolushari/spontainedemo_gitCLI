# 1. Executive Summary

- Problem overview:
    - Subset configuration currently supports `dates`, `dimensions`, and `measures`, but not `text` fields from
      `data_table_texts`.
    - As a result, `/subset/create/{dataDetail}` cannot add text fields to a subset, and subset query output from
      `GetSubsetData` cannot project text columns.
    - Frontend subset rendering/filtering in Data Explorer also does not expose text fields.
- Proposed solution:
    - Introduce first-class subset text fields (`subset_detail_texts`) and wire them through subset create flow, query
      builder output, and Data Explorer table/filter UI.
    - Ensure text fields are treated as non-measurement fields and are excluded whenever `excludeNonMeasurements=true`.
- Expected outcome:
    - Users can select text fields during subset creation and view/filter those fields in explorer tables.
    - Summary/ranking endpoints that use measurement-only mode remain unchanged in behavior.

## Assumptions

- Existing `data_table_texts` metadata is already available and populated.
- This spec targets Laravel 11 + Inertia React TypeScript stack in this repository.
- Primary requested scope is create + fetch + Data Explorer display/filter; edit parity is treated as a follow-up unless
  explicitly approved.

# 2. Scope

## 2.1 In Scope

- Add subset-level persistence for text fields selected during `/subset/create/{dataDetail}`.
- Include selected text fields in `GetSubsetData` query output when `excludeNonMeasurements=false`.
- Exclude selected text fields from result set when `excludeNonMeasurements=true`.
- Update Data Explorer UI components:
    - `resources/js/Components/DataExplorer/SubsetTable.tsx`
    - `resources/js/Components/DataExplorer/SubsetFilter/SubsetFilterForm.tsx`
- Update dependent filter helper modules/types needed by `SubsetFilterForm`.
- Add backend and frontend tests for the above behavior.

## 2.2 Out of Scope

- Redesign of subset edit UX (unless explicitly approved later).
- New aggregation/expression semantics for text fields.
- Large Data Explorer UX redesign.
- Broad export redesign beyond ensuring existing behavior remains consistent.

# 3. Functional Requirements

## FR-1: Add Text Fields in Subset Create

- Description:
    - Users must be able to add/remove text fields from `/subset/create/{dataDetail}` similarly to
      date/dimension/measure selection.
- Actors:
    - Authenticated analyst/admin creating subsets.
- Preconditions:
    - `data_table_texts` records exist for the target `data_detail_id`.
- Main Flow:
    1. `GET /subset/create/{dataDetail}` returns `textFields` list.
    2. Subset create page displays a "Text Fields" management section.
    3. User selects one or more text fields, defines subset label/column alias (snake_case convention), optional sort
       order.
    4. `POST /subset/{dataDetail}` persists subset + text field rows.
- Alternate Flows:
    - If no text fields are selected, subset creation still succeeds.
- Edge Cases:
    - Duplicate `subset_column` alias across subset fields.
    - Selected `field_id` no longer exists (soft-deleted metadata).
- Validation Rules:
    - `texts` must be an array of typed objects.
    - `field_id` must reference `data_table_texts.id` belonging to same `data_detail_id`.
    - `subset_field_name` required, max length aligned with existing subset fields.
    - `subset_column` required, normalized snake_case, unique per subset across all field types.
- Failure Scenarios:
    - Transaction rollback if insert to `subset_detail_texts` fails.
    - Return existing error response pattern used by subset store controller.

## FR-2: Fetch Text Fields Through GetSubsetData

- Description:
    - `GetSubsetData` and underlying query builder must project selected text fields in result rows.
- Actors:
    - API consumers and frontend pages using subset data endpoints.
- Preconditions:
    - Subset has `texts` relation records.
- Main Flow:
    1. `GetSubsetData::withSubsetDetail()` eager-loads `texts.info`.
    2. Query builder includes text select expressions as ``<source column> AS <subset_column>``.
    3. Result rows include selected text columns when non-measurements are included.
- Alternate Flows:
    - If subset has no text fields, response schema remains unchanged.
- Edge Cases:
    - Null text values in source data.
    - Long text columns (`is_long_text=true`) included without truncation at query layer.
- Validation Rules:
    - Ignore rows with missing `info` relation similar to existing date/dimension/measure behavior.
- Failure Scenarios:
    - Invalid field metadata should skip that text field, not break full query.

## FR-3: Respect excludeNonMeasurements for Text Fields

- Description:
    - Text fields are non-measurement data and must be omitted from query output when `excludeNonMeasurements=true`.
- Actors:
    - Consumers of summary/ranking/export endpoints using measurement-only mode.
- Preconditions:
    - Endpoints pass `excludeNonMeasurements` to `GetSubsetData`.
- Main Flow:
    1. When `excludeNonMeasurements=false`, include dates + dimensions + texts + measures.
    2. When `excludeNonMeasurements=true`, include only measures (plus existing office-level synthetic fields where
       already applicable).
- Alternate Flows:
    - N/A.
- Edge Cases:
    - Sorting request targeting text column while excluded; should be ignored safely.
- Validation Rules:
    - Branching logic must be centralized in query builder to avoid endpoint drift.
- Failure Scenarios:
    - No SQL errors when filtered column is absent due to exclusion.

## FR-4: Data Explorer Table and Filter Support for Text Fields

- Description:
    - Text fields must appear in Data Explorer subset table columns and be selectable in subset filters.
- Actors:
    - Data Explorer users.
- Preconditions:
    - Subset payload includes `texts` relation data.
- Main Flow:
    1. `SubsetTable.tsx` appends text columns to displayed columns.
    2. `SubsetFilterForm.tsx` includes text fields in available filter fields.
    3. Text filters use `string` operator set (`=`, `_not`) and value input.
    4. Query params are generated and parsed consistently through init/use-available helpers.
- Alternate Flows:
    - If no text fields are configured, UI behaves exactly as today.
- Edge Cases:
    - Text field names overlapping with other subset column aliases.
    - Empty filter value should not submit.
- Validation Rules:
    - `SubsetFilterForm` must maintain existing field-row auto-add/remove behavior.
- Failure Scenarios:
    - Invalid selected field should gracefully reset to default empty field behavior.

# 4. Non-Functional Requirements

- Performance:
    - Query overhead for text fields should be O(number of selected text fields), using direct select from base data
      table.
- Scalability:
    - Must support subsets with mixed field types without changing endpoint contracts.
- Availability:
    - No downtime migration pattern; additive schema only.
- Security:
    - Continue parameterized filtering; no raw user SQL in text filters.
- Compliance:
    - Inherit existing app-level auth middleware on subset pages/endpoints.
- Observability:
    - Reuse current logging/error handling patterns; no new PII logs.

# 5. System Architecture

- High-level architecture description:
    - Existing subset domain adds a fourth selectable field type (`texts`) alongside dates/dimensions/measures.
- Service boundaries:
    - Controllers orchestrate DTO + persistence.
    - Query builder services handle SQL projection/filter/sort behavior.
    - React components handle field selection, display, and query-param construction.
- Data flow:
    1. `DataDetail.textFields` metadata -> subset create UI.
    2. Create POST persists subset + `subset_detail_texts`.
    3. `GetSubsetData` loads `subsetDetail` with `texts.info`.
    4. Query builder projects text columns unless exclusion mode is enabled.
    5. `SubsetTable` renders projected text columns; `SubsetFilterForm` generates text filters.
- External dependencies:
    - MySQL, Eloquent ORM, Spatie Laravel Data DTO mapping, Inertia React frontend.

# 6. Data Model

- Entities:
    - New: `subset_detail_texts`
    - Existing related: `subset_details`, `data_table_texts`
- Key fields (`subset_detail_texts`):
    - `id`
    - `subset_detail_id` (FK -> `subset_details.id`)
    - `field_id` (FK -> `data_table_texts.id`)
    - `subset_field_name` (string)
    - `subset_column` (string)
    - `created_by`, `updated_by`, timestamps, `deleted_at`
- Relationships:
    - `SubsetDetail hasMany SubsetDetailText`
    - `SubsetDetailText hasOne DataTableText as info`
- Indexing strategy:
    - FK indexes via `foreignId`.
    - Add unique composite recommendation: (`subset_detail_id`, `subset_column`) to prevent alias collisions.
- Data retention policy:
    - Soft deletes aligned with existing subset field tables.

# 7. API Design (if applicable)

## Endpoint: GET /subset/create/{dataDetail}

- Method:
    - `GET`
- URL:
    - `/subset/create/{dataDetail}`
- Request schema:
    - Route model binding for `dataDetail`.
- Response schema:
    - Existing payload plus `textFields: TableTextField[]`.
- Status codes:
    - `200`, `401`, `404`
- Error format:
    - Existing inertia error handling.
- Authentication requirements:
    - Auth middleware.

## Endpoint: POST /subset/{dataDetail}

- Method:
    - `POST`
- URL:
    - `/subset/{dataDetail}`
- Request schema (incremental):
    - Existing subset payload plus:

```json
{
    "texts": [
        {
            "id": null,
            "field_id": 12,
            "subset_field_name": "Consumer Name",
            "subset_column": "consumer_name",
            "sort_order": null
        }
    ]
}
```

- Response schema:
    - Redirect with flash message/error as existing pattern.
- Status codes:
    - `302`, `422`, `500`
- Error format:
    - Existing flash error payload.
- Authentication requirements:
    - Auth middleware.

## Endpoint family: subset data endpoints backed by GetSubsetData

- Method:
    - `GET`
- URLs:
    - `/subset/{subsetDetail}`
    - `/subset-summary/{subsetDetail}`
    - `/office-level-summary/{subsetDetail}`
    - `/subset-export/{subsetDetail}`
- Request schema:
    - Existing query params; `excludeNonMeasurements` semantics unchanged.
- Response schema:
    - Includes text columns only when non-measurement fields are enabled.
- Status codes:
    - Existing endpoint behavior.
- Error format:
    - Existing JSON response shape per endpoint.
- Authentication requirements:
    - Existing auth requirements per endpoint.

# 9. Deployment & Infrastructure

- Environment setup:
    - Run additive migration for `subset_detail_texts`.
- CI/CD expectations:
    - Include migration + tests + type checks in pipeline gates.
- Configuration management:
    - No new env vars.
- Secrets management:
    - No changes.
- Monitoring setup:
    - Existing Laravel/app logs sufficient; add targeted logs only if debugging rollout.

# 11. Open Questions

- Should subset edit (`/subset/{subsetDetail}/edit`) also support managing text fields in this same phase?
- Should subset duplication also clone `texts` relations now for parity?
- Should subset export include text columns when `excludeNonMeasurements=false` (recommended), or remain unchanged?
- Do we require `sort_order` on text fields, or can it be deferred to preserve minimal schema?

# 12. Implementation Phases

- Phase 1: Backend data model + DTO contract
    - Add migration/model for `subset_detail_texts`.
    - Add `SubsetDetail::texts()` relation and `SubsetDetailText` model with `info()` relation.
    - Extend `SubsetFormRequest` with `texts` array and add `SubsetTextField` DTO.
- Phase 2: Subset create persistence
    - Update `SubsetCreateController` to provide `textFields`.
    - Update `SubsetStoreController` transaction to persist text rows.
    - Add create-page UI section for text field management.
- Phase 3: Query builder and data fetch
    - Extend `GetSubsetData::withSubsetDetail()` to eager-load `texts.info`.
    - Add query builder module for text projections and wire to non-measurement branch.
    - Ensure exclusion behavior removes text fields when `excludeNonMeasurements=true`.
- Phase 4: Data Explorer table/filter support
    - Update `SubsetTable.tsx` to render `subset.texts` columns.
    - Update `SubsetFilterForm.tsx` and helper hooks (`useAvailableSubsetFilters`, `initSubsetFilterFormFields`) to
      include text filters.
    - Update call sites to pass `texts` where required by props.
- Phase 5: Validation and regression tests
    - Backend feature tests for create + query output + exclusion mode.
    - Frontend TS checks for new interfaces/props.
    - Manual verification on subset preview/data explorer/ranking screens.

## Exit Criteria

- Subset create can persist text fields from `data_table_texts`.
- `GetSubsetData` returns text columns when non-measurement fields are enabled.
- `excludeNonMeasurements=true` omits text/date/dimension columns and keeps measure-only outputs.
- Data Explorer subset table and subset filter form both support text fields without breaking existing
  date/dimension/measure workflows.
