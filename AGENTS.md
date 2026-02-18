# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Laravel backend code, organized by feature across `Http/Controllers`, `Models`, and `Services` (for example, `app/Services/DataLoader` and `app/Services/Subset`).
- `resources/js/` contains the Inertia + React + TypeScript frontend: route pages in `Pages/`, reusable feature components in `Components/` and `Chat/`, and UI primitives in `ui/` / `components/ui/`.
- `routes/` defines HTTP entry points (`web.php`, `api.php`, `auth.php`).
- `database/` stores migrations, factories, seeders, and seed data (`database/data/`).
- `tests/` is split into `Feature/`, `Unit/`, and service-focused tests.

## Build, Test, and Development Commands
- `composer install && npm install`: install PHP and Node dependencies.
- `cp .env.example .env && php artisan key:generate`: initialize local environment.
- `php artisan migrate`: apply database schema changes.
- `php artisan serve` and `npm run dev`: run backend and Vite dev servers.
- `npm run build`: build production frontend assets.
- `php artisan test` (or `vendor/bin/phpunit`): run backend test suite.
- `./vendor/bin/phpstan analyse`: run Larastan/PHPStan checks (`level: 8`).
- `./vendor/bin/pint`: format PHP code.
- `npm run tsc-check`: run TypeScript checks.
- `npx eslint resources/js --ext .ts,.tsx`: lint frontend code.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: 4-space indentation by default; YAML uses 2 spaces.
- Frontend formatting follows Prettier (`.prettierrc`): single quotes, no semicolons, 100-char line width.
- Use PascalCase for PHP classes and React components/pages (for example, `SubsetController.php`, `OrganizationEditPage.tsx`).
- Use camelCase for hooks/utilities (for example, `useFetchList.tsx`), and snake_case for DB/JSON field keys.
- Keep controllers thin; place domain logic in `app/Services/*`.

## Testing Guidelines
- Pest is configured on top of PHPUnit (`tests/Pest.php`), with `RefreshDatabase` enabled for Feature tests.
- Keep test files in `tests/Feature` or `tests/Unit` and name them `*Test.php`.
- Prefer factories and seeders for test data over manual inserts.

## Commit & Pull Request Guidelines
- Follow the repository’s Conventional Commit pattern seen in history: `feat: ...`, `refactor: ...`, `chore: ...`.
- Write imperative, focused commit subjects (for example, `feat: add widget collection search endpoint`).
- PRs should include: a short summary, linked issue/task, commands run for validation, and screenshots/GIFs for UI changes.

## Security & Configuration Tips
- Never commit secrets or local overrides from `.env`; use `.env.example` as the baseline.
- Configure integrations via environment variables (`GEMINI_*`, `CHAT_*`, `QDRANT_*`) and access them through config, not hardcoded values.
