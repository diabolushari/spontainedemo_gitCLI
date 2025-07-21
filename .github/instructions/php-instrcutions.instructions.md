---
applyTo: '**/*.php, **/*.blade.php'
---

- Controllers, Services, Actions, Requests, Models etc should be grouped together in their respective folders based on the feature they belong to.
- Use final classes for controllers, services, actions, requests, models etc to prevent inheritance and unexpected behavior from inheritance.
- Use read-only properties for controllers, services, actions, requests, models etc to prevent property mutations.
- Every variable, parameter and return type should be explicitly typed. If you cant, use PHPDoc to explicitly define the type.
- For multi dimensional arrays, create a DTO (Data Transfer Object) to define the structure.
- Prefer DTOs over arrays when possible. since arrays are not type-safe and can lead to runtime errors.
- Always validate data received through requests. use laravel-data for DTOs, for simple requests like search use Laravel's validation.
- Use Laravel's built-in authentication and authorization features (Sanctum, Policies) for secure authentication and authorization.
- always use imports instead of qualifiers in code like App\Models\Service::class
- use ExceptionMessage class to hide error messages in production and show error in test.
