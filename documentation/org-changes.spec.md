# Organization Changes Spec (Greenfield)

## Assumption

This is a new feature with no production data dependency. Database changes can be applied by rolling back and re-running migrations.

## Objective

Implement a cohesive organization refactor covering:

- Color inputs as color pickers.
- Fix DB color field typos and standardize naming.
- Keep logo nullable and handle it safely in controller logic.
- Use `react-md-editor` for context-rich fields.
- Remove `organization_contexts` runtime dependency.
- Keep latest context on `organizations.industry_context`.
- Move objectives to dedicated `org_reporting_objectives` table.
- Replace `hierarchy_connection` with structured latest-state fields.
- Add history tables for context and hierarchy changes.
- Manage objectives from `organization.show`.

## Scope

### In Scope

- Schema design and migration updates.
- Backend validation and persistence.
- Frontend create/edit/show updates.
- History tracking logic.

### Out of Scope

- Unrelated organization listing/search redesign.
- Non-organization feature changes.

## Target Data Model

### organizations

Latest/current snapshot source for organization details.

Columns (relevant):

- `name`, `address`, `state`, `country`
- `industry_context` (`text`, latest context)
- `logo` (nullable)
- `primary_color`, `secondary_color`, `tertiary_color`
- `meta_hierarchy_id` (nullable FK `meta_hierarchies.id`)
- `meta_hierarchy_item_id` (nullable FK `meta_hierarchy_items.id`)
- `hierarchy_description` (`text`, nullable)
- timestamps

Removed from final schema:

- `objectives` (JSON)
- `hierarchy_connection`
- `primary_colour`, `secondary_colour`, `teritiary_colour`

### org_reporting_objectives

- `id`
- `organization_id` (FK)
- `period_start` (date)
- `period_end` (date)
- `objective` (`text`)
- `sort_order` (nullable int)
- timestamps
- `deleted_at`

### organization_context_histories

- `id`
- `organization_id` (FK)
- `context` (`text`)
- `changed_by` (nullable FK `users.id`)
- timestamps
- `deleted_at` (if model uses `SoftDeletes`)

### organization_hierarchy_assignment_histories

- `id`
- `organization_id` (FK)
- `meta_hierarchy_id` (nullable FK)
- `meta_hierarchy_item_id` (nullable FK)
- `description` (`text`, nullable)
- `changed_by` (nullable FK `users.id`)
- timestamps
- `deleted_at` (if model uses `SoftDeletes`)

## Backend Changes

### Validation (`OrganizationFormRequest`)

- Keep `logo` nullable:
  - `nullable|image|mimes:jpg,jpeg,png,webp|max:2048`
- Validate colors as nullable hex strings:
  - `primary_color`, `secondary_color`, `tertiary_color`
- Validate context/hierarchy fields:
  - `industry_context` text
  - `meta_hierarchy_id` exists nullable
  - `meta_hierarchy_item_id` exists nullable
  - `hierarchy_description` text nullable

### Persistence (`OrganizationController` or service layer)

- Wrap organization + related writes in DB transaction.
- Nullable logo behavior:
  - create: if no logo uploaded, skip file save.
  - update: replace logo only when file provided.
- Context behavior:
  - latest value in `organizations.industry_context`
  - append row to `organization_context_histories` when changed.
- Hierarchy behavior:
  - latest values in `organizations` hierarchy fields
  - append row to `organization_hierarchy_assignment_histories` when changed.
- Do not expose raw exception text to user-facing flash messages.

### Objectives ownership

- Remove objective persistence from organization create/edit.
- Manage objective CRUD via `organization.show` flow.
- Suggested routes:
  - `POST /organization/{organization}/objectives`
  - `PATCH /organization/{organization}/objectives/{objective}`
  - `DELETE /organization/{organization}/objectives/{objective}`

## Frontend Changes

### Color picker

- Replace plain text inputs with color picker controls:
  - `input type="color"` + synced hex input.
- Keys:
  - `primary_color`, `secondary_color`, `tertiary_color`

### Markdown editor

- Install/use `react-md-editor` for:
  - `industry_context`
  - `hierarchy_description` (if rich text desired)
- Render markdown safely on show page.

### Objectives relocation

- Remove objective section from organization create/edit forms.
- Add objective management UI to `organization.show`:
  - list objectives
  - add/edit/delete objective rows

## API Contract

### Organization create/update payload

```json
{
  "name": "...",
  "address": "...",
  "state": "...",
  "country": "...",
  "industry_context": "## Markdown",
  "logo": "<file|null>",
  "primary_color": "#1A73E8",
  "secondary_color": "#0F9D58",
  "tertiary_color": "#F9AB00",
  "meta_hierarchy_id": 1,
  "meta_hierarchy_item_id": 10,
  "hierarchy_description": "Hierarchy assignment details"
}
```

### Objective payload (show-page CRUD)

```json
{
  "period_start": "2026-01-01",
  "period_end": "2026-03-31",
  "objective": "Increase conversion by 8%",
  "sort_order": 1
}
```

## Data Integrity

- FK constraints on objective/history tables.
- No model should use `SoftDeletes` without `deleted_at`.

## Testing Requirements

### Schema tests

- Fresh `migrate:fresh` produces final target schema directly.
- Legacy typo/objective/connection/context snapshot tables are absent from runtime schema.

### Feature tests

- Organization create/update works with and without logo upload.
- Context change writes latest state + history row.
- Hierarchy change writes latest state + history row.
- Objective CRUD works from `organization.show`.

### UI/TS tests

- Color picker values validate and persist.
- Markdown editor persists and rehydrates values.
- Create/edit pages do not submit objectives.
- Show page manages objectives end-to-end.

## Rollout

1. Update migrations/code.
2. Run `php artisan migrate:fresh --seed` in target environments where reset is allowed.
3. Run full test suite and type checks.
4. Ship.

## Acceptance Criteria

- Logo is optional and never causes create/update runtime errors when absent.
- Color fields are picker-driven and stored as `*_color`.
- Latest context is in `organizations.industry_context`.
- No runtime dependency on `organization_contexts`.
- Context and hierarchy history timelines are available.
- Latest hierarchy assignment is stored on `organizations` structured fields.
- Objectives are managed in `organization.show` and stored in `org_reporting_objectives`.
