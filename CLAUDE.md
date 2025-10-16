# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React with Vite)

- `npm install` - Install JavaScript dependencies
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run tsc-check` - Run TypeScript type checking

### Backend (Laravel)

- `composer install` - Install PHP dependencies
- `php artisan serve` - Start Laravel development server (or use Laravel Sail)
- `php artisan migrate` - Run database migrations
- `php artisan test` - Run tests using Pest
- `vendor/bin/pint` - Format PHP code using Laravel Pint
- `vendor/bin/phpstan analyse` - Run static analysis (level 5, see `phpstan.neon`)
- `php artisan ide-helper:generate` - Generate IDE helper files

### Code Generation

- `php artisan make:data {name}` - Create Laravel Data DTO
- `php artisan make:service {name}` - Create service class
- `php artisan make:react {name}` - Create React component

## Architecture Overview

Laravel + React (Inertia.js) full-stack application for KSEB (Kerala State Electricity Board) analytics with dynamic
data ingestion, subset filtering, and multi-format exports.

### Tech Stack

- **Backend**: Laravel 11 with Inertia.js, Spatie Laravel Data for DTOs
- **Frontend**: React 18 with TypeScript, Vite
- **UI**: Radix UI primitives, Tailwind CSS, shadcn/ui components
- **Charts**: Recharts
- **Maps**: Leaflet with react-leaflet
- **Testing**: Pest (PHP with `RefreshDatabase`), ESLint + Prettier (JS/TS)
- **Static Analysis**: PHPStan (Larastan), TypeScript compiler
- **Route Management**: Ziggy for named routes in TypeScript

### Core Data Flow Architecture

**Data Ingestion Pipeline**:

1. `DataLoaderConnection` (REST API, WebSocket, Database) → Connection configuration with credentials
2. `DataLoaderQuery` → SQL/API query definitions with cron scheduling
3. `RunScheduledJob` → Orchestrates fetch/import via factories
4. Fetchers (in `app/Services/DataLoader/Fetchers`) → Execute queries and stream JSON responses
5. `ImportToDataTable` service → Flattens JSON, syncs metadata, creates dynamic tables
6. `DataLoaderJobStatus` → Tracks execution history, errors, and row counts

**Content Organization**:

- `SubjectArea` → Top-level analytics domains (Finance, Operations, Service Delivery)
- `DataDetail` (aka data tables) → Typed dimensions/measures/dates with dynamic table creation
- `Subset` → Filtered views of data details with default filters and field selections
- `SubsetGroup` → Collections of subsets for dashboard composition

**Metadata & Hierarchies**:

- `MetaStructure` → Defines dimension taxonomies (e.g., office types, categories)
- `MetaData` → Individual values within structures, auto-synced from imports
- `MetaGroup` → Custom groupings of metadata values
- `DistributionHierarchy` services → KSEB office hierarchy (Circle → Division → Subdivision → Section)

### Project Structure

#### Backend (Laravel)

**Feature-based organization within Laravel directories**:

- `app/Http/Controllers/{Feature}/` - Controllers grouped by domain
- `app/Models/{Feature}/` - Eloquent models organized by feature
- `app/Services/{Feature}/` - Business logic services (prefer service injection over direct model queries in
  controllers)
- `app/Http/Requests/{Feature}/` - Form request validation (search requests and form requests)
- `app/Data/` - Spatie Laravel Data DTOs with attribute-based validation
- `app/Libs/` - Shared utilities (`OperationResult`, `ArrayPagination`, `SaveFile`, `GetRelativeTime`)
- `app/Exports/` - Maatwebsite Excel export classes
- `app/Imports/` - Maatwebsite Excel import classes

**Key patterns**:

- Controllers implement `HasMiddleware` to enforce `auth` middleware
- Return Inertia views with paginated Eloquent data
- Long-running jobs persist execution metadata via `DataLoaderJobStatus`
- Use `OperationResult` for standardized error propagation in services

#### Frontend (React)

**Organized in `resources/js/`**:

- `Pages/{Feature}/` - Inertia.js page components (auto-resolved by `resolvePageComponent` in `app.tsx`)
- `Components/{Feature}/` - Feature-specific React components
- `Components/ListingPage/ListResourcePage.tsx` - Reusable admin CRUD list view
- `FormBuilder/` - `FormBuilder` and `FormPage` for strongly-typed CRUD forms
- `Layouts/` - Layout components (`AuthenticatedLayout`, `DashboardSidebar`)
- `hooks/` - Custom React hooks (`useCustomForm`, `useInertiaPost`, `useFetchPagination`, `useFetchList`)
- `ui/` - shadcn/ui primitives and form components
- `types/` - TypeScript type definitions
- `interfaces/` - TypeScript interfaces (keep aligned with backend DTOs)
- `lib/` - Utility libraries

**Key patterns**:

- Admin CRUD screens extend `ListResourcePage` + `FormBuilder` + `useCustomForm` rather than custom form logic
- Axios configured globally in `bootstrap.ts`; prefer Inertia form helpers (`router.get`, `useInertiaPost`) over manual
  fetch
- File paths must align with route names for Inertia auto-resolution
- Backend responses should use camelCase keys or be normalized in page components

### Key Conventions

#### Laravel

- **DTOs**: Use Spatie Laravel Data with PHP attribute annotations for validation (e.g., `CreateDataTable`,
  `#[Required]`, `#[Max(255)]`)
- **Requests**: Form requests for validation (search + CRUD forms) in `app/Http/Requests/{Feature}/`
- **Services**: Business logic in dedicated services; inject services, don't query models directly in controllers
- **Error Handling**: Bubble errors through `OperationResult` or structured arrays
- **Dynamic Tables**: `CreateDataTable` service scaffolds tables for new data details; roll back on failure
- **Testing**: Pest with `RefreshDatabase` trait; use factories instead of manual inserts
- **Code Style**: Laravel Pint (run `vendor/bin/pint` before commits)
- **Static Analysis**: PHPStan level 5 (run `vendor/bin/phpstan analyse`)

#### React/TypeScript

- **Props**: Use object destructuring; treat as immutable/readonly
- **Naming**: PascalCase for components/pages, camelCase for hooks/utilities
- **Forms**: Extend `FormBuilder` and `useCustomForm` for CRUD forms
- **UI Components**: Follow shadcn/ui patterns in `resources/js/ui/`
- **State**: Inertia.js handles client-server state; Ziggy provides typed `route()` helper
- **Types**: Mirror backend DTOs in `interfaces/`; ensure camelCase keys match backend responses

### Dependencies & Integrations

**Backend**:

- `spatie/laravel-data` - DTOs with validation attributes
- `maatwebsite/excel` - Excel import/export
- `textalk/websocket` - WebSocket connections for data loading
- `tightenco/ziggy` - Laravel routes in JavaScript/TypeScript
- `barryvdh/laravel-ide-helper` - IDE autocompletion
- `larastan/larastan` - PHPStan for Laravel

**Frontend**:

- `@inertiajs/react` - Server-driven client-side rendering
- `recharts` - Data visualization
- `leaflet`, `react-leaflet` - Interactive maps
- `dayjs` - Date manipulation
- `lucide-react`, `react-icons` - Icon libraries
- `framer-motion` - Animations
- `react-markdown`, `rehype-raw`, `remark-gfm` - Markdown rendering
- `xlsx` - Client-side Excel operations

### Critical Workflows

#### Creating New Subject Areas or Data Details

1. `SubjectAreaController::store` or `DataDetailController::store` triggers `CreateDataTable`
2. Dynamic table scaffolding creates typed columns (dimensions, measures, dates)
3. Metadata structures are auto-created and synced
4. On failure, tables must be rolled back (see existing try/catch patterns)

#### Data Loading Jobs

1. `DataLoaderQuery` defines fetch logic (REST API, WebSocket, Database)
2. `RunScheduledJob` orchestrates execution
3. Fetchers stream JSON responses to avoid memory issues
4. `ImportToDataTable` flattens JSON via `FlattenJsonResponse`, syncs metadata via `SyncColumnMetaData`
5. Job status and errors logged to `DataLoaderJobStatus`

#### Subset Documentation

- Generated by `SubsetDocumentationGenerator`
- Ensure new subset fields include descriptions to avoid empty docs
- Uses Gemini integration (`GeminiService`) with `.env` config (`app.gemini_*`)

### Environment & Setup

1. Copy `.env.example` to `.env` and configure database, Gemini API keys
2. `composer install && npm install`
3. `php artisan key:generate`
4. `php artisan migrate`
5. Seed data: `php artisan db:seed` (uses `database/seeders/` and `database/data/`)
6. Development: `npm run dev` (Vite) + `php artisan serve` (or Sail)

### Testing & Quality

**Mandatory checks before commits**:

- `php artisan test` - Pest tests with `RefreshDatabase`
- `vendor/bin/pint` - PHP code formatting
- `vendor/bin/phpstan analyse` - Static analysis
- `npm run tsc-check` - TypeScript type checking
- ESLint + Prettier (configured in `package.json`)

### Security & Validation

- **Always validate**: Use Laravel Data DTOs or Form Requests; never use raw request data
- **Authentication**: Most routes require `auth` middleware via `HasMiddleware`
- **API Authentication**: Laravel Sanctum for API tokens
- **Large imports**: Stream through DataLoader fetchers; avoid loading unbounded arrays
- **Public APIs**: Ensure authenticated; follow resource route conventions in `routes/web.php`

This ensures consistency across the codebase and reduces boilerplate.

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines
should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an
expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.2.29
- inertiajs/inertia-laravel (INERTIA) - v1
- laravel/framework (LARAVEL) - v11
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- tightenco/ziggy (ZIGGY) - v2
- larastan/larastan (LARASTAN) - v2
- laravel/breeze (BREEZE) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v2
- phpunit/phpunit (PHPUNIT) - v10
- eslint (ESLINT) - v8
- prettier (PRETTIER) - v3
- @inertiajs/react (INERTIA) - v1
- react (REACT) - v18
- tailwindcss (TAILWINDCSS) - v3

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling
  files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature
  tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`,
  `npm run dev`, or `composer run dev`. Ask them.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

=== boost rules ===

## Laravel Boost

- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available
  parameters.

## URLs

- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the
  correct scheme, domain / IP, and port.

## Tinker / Debugging

- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool

- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)

- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically
  passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific
  documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you
  need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament,
  Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example:
  `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`,
  not `filament 4 test resource table`.

### Available Search Syntax

- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms

=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments

- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex
  going on.

## PHPDoc Blocks

- Add useful array shape type definitions for arrays when appropriate.

## Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS
  bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v1 rules ===

## Inertia v1

- Inertia v1 does _not_ come with these features. Do not recommend using these Inertia v2 features directly.
    - Polling
    - Prefetching
    - Deferred props
    - Infinite scrolling using merging props and `WhenVisible`
    - Lazy loading data on scroll

=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list
  available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the
  correct `--options` to ensure correct behavior.

### Database

- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries
  or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing
  them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other
  things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you
  should follow existing application convention.

### Controllers & Validation

- Always create Form Request classes for validation rather than inline validation in controllers. Include both
  validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization

- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration

- Use environment variables only in configuration files - never use the `env()` function directly outside of config
  files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be
  used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to
  use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] <name>` to create a feature test, and pass `--unit`
  to create a unit test. Most tests should be feature tests.

### Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run
  `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== laravel/v11 rules ===

## Laravel 11

- Use the `search-docs` tool to get version specific documentation.
- Laravel 11 brought a new streamlined file structure which this project now uses.

### Laravel 11 Structure

- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual
  registration.

### Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column.
  Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing
  conventions from other models.

### New Artisan Commands

- List Artisan commands using Boost's MCP tool, if available. New commands available in Laravel 11:
    - `php artisan make:enum`
    - `php artisan make:class`
    - `php artisan make:interface`

=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected
  style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.

=== pest/core rules ===

## Pest

### Testing

- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests

- All tests must be written using Pest. Use `php artisan make:test --pest <name>`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or
  helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
  <code-snippet name="Basic Pest Test Example" lang="php">
  it('is true', function () {
  expect(true)->toBeTrue();
  });
  </code-snippet>

### Running Tests

- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a
  related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to
  ensure everything is still passing.

### Pest Assertions

- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead
  of using `assertStatus(403)` or similar, e.g.:
  <code-snippet name="Pest Example Asserting postJson Response" lang="php">
  it('returns all', function () {
  $response = $this->postJson('/api/docs', []);

  $response->assertSuccessful();
  });
  </code-snippet>

### Mocking

- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via
  `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets

- Use datasets in Pest to simplify tests which have a lot of duplicated data. This is often the case when testing
  validation rules, so consider going with this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>


=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="react">

import { Link } from '@inertiajs/react'
<Link href="/">Home</Link>

</code-snippet>


=== inertia-react/v1/forms rules ===

## Inertia + React Forms

- For form handling in Inertia pages, use `router.post` and related methods. Do not use regular forms.

<code-snippet name="Inertia React Form Example" lang="react">
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function Edit() {
const [values, setValues] = useState({
first_name: "",
last_name: "",
email: "",
})

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value

        setValues(values => ({
            ...values,
            [key]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        router.post('/users', values)
    }

    return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First name:</label>
        <input id="first_name" value={values.first_name} onChange={handleChange} />
        <label htmlFor="last_name">Last name:</label>
        <input id="last_name" value={values.last_name} onChange={handleChange} />
        <label htmlFor="email">Email:</label>
        <input id="email" value={values.email} onChange={handleChange} />
        <button type="submit">Submit</button>
    </form>
    )

}
</code-snippet>

=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing
  your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or
  child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing

- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>

### Dark Mode

- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way,
  typically using `dark:`.

=== tailwindcss/v3 rules ===

## Tailwind 3

- Always use Tailwind CSS v3 - verify you're using only classes supported by this version.

=== .ai/backend-guidelines rules ===

<h2>Project Structure & Architecture</h2>
<ul>
    <li>Group backend classes by feature inside default Laravel folders (Controllers, Models, Services, Requests,
        Policies, etc.).</li>
    <li>Use final classes for controllers, services, actions, requests, models to prevent unintended inheritance.</li>
    <li>Prefer read-only promoted constructor properties for dependencies; avoid public mutable state.</li>
    <li>No business logic inside controllers; delegate to small single-purpose service/action classes.</li>
    <li>Keep classes focused: max ~300 lines; methods &lt;= 80 lines (strive for much smaller).</li>
</ul>

<h2>Naming & Conventions</h2>
<ul>
    <li>PascalCase class names; singular nouns (e.g. <code>ProjectInstance</code>, <code>ReferenceDataParameter</code>).
    </li>
    <li>Method names in camelCase starting with a verb (e.g. <code>storeRecord</code>, <code>verifySecondValue</code>).
    </li>
    <li>Boolean method prefixes: is / has / can / should (e.g. <code>isAuthorized</code>, <code>hasSecondValue</code>).
    </li>
    <li>Constants in UPPER_SNAKE_CASE.</li>
    <li>Use imported class names instead of fully-qualified inline references.</li>
</ul>

<h2>Class Design & Dependencies</h2>
<ul>
    <li>Inject dependencies via constructor (property promotion) — never instantiate heavy collaborators inline.</li>
    <li>Prefer interfaces for abstractions that may change (e.g. external gateways, complex domain services).</li>
    <li>Keep service classes single-action; compose multiple services for orchestration.</li>
    <li>Use value objects or enums for constrained primitives instead of raw strings/ints.</li>
</ul>

<h2>Type Safety & Data Handling</h2>
<ul>
    <li>Explicitly type every parameter & return; if impossible, document using PHPDoc with precise shapes.</li>
    <li>Document array shapes with PHPDoc; extract DTOs (Spatie Data) for multi-dimensional structures.</li>
    <li>Prefer DTOs over associative arrays for request/response boundaries.</li>
    <li>Use enums for fixed sets; value objects (e.g. Money, Email) for domain invariants.</li>
</ul>

<h2>Validation & Authorization</h2>
<ul>
    <li>Never consume request input before validation.</li>
    <li>Use Spatie Data attribute validation for structured form/data requests; Form Requests only for simple or legacy
        cases.</li>
    <li>Centralize authorization via policies / Gate::allows inside Data::authorize when following project pattern.</li>
    <li>Prefer <code>Gate::authorize()</code> or policy helpers over manual conditionals.</li>
</ul>

<h2>Error Handling</h2>
<ul>
    <li>Wrap persistence mutations in try/catch; convert user-facing validation branches into ErrorResponse objects.
    </li>
    <li>Surface unexpected exceptions through <code>ExceptionMessage::getMessage()</code> for production safety.</li>
</ul>

<h2>Database & Performance</h2>
<ul>
    <li>Use Eloquent ORM and relationships; avoid raw queries unless justified for performance.</li>
    <li>Prevent N+1 via eager loading (select only required columns).</li>
    <li>Chunk large data operations; queue long-running tasks instead of blocking HTTP cycle.</li>
    <li>Add indexes for frequently filtered columns; analyze slow queries before optimizing code paths.</li>
    <li>Use caching strategically for read-heavy, slow-to-compute aggregates.</li>
</ul>

<h2>Security</h2>
<ul>
    <li>Route groups must enforce authentication for any state-changing endpoint.</li>
    <li>Avoid using <code>env()</code> outside config files; read via <code>config()</code>.</li>
    <li>Validate file uploads and use centralized FileSaver abstraction.</li>
</ul>

<h2>Middleware & Cross-Cutting Concerns</h2>
<ul>
    <li>Implement custom middleware for recurring concerns (feature flags, subscription state) rather than scattering
        checks.</li>
    <li>Keep middleware lean—delegate heavy logic to services.</li>
</ul>


<h2>Documentation & Maintainability</h2>
<ul>
    <li>Prefer self-expressive naming over inline comments; reserve comments for clarifying domain rules.</li>
</ul>


=== .ai/frontend-guidelines rules ===

<h2>Structure & Organization</h2>
<ul>
    <li>Organize code by feature inside domain folders (Components, Hooks, Pages, Layout, Libs, DataStructures, ui for
        shadcn).</li>
    <li>Keep reusable cross-feature components in a shared directory; avoid duplication.</li>
    <li>All shadcn components live under <code>ui</code> retaining original filenames.</li>
    <li>Use kebab-case (preferred) or camelCase for file & folder names; components/pages keep PascalCase exports.</li>
</ul>

<h2>Component Design</h2>
<ul>
    <li>Single responsibility per component; extract reusable UI fragments promptly.</li>
    <li>Do not nest component declarations inside other components; declare at module top scope.</li>
    <li>Prefer logical <code>&amp;&amp;</code> operator for conditional rendering instead of ternary operators or switch
        statements; extract complex conditions into separate functions/components.</li>
    <li>Props must be readonly (TypeScript <code>readonly</code> or inferred immutability).</li>
    <li>Co-locate feature interfaces/types in a single <code>types.ts</code> (or similar) file per feature.</li>
</ul>

<h2>Hooks & State</h2>
<ul>
    <li>Encapsulate data fetching / complex state in custom hooks instead of inline useEffect logic in components.</li>
    <li>Custom hook names start with <code>use</code> and describe purpose (e.g. <code>useProjectMetrics</code>).</li>
    <li>Call hooks only at top level of components or other hooks (never in conditions/loops).</li>
    <li>Don't pass hook functions themselves as props—expose derived callbacks/state values instead.</li>
    <li>Use Inertia's <code>usePage</code> to access page props.</li>
    <li>Always wrap functions that are being passed to child components in useCallback.</li>
</ul>

<h2>Performance</h2>
<ul>
    <li>Memoize expensive calculations with <code>useMemo</code>.</li>
    <li>Always supply dependency arrays; never omit them.</li>
    <li>Wrap pure presentational components with <code>React.memo</code> when prop churn risks re-render cost.</li>
    <li>Reserve <code>useLayoutEffect</code> only for pre-paint DOM measurements.</li>
</ul>

<h2>Data & Logic</h2>
<ul>
    <li>Use nullish coalescing <code>??</code> instead of logical OR for defaulting.</li>
    <li>Favor custom hooks over ad-hoc effects for side-effects & fetching.</li>
    <li>Use <code>useSyncExternalStore</code> for subscription-based external sources.</li>
    <li>All JSON fields use snake_case; map to camelCase in TypeScript layer if desired (centralize mapping).</li>
</ul>

<h2>Routing</h2>
<ul>
    <li>Use global <code>route()</code> helper (Ziggy) without importing from ziggy-js.</li>
</ul>

<h2>Styling</h2>
<ul>
    <li>Prefer Tailwind <code>gap-*</code> utilities over space-* where layout allows.</li>
</ul>

<h2>Naming</h2>
<ul>
    <li>Components & enums in PascalCase (enum members UPPER_SNAKE_CASE).</li>
    <li>Variables, functions, and props in camelCase; boolean prefixed with is/has/can/should.</li>
    <li>Event handlers prefixed with handle / on (e.g. <code>handleSubmit</code>).</li>
    <li>Context provider files use <code>-context</code> suffix.</li>
    <li>Use single-letter generic type params (T, U, V...).</li>
</ul>

<h2>TypeScript</h2>
<ul>
    <li>All component props must be typed via interfaces or type aliases.</li>
    <li>Define hook return types explicitly when not inferred clearly.</li>
    <li>Use enums for discrete sets; discriminated unions for variant states.</li>
</ul>
</laravel-boost-guidelines>
