## Validation & Security

1. **Never use request data without validation.**

   - Always validate data received through requests before using it in your application. Using unvalidated data can lead to security vulnerabilities and bugs.

   ```php
   // ❌ Bad: No validation
   public function store(Request $request)
   {
       $user = User::create($request->all());
       return $user;
   }
   ```

2. **Use `laravel-data` for DTO validation.**

   - For complex data transfer and validation, use [laravel-data](https://spatie.be/docs/laravel-data) to define Data Transfer Objects (DTOs) with PHP attribute annotations for validation rules. This makes your validation logic reusable and explicit.

   ```php
   // ✅ Good: Using laravel-data with PHP attribute annotations
   use Spatie\LaravelData\Data;
   use Spatie\LaravelData\Attributes\Validation\StringType;
   use Spatie\LaravelData\Attributes\Validation\Email;
   use Spatie\LaravelData\Attributes\Validation\Required;
   use Spatie\LaravelData\Attributes\Validation\Min;
   use Spatie\LaravelData\Attributes\Validation\Max;
   use Spatie\LaravelData\Attributes\Validation\Unique;

   class UserData extends Data
   {
       public function __construct(
           #[Required, StringType, Max(255)]
           public string $name,

           #[Required, Email, Unique('users')]
           public string $email,

           #[Required, Min(8)]
           public string $password,
       ) {}
   }
   ```

3. **Use Laravel's built-in validation for simple/search requests.**

   - For simple validation scenarios like search or filter requests, use Laravel's built-in validation directly in your controller.

   ```php
   // ✅ Good: Using Laravel's validation for search
   public function search(Request $request)
   {
       $validated = $request->validate([
           'query' => 'required|string|min:3',
       ]);

       return User::where('name', 'like', "%{$validated['query']}%")->get();
   }
   ```

4. **Use Form Requests for reusable validation logic.**

   - For reusable and organized validation, use Form Request classes.

   ```php
   // ✅ Better: Using a Form Request
   public function store(StoreUserRequest $request)
   {
       $user = User::create($request->validated());
       return $user;
   }
   ```

5. **Use Gate::authorize instead of manual authorization checks**

   - Never write manual authorization logic (e.g., if statements) in controllers. Use `Gate::authorize` for explicit, centralized authorization checks.
   - Example:

     ```php
     use Illuminate\Support\Facades\Gate;

     public function update(Request $request, User $user)
     {
         // ❌ Bad: Manual authorization check
         // if ($request->user()->id !== $user->id && !$request->user()->isAdmin()) {
         //     abort(403);
         // }

         // ✅ Good: Use Gate::authorize
         Gate::authorize('update', $user);
         // ... update logic ...
     }
     ```

6. **For FormRequest validation, handle authorization in the FormRequest class**

   - Move authorization logic out of controllers and into the FormRequest's `authorize()` method. This keeps controllers clean and ensures authorization is always checked when the request is validated.
   - Example:

     ```php
     // StoreUserRequest.php
     use Illuminate\Foundation\Http\FormRequest;

     class StoreUserRequest extends FormRequest
     {
         public function authorize()
         {
             // ✅ Good: Centralized authorization logic
             return $this->user()->can('create', User::class);
         }

         public function rules()
         {
             return [
                 'name' => ['required', 'string', 'max:255'],
                 'email' => ['required', 'email', 'unique:users'],
                 'password' => ['required', 'min:8'],
             ];
         }
     }
     ```

     ```php
     // Controller
     public function store(StoreUserRequest $request)
     {
         // No need for extra authorization logic here
         $user = User::create($request->validated());
         return $user;
     }
     ```

7. **Group routes using Laravel route groups for authentication and guest middleware**

   - Grouping routes improves clarity and ensures proper middleware is applied consistently.
   - Example:

     ```php
     use Illuminate\Support\Facades\Route;

     // ✅ Good: Grouping authenticated routes
     Route::middleware('auth:sanctum')->group(function () {
         Route::get('/dashboard', [DashboardController::class, 'index']);
         Route::put('/users/{user}', [UserController::class, 'update']);
     });

     // ✅ Good: Grouping guest routes
     Route::middleware('guest')->group(function () {
         Route::get('/login', [LoginController::class, 'showLoginForm']);
         Route::post('/login', [LoginController::class, 'login']);
     });

     // ❌ Bad: Not grouping routes, applying middleware individually
     Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth:sanctum');
     Route::put('/users/{user}', [UserController::class, 'update'])->middleware('auth:sanctum');
     ```

8. **Prefer Eloquent ORM for database operations**

   - Use Eloquent models for database queries and relationships instead of raw queries or the query builder when possible. Eloquent provides a more expressive, readable, and maintainable syntax.
   - Example:

     ```php
     // ❌ Bad: Using raw queries
     $users = DB::select('SELECT * FROM users WHERE active = 1');

     // ❌ Also less preferred: Using query builder for simple cases
     $users = DB::table('users')->where('active', 1)->get();

     // ✅ Good: Using Eloquent
     $users = User::where('active', true)->get();
     ```

9. **Use dependency injection**

   - Inject services, repositories, and models into controllers or other classes instead of manually instantiating them. This enables better testability and adheres to the inversion of control principle.
   - Example:

     ```php
     // ❌ Bad: Manual instantiation
     class UserController extends Controller
     {
         public function __construct()
         {
             $this->service = new UserService();
         }
     }

     // ✅ Good: Dependency injection
     class UserController extends Controller
     {
         public function __construct(private UserService $service) {}
     }

     // Or inject directly into methods
     public function show(UserService $service, $id)
     {
         return $service->find($id);
     }
     ```

10. **Wrap create/update SQL operations in try-catch blocks**

- Always wrap database create and update operations in try-catch blocks to handle exceptions and ensure proper error handling/logging.
- Example:

  ```php
  // ❌ Bad: No error handling
  $user = User::create($data);

  // ✅ Good: Using try-catch
  try {
      $user = User::create($data);
  } catch (\Exception $e) {
      // Handle the error, log it, or return a proper response
      Log::error('User creation failed: ' . $e->getMessage());
      return response()->json(['error' => 'Could not create user'], 500);
  }
  ```

11. **Chunk mass insertions and mass deletions**

- For large datasets, always chunk mass insertions and deletions to avoid memory issues and improve performance.
- Example:

  ```php
  // ❌ Bad: Inserting a huge array at once (may cause memory issues)
  User::insert($bigArray);

  // ✅ Good: Chunked mass insertion
  collect($bigArray)->chunk(1000)->each(function ($chunk) {
      User::insert($chunk->toArray());
  });

  // ❌ Bad: Deleting all records at once (may lock table or run out of memory)
  User::where('inactive', true)->delete();

  // ✅ Good: Chunked mass deletion
  User::where('inactive', true)->chunkById(1000, function ($users) {
      foreach ($users as $user) {
          $user->delete();
      }
  });
  ```

12. **Queue long-running processes like sending mail**

- Never perform long-running tasks (such as sending emails, processing images, or external API calls) synchronously in HTTP requests. Always queue them using Laravel's queue system to improve user experience and scalability.
- Example:

  ```php
  // ❌ Bad: Sending mail synchronously (slows down response)
  Mail::to($user->email)->send(new WelcomeMail($user));

  // ✅ Good: Queueing mail for asynchronous sending
  Mail::to($user->email)->queue(new WelcomeMail($user));

  // Or explicitly dispatch the Mailable to the queue
  WelcomeMail::dispatch($user);
  ```

13. **Do not use env() directly for configuration in application code**

   - Always use the `config()` helper to retrieve configuration values. Using `env()` directly outside of configuration files can cause unexpected behavior, especially when caching config in production.
   - Example:

     ```php
     // ❌ Bad: Using env() directly in application code
     $apiKey = env('PAYMENT_API_KEY');

     // ✅ Good: Using config()
     $apiKey = config('services.payment.api_key');
     ```
