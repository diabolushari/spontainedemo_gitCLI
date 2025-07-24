---
applyTo: '**/*.php, **/*.blade.php'
---

## Project Structure & Architecture

- Use Laravel's default folders (Controllers, Models, Services, Requests, etc.). Inside each folder, group files by feature using subfolders.
- For very large projects or multi-team environments, consider using a modular structure with packages like nwidart/laravel-modules.
- Controllers, Services, Actions, Requests, Models etc should be grouped together in their respective folders based on the feature they belong to.
- Use final classes for controllers, services, actions, requests, models etc to prevent inheritance and unexpected behavior from inheritance.
- Use read-only properties for controllers, services, actions, requests, models etc to prevent property mutations.
- Always use imports instead of qualifiers in code like App\Models\Service::class.

## Naming Conventions

- Use PascalCase for class names (e.g., `InvoiceGenerator`, `UserProfile`, `OrderItem`).
- Use singular nouns for class names (e.g., `Product`, not `Products`).
- Class names should match their file names exactly (case-sensitive).
- Use camelCase for variable names and method names (e.g., `$userName`, `getUserData()`).
- Use camelCase for method names, starting with a verb (e.g., `getData`, `sendEmail`, `calculateTotal`).
- Prefix boolean methods with `is`, `has`, `can`, or `should` (e.g., `isValid`, `hasPermission`).
- Use UPPER_SNAKE_CASE for constants (e.g., `MAX_ATTEMPTS`, `API_KEY`).
- Use appropriate class suffixes: `Controller`, `Request`, `Resource`, `Job`, `Event`, `Listener`, `Policy`, `Rule`, `Middleware`, `Service`, `Data`/`DTO`.
- PHP associative array keys must be snake_case (e.g., `['first_name' => 'John', 'user_id' => 1]`).
- Be consistent with naming conventions throughout your codebase.

## Class Design & Single Responsibility

- Keep classes and methods focused (Single Responsibility Principle) - each class should have a single responsibility.
- Classes should generally not exceed 300 lines, methods should not exceed 80 lines.
- Controllers should either be resource controllers or single action controllers (invokable).
- Use contracts (interfaces) for abstraction and flexibility.
- Use private or protected visibility by default, only use public when necessary.
- Always inject dependencies via constructor, not by instantiating them inside the class.
- No business logic in controllers - delegate to services or actions.

## Type Safety & Data Handling

- Every variable, parameter and return type should be explicitly typed. If you can't, use PHPDoc to explicitly define the type.
- Use PHPDoc for generics and complex types: `@param Collection<User> $users`, `@return User|null`.
- For local variables, use PHPDoc `@var` annotations: `/** @var Collection<User> $users */`.
- Document array shapes with PHPDoc: `@return array{id: int, name: string, address: array{street: string, city: string}}`.
- For multi dimensional arrays, create a DTO (Data Transfer Object) to define the structure.
- Prefer DTOs over arrays when possible, since arrays are not type-safe and can lead to runtime errors.
- Use Laravel Data package for DTOs when dealing with complex data structures.
- Use enums for fixed sets of values instead of strings or integers.
- Create value objects for domain-specific primitives (Email, Money, etc.).

## Validation & Security

- Never use request data without validation.
- Use laravel-data with PHP attribute annotations for DTO validation.
- Use Laravel's built-in validation for simple/search requests.
- Use Form Requests for reusable validation logic.
- Use Gate::authorize instead of manual authorization checks in controllers.
- For FormRequest validation, handle authorization in the FormRequest's authorize() method.
- Group routes using Laravel route groups for authentication and guest middleware.
- Apply validation rules using Form Requests for complex validation logic.
- Use the `validated()` method to retrieve only validated input data.
- For API routes, protect them with appropriate middleware (e.g., `auth:sanctum`, `auth:api`).
- Validate signed URLs using the `signed` middleware or manually with `hasValidSignature()`.

## Database & Performance Best Practices

- Prefer Eloquent ORM for database operations over raw queries or query builder.
- Wrap create/update SQL operations in try-catch blocks for proper error handling.
- Chunk mass insertions and mass deletions to avoid memory issues.
- Queue long-running processes like sending mail - never perform synchronously in HTTP requests.
- Use Laravel's caching mechanisms appropriately.
- Implement proper database indexing for performance.

## Service Container & Dependency Injection

- Use automatic dependency injection in controller constructors by type-hinting services.
- Bind interfaces to concrete implementations in service providers.
- Leverage Laravel's service container for managing dependencies.

## Configuration & Environment

- Do not use env() directly in application code - always use config() helper.
- Configure environment variables in config files, then use config() to access them.

## Middleware Best Practices

- Create custom middleware for cross-cutting concerns like subscription validation, feature flags, etc.
- Apply middleware to routes or groups for consistent protection.
- Use middleware parameters to make middleware more flexible and reusable.

## Error Handling & Production

- Use ExceptionMessage class to hide error messages in production and show errors in test environment.
- Implement proper exception handling for different environments.
- Use Laravel's built-in error handling mechanisms.

## API Development

- Use Laravel Sanctum for API authentication.
- Implement proper API versioning strategies.
- Use Laravel's API resources for consistent data transformation.
- Apply rate limiting to API endpoints.

## Testing & Quality

- Write tests for all critical application logic.
- Use Laravel's testing utilities and factories.
- Implement proper test data management.

## Security Best Practices

- Always sanitize user input and prevent XSS attacks.
- Use prepared statements and avoid SQL injection.
- Implement proper CSRF protection.
- Use HTTPS for production applications.
- Implement proper session management.
