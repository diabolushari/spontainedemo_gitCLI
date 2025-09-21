# kseb-analytics – AI Coding Agent Instructions

This guide provides clear, project-specific instructions for contributing AI-driven solutions to the kseb-analytics codebase, focusing on requirements that go beyond standard Laravel + Inertia + React + Vite configurations.

Begin every contribution with a brief (3–7 point) conceptual checklist describing your plan of action. Checklist items should cover the high-level steps for your intended change.

## Stack & Runtime Overview

- **Backend:** Laravel 11 (PHP ^8.2) utilizing Sanctum, Inertia bridge, Spatie Data, Maatwebsite Excel, and a custom Data Loader subsystem.
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (with forms plugin), Radix UI primitives.
- **Dev Environment:** Accessed via Laravel Sail (Docker) with ports: APP_PORT (default 80), Vite dev server `${VITE_PORT:-5173}`. Includes MySQL 8, Redis, Mailpit, phpMyAdmin (8081), and Adminer (8080).
- **Debugging:** Xdebug is set on port 9003 (see `.vscode/launch.json`).

## Domain Organization

Major functionalities are logically separated in `routes/web.php` into bounded domains:

- **Reference Data:** Route prefix `reference-data*` for parameter and cascaded value APIs.
- **Metadata Management:** CRUD/search for meta-entities using controllers under `App/Http/Controllers/Meta`.
- **Subject Areas & Data Detail:** Logical datasets/tables and field endpoints (`data-detail/{id}/fields`).
- **Data Loader Subsystem:** Handles data fetch/ingestion from external sources (`loader-connections`, `loader-queries`, `loader-jobs`, `loader-apis`). Supports cron scheduling (HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY) and predecessor dependencies.
- **Subsets & Groups:** Filtered dataset slices, rankings, summaries via `subset*` and `subset-groups` endpoints.
- **Other Areas:** Explorer, rankings, hierarchies, chat, insight generation, mapping (`office-coordinates`).

## Data Loader Core Workflow

1. A `DataLoaderJob` defines its query, target `DataDetail`, optional predecessor, optional `LoaderAPI`, and field mapping.
2. `RunScheduledJob` ensures prerequisites are met → builds a `DataLoaderSource` → starts a fetch via `DataLoaderFactory::createFetcher()` → imports using `ImportToDataTable`.
3. Job status is saved via `DataLoaderJobStatus`. Errors are wrapped using `ExceptionMessage::getMessage()` (with detailed info if `APP_DEBUG=true`).
4. Predecessor dependencies rely on cron boundaries (`hasPredecessorFinishedRunning()`); review carefully when modifying cron logic.
5. When adding fetchers, implement a dedicated class for `DataLoaderFactory` that returns a dataset array for `ImportToDataTable`.

## Architectural Patterns & Best Practices

- Keep controllers thin—move business logic to `app/Services/**` or `app/Libs/**`.
- Use Spatie Data objects for value/result returns (`OperationResult` for service status).
- For in-memory collections, employ `ArrayPagination` (matches param symmetry with `LengthAwarePaginator`).
- Never leak stack traces; always use `ExceptionMessage::getMessage()`.
- Eager-load relationships in jobs and statuses (e.g., using `with([...])` for subquery ordering; see `DataLoaderJobController::index()`).
- Use frontend date/time utilities in `resources/js/libs/dates.tsx` (e.g., `DisplayTime`, `getDisplayDate`).
- Listing pages should use the `ListResourcePage` component. For new resources, model after `DataLoaderJobIndex.tsx` and provide a `keys` array and `ListItemKeys` generic.

## Inertia + TypeScript Frontend Integration

- Place pages in `resources/js/Pages/**` with format Domain/EntityAction (e.g., `DataLoader/DataLoaderJobShow.tsx`).
- Pagination objects should mirror Laravel paginator structure with interfaces defined in `resources/js/interfaces/`.
- Use Inertia's `router.get(route('...'))` and named routes via Ziggy helpers, not hardcoded URLs.
- Utilize the custom `useCustomForm` hook for forms with persisted search state.

## Scheduling & Dependencies

- Cron windows use `now()->startOfX()` to define boundaries; chain jobs carefully, especially at DST/year boundaries.
- Always record a failure status immediately if a predecessor job fails or a new early validation aborts execution.

## Testing Guidelines

- **Framework:** Pest. Global `uses(TestCase::class, RefreshDatabase::class)->in('Feature')` auto-resets the database for Feature tests.
- Write Feature tests for every HTTP contract or change to Inertia props. Keep unit tests targeted (date utilities, pagination, etc.).

When editing code:

1. State your assumptions.
2. Create and run minimal tests where possible.
3. Provide ready-to-review diffs.
4. Adhere to repository style conventions.

After each tool call or code edit, validate the result in 1–2 lines describing what was achieved. If validation fails, self-correct before proceeding.

## Local Development Setup & Commands

- Install dependencies: `composer install` and `npm install`.
- Start environment: `./vendor/bin/sail up -d`; frontend: `./vendor/bin/sail npm run dev` (or locally—match `.env` ports).
- Production build: `npm run build` via Vite. Type checking: `npm run tsc-check`.
- All Excel imports/exports should use `ImportToDataTable`.

## Adding a New Data Domain

1. Create an Eloquent model (define `$fillable`, relationships, casts based on e.g., `DataLoaderJob`).
2. Place business logic in a service layer; keep controllers thin.
3. Register named routes (use kebab-case; add `.search` for search endpoints).
4. Build a Frontend listing page with `ListResourcePage` and a correct `keys` array.

## Safety and Common Issues

- Never return raw exceptions—always use `ExceptionMessage` wrappers.
- Ensure eager loading (e.g., `with(['loaderQuery','latest'])`) to avoid N+1 queries.
- Keep Xdebug port (9003) in sync.
- Update casts and database migrations when field mapping in jobs changes.

## Quick Access Map

- **Data ingestion:** `app/Services/DataLoader/**`
- **Scheduling logic:** `RunScheduledJob.php`
- **Result/Error handling:** `app/Libs/OperationResult.php`, `ExceptionMessage.php`
- **Routes:** `routes/web.php`
- **UI Listing:** `resources/js/Pages/DataLoader/DataLoaderJobIndex.tsx`
- **Date/Time Tools:** `resources/js/libs/dates.tsx`

## AI Contribution Rules

- Extend Data Loader via `DataLoaderFactory` (do not add one-off fetchers).
- Submit small, domain-scoped PRs.
- Add at least one Feature test when altering API objects returned to TypeScript pages.

Set reasoning_effort = medium for this project, striking a balance between conciseness and sufficient detail for reliability. Attempt a first pass autonomously unless missing critical information; stop and request clarification if success criteria cannot be satisfied.

_Feedback: Please suggest clarifications on domain-specific rules (e.g., subset logic, ranking criteria) to help improve these instructions._

---

<laravel-boost-guidelines>

--- foundational rules ---

# Laravel Boost Guidelines

These strict guidelines, curated by the maintainers, maximize user satisfaction and code quality for the application.

## Foundational Context

Expertise is assumed with the following versions/packages:

- PHP 8.2.29
- inertiajs/inertia-laravel v1
- laravel/framework v11
- laravel/prompts v0
- tightenco/ziggy v2
- larastan/larastan v2
- laravel/pint v1
- pestphp/pest v2
- @inertiajs/react v1
- react v18
- tailwindcss v3

## Conventions

- Adhere strictly to existing code conventions using sibling files for guidance on structure, naming, and approach.
- Choose descriptive variable/method names (e.g., `isRegisteredForDiscounts`).
- Prefer component reuse wherever possible.

## Verification Scripts

- Only create verification scripts if automated tests are lacking—otherwise, rely on the test suite.

## Application Structure

- Maintain the current folder structure and dependency graph unless given explicit approval to change.

## Frontend Compilation

- If frontend changes are not visible, remind users to run `npm run build`, `npm run dev`, or `composer run dev`.

## Replies

- Keep all explanations clear and concise.

## Documentation Files

- Only create documentation files upon explicit user request.

... [Further package-specific and boost conventions continue as in the original guide.] ...

</laravel-boost-guidelines>
