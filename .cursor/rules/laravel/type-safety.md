# Type Safety in Laravel/PHP: A Practical Guide

Type safety in Laravel and PHP is essential for building robust, maintainable applications. This guide walks you through the different ways to enforce and document types in your codebase, from PHP's built-in type system to advanced PHPDoc annotations and data transfer objects (DTOs).

---

## 1. Native Type Declarations

Always use explicit parameter and return type hints for functions and methods whenever possible. This prevents many classes of runtime errors and improves IDE support.

```php
// ❌ Bad: Missing type declarations
function getUsers($status)
{
    $users = User::where('status', $status)->get();
    return $users;
}

// ✅ Good: Explicit type declarations
function getUsers(string $status): Collection
{
    $users = User::where('status', $status)->get();
    return $users;
}
```

---

## 2. PHPDoc for Generics and Complex Types

PHP's type system does not support generics or some complex types. Use PHPDoc to describe these cases for better static analysis and documentation.

```php
/**
 * @param string $status
 * @return Collection<User>
 */
function getUsers(string $status): Collection
{
    $users = User::where('status', $status)->get();
    return $users;
}
```

---

## 3. Local Variable Type Declarations

PHP does not support local variable type hints, but you can use PHPDoc `@var` annotations for static analysis and clarity.

```php
/** @var UserData $userData */
$userData = new UserData(
    id: 1,
    name: 'John Doe',
    address: new AddressData(
        street: '123 Main St',
        city: 'New York'
    )
);

/** @var Collection<User> $users */
$users = User::where('status', $status)->get();
```

---

## 4. PHPDoc for Classes and Generics

Document class-level properties and generics using PHPDoc. This is especially useful for containers or repositories.

```php
/**
 * @property-read Collection<User> $users
 */
final class DataContainer
{
    /**
     * @param Collection<User> $items
     */
    public function __construct(
        public readonly Collection $items
    ) {}

    /**
     * @return User|null
     */
    public function first(): ?User
    {
        return $this->items->first();
    }
}
```

---

## 5. Documenting Array Shapes with PHPDoc

PHPDoc allows you to describe the expected structure of arrays using array shapes. This is especially useful for functions that return or accept associative arrays with known keys.

```php
/**
 * @return array{
 *     id: int,
 *     name: string,
 *     address: array{street: string, city: string}
 * }
 */
function getUserDataArray(): array
{
    return [
        'id' => 1,
        'name' => 'John Doe',
        'address' => [
            'street' => '123 Main St',
            'city' => 'New York',
        ],
    ];
}
```

---

## 6. Data Transfer Objects (DTOs) for Structured Data

For multi-dimensional arrays or structured data, define DTO classes to make your data structures explicit and type-safe.

```php
// ❌ Bad: Using multi-dimensional arrays
function getUserData(): array
{
    return [
        'id' => 1,
        'name' => 'John Doe',
        'address' => [
            'street' => '123 Main St',
            'city' => 'New York',
        ],
    ];
}

// ✅ Good: Using DTOs
final class AddressData
{
    public function __construct(
        public readonly string $street,
        public readonly string $city
    ) {}
}

final class UserData
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly AddressData $address
    ) {}
}

function getUserData(): UserData
{
    return new UserData(
        id: 1,
        name: 'John Doe',
        address: new AddressData(
            street: '123 Main St',
            city: 'New York'
        )
    );
}
```

---

## 7. Prefer DTOs Over Arrays for Data Transfer

DTOs ensure all required fields are present and correctly typed, reducing runtime errors.

```php
// ❌ Bad: Using arrays for data transfer
function createUser(array $userData): User
{
    // What if $userData is missing required fields?
    return User::create($userData);
}

// ✅ Good: Using DTOs for data transfer
function createUser(CreateUserData $userData): User
{
    // DTO ensures all required fields are present and correctly typed
    return User::create($userData->toArray());
}
```

---

## 8. Advanced PHP Type System Features

### 8.1 Enums (PHP 8.1+)

Use enums for fixed sets of values instead of strings or integers.

```php
enum UserRole: string {
    case Admin = 'admin';
    case User = 'user';
}

function promote(UserRole $role): void
{
    // ...
}
```

### 8.2 Value Objects

Encapsulate primitives (like email, money, etc.) in small immutable classes for type safety and domain clarity.

```php
final class Email
{
    public function __construct(public readonly string $value)
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email');
        }
    }
}

function sendWelcome(Email $email): void
{
    // ...
}
```

### 8.3 DTO vs Value Object: What's the Difference?

| Aspect     | DTO (Data Transfer Object)          | Value Object                          |
| ---------- | ----------------------------------- | ------------------------------------- |
| Purpose    | Transfer structured data            | Represent a domain concept/value      |
| Mutability | Often mutable (but can be readonly) | Always immutable                      |
| Equality   | Compared by property values         | Compared by property values           |
| Usage      | Data transfer between layers        | Domain logic, validation, type safety |
| Example    | `UserData`, `CreateUserData`        | `Email`, `Money`, `Uuid`              |
| Validation | Optional or external                | Usually validates on construction     |

**Example DTO:**

```php
final class UserData
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email
    ) {}
}
```

**Example Value Object:**

```php
final class Email
{
    public function __construct(public readonly string $value)
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email');
        }
    }
}
```

---

## 9. Project-wide Enforcement & Best Practices

- **Static Analysis in CI:** Integrate PHPStan or Psalm (with Larastan for Laravel) into your CI pipeline to enforce type safety.
- **IDE Integration:** Use an IDE with PHPStan/Psalm support for real-time feedback.
- **Adopt a strict baseline:** Start with a permissive level and increase strictness over time.
- **Documentation:** Document your type safety standards in your project's contribution guide.

---

## 10. Decision Guide: When to Use Which Type System Feature

| Scenario                          | Use Native Type | Use PHPDoc | Use Array Shape | Use DTO | Use Enum/Value Object |
| --------------------------------- | :-------------: | :--------: | :-------------: | :-----: | :-------------------: |
| Simple scalar or object           |        ✓        |            |                 |         |                       |
| Collection of objects             |                 |     ✓      |                 |         |                       |
| Structured associative array      |                 |     ✓      |        ✓        |         |                       |
| Complex/nested data structure     |                 |     ✓      |        ✓        |    ✓    |                       |
| Domain-specific primitive (Email) |                 |            |                 |         |           ✓           |
| Fixed set of values (roles, etc.) |                 |            |                 |         |           ✓           |

---

By combining native types, PHPDoc, DTOs, value objects, enums, and static analysis, you can achieve strong type safety in Laravel/PHP projects. This not only prevents bugs but also makes your codebase easier to maintain and refactor.
