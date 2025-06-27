## Project Structure

- **Use Laravel's default folders (Controllers, Models, Services, Requests, etc.). Inside each folder, group files by feature using subfolders. This keeps related files together and improves maintainability.**

```php
// ❌ Bad: All files mixed together in each folder
app/
  Controllers/
    UserController.php
    PostController.php
    AuthController.php
  Models/
    User.php
    Post.php
    Comment.php
  Services/
    UserService.php
    PostService.php
    AuthService.php
  Requests/
    StoreUserRequest.php
    UpdatePostRequest.php
    LoginRequest.php

// ✅ Good: Grouping by feature within each default folder
app/
  Controllers/
    User/
      UserController.php
      AuthController.php
    Post/
      PostController.php
    Comment/
      CommentController.php
  Models/
    User/
      User.php
    Post/
      Post.php
    Comment/
      Comment.php
  Services/
    User/
      UserService.php
    Post/
      PostService.php
    Auth/
      AuthService.php
  Dtos/
    User/
      UserData.php
    Post/
      PostData.php
    Auth/
      LoginData.php
  Requests/
    User/
      StoreUserRequest.php
    Post/
      UpdatePostRequest.php
    Auth/
      LoginRequest.php
```

### When to Use Modules

- **For very large projects, multi-team environments, or when features are highly independent, consider using a modular structure.**
- Modules help encapsulate all files related to a feature (controllers, models, services, requests, etc.) in a single directory, improving scalability and separation of concerns.
- Laravel modules can be managed manually or with packages like [`nwidart/laravel-modules`](https://nwidart.com/laravel-modules/).

```php
// ✅ Example: Modular structure for large/complex projects
app/
  Modules/
    Blog/
      Controllers/
        BlogController.php
        PostController.php
        CommentController.php
      Models/
        Blog.php
        Post.php
        Comment.php
      Services/
        BlogService.php
        PostService.php
        CommentService.php
      Dtos/
        BlogData.php
        PostData.php
        CommentData.php
      ValueObjects/
        Email.php
        Money.php
      Enums/
        UserRole.php
        Status.php
      Requests/
        StoreBlogRequest.php
        CreatePostRequest.php
        UpdateCommentRequest.php
    Auth/
      Controllers/
        AuthController.php
      Services/
        AuthService.php
      Dtos/
        LoginData.php
      ValueObjects/
        Uuid.php
      Enums/
        AuthStatus.php
      Requests/
        LoginRequest.php
```

> Use modules when your project is large enough that feature boundaries are clear and teams or developers can work independently on different modules.

```php
// ✅ Example: Flat structure for smaller projects
app/
  Controllers/
    User/
      UserController.php
      AuthController.php
    Post/
      PostController.php
    Comment/
      CommentController.php
  Models/
    User/
      User.php
    Post/
      Post.php
    Comment/
      Comment.php
  Services/
    User/
      UserService.php
    Post/
      PostService.php
    Auth/
      AuthService.php
  Dtos/
    User/
      UserData.php
    Post/
      PostData.php
    Auth/
      LoginData.php
  ValueObjects/
    Email.php
    Money.php
  Enums/
    UserRole.php
    Status.php
  Requests/
    User/
      StoreUserRequest.php
    Post/
      UpdatePostRequest.php
    Auth/
      LoginRequest.php
```
