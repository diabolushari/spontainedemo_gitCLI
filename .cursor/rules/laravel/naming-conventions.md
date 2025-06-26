# PHP Variable Naming Best Practices

1. **Use clear and descriptive names**

   - Choose names that describe the variable's purpose or content.
   - Avoid single-letter or vague names (except for common loop counters).

   ```php
   // ❌ Bad
   $d = '2025-04-27';
   $x = 10;

   // ✅ Good
   $currentDate = '2025-04-27';
   $userCount = 10;
   ```

2. **Use camelCase for variable names**

   - Start with a lowercase letter, capitalize each subsequent word.

   ```php
   // ❌ Bad
   $User_Name = 'Swaraj';
   $user_name = 'Swaraj';

   // ✅ Good
   $userName = 'Swaraj';
   ```

3. **Avoid abbreviations and acronyms unless widely known**

   - Spell out words for clarity.

   ```php
   // ❌ Bad
   $usrNm = 'Swaraj';

   // ✅ Good
   $userName = 'Swaraj';
   ```

4. **Use plural names for arrays or collections**

   - Indicate when a variable holds multiple items.

   ```php
   // ❌ Bad
   $user = [/* ... */];

   // ✅ Good
   $users = [/* ... */];
   ```

5. **Class Naming and Autoloading Conventions**

   - Use PascalCase (StudlyCase) for class names, e.g., `InvoiceGenerator`, `UserProfile`, `OrderItem`.
   - Use singular nouns for class names (e.g., `Product`, not `Products`).
   - Class names should match their file names exactly (case-sensitive).
   - Organize classes in folders that match their namespaces, following PSR-4 autoloading conventions (used by Composer and Laravel).

   ```php
   // ❌ Bad: Plural, lowercase, or mismatched name
   class users {}
   // File: app/Models/users.php

   // ❌ Bad: File and class name do not match
   class Invoice {}
   // File: app/Models/InvoiceModel.php

   // ✅ Good: PascalCase, singular, file and class name match
   class User {}
   // File: app/Models/User.php

   // ✅ Good: Namespace and folder structure match
   namespace App\Services\Billing;
   class InvoiceGenerator {}
   // File: app/Services/Billing/InvoiceGenerator.php
   ```

6. **Method Naming Conventions**

   - Use camelCase for method names, starting with a verb (e.g., `getData`, `sendEmail`, `calculateTotal`).
   - Prefix boolean methods with `is`, `has`, `can`, or `should` (e.g., `isValid`, `hasPermission`).
   - Use descriptive names that indicate what the method does.
   - For Laravel controller methods, follow the resource controller conventions (`index`, `show`, `store`, `update`, `destroy`).

   ```php
   // ❌ Bad: Unclear or not verb-first
   public function userData() { /* ... */ }
   public function valid() { /* ... */ }

   // ✅ Good: Verb-first, descriptive
   public function getUserData() { /* ... */ }
   public function validateInput() { /* ... */ }
   public function isValid() { /* ... */ }
   ```

7. **Enum and Constant Naming Conventions**

   - Use UPPER_SNAKE_CASE for constants (e.g., `MAX_ATTEMPTS`, `API_KEY`).
   - For PHP 8.1+ enums, use PascalCase for the enum name and for enum cases.
   - Group related constants in enum-like classes when using PHP < 8.1.

   ```php
   // ❌ Bad: Inconsistent constant naming
   const maxAttempts = 5;
   const api-key = 'secret';

   // ✅ Good: Constants with UPPER_SNAKE_CASE
   const MAX_ATTEMPTS = 5;
   const API_KEY = 'secret';

   // ✅ Good: PHP 8.1+ enum
   enum OrderStatus
   {
       case Pending;
       case Processing;
       case Completed;
       case Cancelled;
   }

   // ✅ Good: Enum-like class for PHP < 8.1
   final class OrderStatus
   {
       const PENDING = 'pending';
       const PROCESSING = 'processing';
       const COMPLETED = 'completed';
       const CANCELLED = 'cancelled';
   }
   ```

8. **Use Appropriate Class Suffixes**

   - Append descriptive suffixes to class names based on their role or responsibility.
   - Common Laravel suffixes: `Controller`, `Request`, `Resource`, `Job`, `Event`, `Listener`, `Policy`, `Rule`, `Middleware`.
   - For DTOs (Data Transfer Objects), append `DTO` or `Data`.
   - For services, append `Service`.

   ```php
   // ❌ Bad: Missing or incorrect suffixes
   class UserControl {}
   class CreateUser {}
   class UserValidation {}

   // ✅ Good: Clear, role-specific suffixes
   class UserController {}
   class CreateUserRequest {}
   class UserResource {}
   class UserData {} // or UserDTO
   class UserCreationService {}
   ```

9. **Use temporary names only for short-lived values**

   - Use names like $i, $j, $tmp only inside small scopes (e.g., loops).
   - Avoid using these names for variables that persist outside a small block.

   ```php
   // ✅ Good (in a for loop)
   for ($i = 0; $i < 10; $i++) {
       // ...
   }

   // ❌ Bad: Using temporary names for important values
   function processData($arr) {
       $tmp = $arr[0];
       // ... many lines of code ...
       return $tmp; // What was $tmp again?
   }

   // ✅ Good: Descriptive names for important values
   function processData($data) {
       $firstRecord = $data[0];
       // ... many lines of code ...
       return $firstRecord;
   }
   ```

10. **Be consistent**

- Follow the same naming conventions throughout your codebase.
- If working in a team or on a framework (like Laravel), follow the project's established style.
- When extending existing code, match the style of the surrounding code even if it differs from these guidelines.

```php
// ❌ Bad: Inconsistent naming in the same file
$user_name = 'John';
$userEmail = 'john@example.com';

// ✅ Good: Consistent naming
$userName = 'John';
$userEmail = 'john@example.com';
```

11. **PHP Associative Array Keys**

- PHP associative array keys must be snake_case.
- Example:

  ```php
  // Good
  $user = [
      'first_name' => 'John',
      'last_name' => 'Doe',
      'user_id' => 1,
  ];

  // Bad
  $user = [
      'firstName' => 'John',
      'lastName' => 'Doe',
      'userId' => 1,
  ];
  ```
