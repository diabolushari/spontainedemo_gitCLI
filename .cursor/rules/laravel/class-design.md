## Class Design

1. **Keep classes and methods focused (Single Responsibility Principle).**

   Each class should have a single responsibility. If a class is doing too much, split it into smaller, focused classes. Methods should also do one thing and do it well.

   ```php
   // ❌ Bad: Class with too many unrelated responsibilities
   final class UserManager
   {
       public function createUser(array $data) { /* ... */ }
       public function sendWelcomeEmail(User $user) { /* ... */ }
       public function exportUsersToCsv() { /* ... */ }
   }

   // ✅ Good: Split into focused classes
   final class UserCreator { /* ... */ }
   final class WelcomeEmailSender { /* ... */ }
   final class UserExporter { /* ... */ }
   ```

   ```php
   // ❌ Bad: Method does too much (validation, creation, notification, and logging all together)
   public function process(array $data)
   {
       // Validate data
       if (empty($data['email'])) {
           throw new InvalidArgumentException('Email is required');
       }

       // Create user
       $user = User::create($data);

       // Send welcome email
       Mail::to($user->email)->send(new WelcomeMail($user));

       // Log action
       Log::info("User {$user->id} created and notified.");
   }

   // ✅ Good: Method delegates to smaller, focused methods
   public function process(array $data)
   {
       $user = $this->createUser($data);
       $this->sendWelcomeEmail($user);
       $this->logCreation($user);
   }

   private function createUser(array $data): User
   {
       // Validation and creation logic
   }

   private function sendWelcomeEmail(User $user): void
   {
       // Notification logic
   }

   private function logCreation(User $user): void
   {
       // Logging logic
   }
   ```

2. **Use contracts (interfaces) for abstraction and flexibility.**

   Define interfaces for services or repositories that may have multiple implementations. This improves testability and allows for easy swapping of implementations.

   ```php
   interface NotificationService
   {
       public function send(string $message): void;
   }

   final class EmailNotificationService implements NotificationService
   {
       public function send(string $message): void
       {
           // ...
       }
   }
   ```

3. **Use final classes for controllers, services, actions, requests, models etc to prevent inheritance and unexpected behavior from inheritance.**

   ```php
   // ❌ Bad: Class can be extended
   class UserController extends Controller
   {
       // ...
   }

   // ✅ Good: Final class prevents inheritance
   final class UserController extends Controller
   {
       // ...
   }
   ```

4. **Use read-only properties for controllers, services, actions, requests, models etc to prevent property mutations.**

   ```php
   // ❌ Bad: Primitive property can be mutated
   final class RetryConfig
   {
       public int $maxAttempts;

       public function __construct(int $maxAttempts)
       {
           $this->maxAttempts = $maxAttempts;
       }

       public function increaseAttempts(): void
       {
           $this->maxAttempts++;
       }
   }

   // ✅ Good: Read-only primitive property
   final class RetryConfig
   {
       public function __construct(
           public readonly int $maxAttempts,
       ) {}
   }
   ```

5. **Controllers should either be resource controllers or single action controllers.**

   Resource controllers handle CRUD actions for a resource and use standard method names (index, create, store, show, edit, update, destroy). Single action controllers (invokable) perform one operation and only implement `__invoke`.

   ```php
   // ✅ Good: Resource controller
   final class PostsController extends Controller
   {
       public function index() { /* ... */ }
       public function store(Request $request) { /* ... */ }
       public function show(Post $post) { /* ... */ }
       public function update(Request $request, Post $post) { /* ... */ }
       public function destroy(Post $post) { /* ... */ }
   }

   // ✅ Good: Single action controller
   final class PublishPostController extends Controller
   {
       public function __invoke(Post $post)
       {
           // ...
       }
   }
   ```

6. **Visibility and Encapsulation**

   Use `private` or `protected` for properties and methods by default. Only use `public` when necessary to expose functionality.

   ```php
   // ❌ Bad: Exposes internal details as public
   public function calculateFee() { /* ... */ }

   // ✅ Good: Use private for internal details
   private function calculateFee() { /* ... */ }
   ```

7. **Trait Usage**

   Use traits sparingly and only for truly shared behavior. Avoid using traits as a dumping ground for unrelated methods.

   ```php
   trait UsesUuid {
       public function initializeUuid() { /* ... */ }
   }
   ```

8. **Naming Conventions**

   Classes, interfaces, and traits should follow clear naming conventions that reflect their responsibility or behavior (e.g., `InvoiceNumberGenerator`, `DateFormatter`, `SlugCreator`).

   ```php
   // ❌ Bad: Unclear or generic naming
   class Helper {}
   interface Stuff {}

   // ✅ Good: Clear, descriptive names
   class SlugCreator {}
   interface PaymentGateway {}
   ```

9. **Dependency Injection**

   Always inject dependencies via the constructor, not by instantiating them inside the class.

   ```php
   // ❌ Bad: Instantiates dependency inside the class
   class OrderController {
       private $notifier;
       public function __construct() {
           $this->notifier = new EmailNotificationSender();
       }
   }

   // ✅ Good: Inject dependency via constructor
   class OrderController {
       public function __construct(private NotificationSender $notifier) {}
   }
   ```

10. **Avoid Static Methods for State**

    Use static methods only for stateless utility logic, not for holding or mutating state.

    ```php
    // ❌ Bad: Static method modifies static state
    class Counter {
        private static $count = 0;
        public static function increment() { self::$count++; }
    }

    // ✅ Good: Stateless static method
    public static function isValidEmail(string $email): bool { /* ... */ }
    ```

11. **No Business Logic in Controllers**

    Controllers should delegate business logic to services or actions, not contain it directly.

    ```php
    // ❌ Bad: Business logic in controller
    public function store(Request $request) {
        // ... complex logic ...
    }

    // ✅ Good: Delegate to service
    public function store(Request $request) {
        $this->userService->register($request->all());
    }
    ```

12. **Recommended size limits for maintainability:**

    - Classes should generally not exceed **300 lines**. If a class grows larger, consider splitting it.
    - Methods should generally not exceed **80 lines**. If a method is longer, try to break it into smaller, focused methods.

    > These are guidelines, not hard rules. The goal is to encourage readability and maintainability.
