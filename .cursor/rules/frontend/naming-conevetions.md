# Naming Conventions in TypeScript & React Projects

Consistent naming improves code readability, maintainability, and collaboration. Below are common naming conventions and best practices for TypeScript and React projects. Each rule includes an example.

1. **Component Names**

   - Use PascalCase for React component names.
   - Example:
     ```jsx
     // Good
     function UserProfile() { ... }
     // Bad
     function userprofile() { ... }
     ```

2. **Hook Names**

   - Custom hooks must start with "use" and use camelCase.
   - Example:
     ```js
     // Good
     function useAuth() { ... }
     // Bad
     function authHook() { ... }
     ```

3. **Type and Interface Names**

   - Use PascalCase. Prefix interfaces with "I" is optional, but be consistent.
   - Example:
     ```ts
     // Good
     interface User {
       name: string;
     }
     type UserProfile = { ... };
     // Also allowed if consistent
     interface IUser { ... }
     ```

4. **Enum Names**

   - Use PascalCase for enum names and UPPER_SNAKE_CASE for enum values.
   - Example:
     ```ts
     enum Status {
       PENDING,
       APPROVED,
       REJECTED,
     }
     ```

5. **Variable and Function Names**

   - Use camelCase for variables and functions.
   - Example:
     ```ts
     const userName = "Alice";
     function getUserName() { ... }
     ```

6. **File and Folder Names**

   - Use kebab-case or camelCase for file and folder names. Prefer kebab-case for consistency.
   - Example:
     ```
     // Good
     user-profile.tsx
     use-auth.ts
     // Bad
     UserProfile.tsx
     UseAuth.ts
     ```

7. **Constant Names**

   - Use UPPER_SNAKE_CASE for constants.
   - Example:
     ```ts
     const API_URL = "https://api.example.com";
     ```

8. **Props and State Variables**

   - Use camelCase for prop and state names.
   - Example:
     ```jsx
     function Button({ isDisabled }) { ... }
     const [userName, setUserName] = useState("");
     ```

9. **Event Handler Functions**

   - Prefix with "handle" or "on" and use camelCase.
   - Example:
     ```jsx
     function handleClick() { ... }
     function onChange(event) { ... }
     <button onClick={handleClick}>Click</button>
     ```

10. **Test File Names**

    - Name test files after the component/module with `.test.tsx` or `.spec.tsx` suffix.
    - Example:
      ```
      user-profile.test.tsx
      use-auth.spec.ts
      ```

11. **Avoid Abbreviations**

    - Use clear, descriptive names. Avoid single-letter or unclear abbreviations.
    - Example:
      ```ts
      // Good
      const userProfile = ...;
      // Bad
      const up = ...;
      ```

12. **Boolean Naming**

    - Prefix boolean variables with `is`, `has`, `can`, or `should`.
    - Example:
      ```ts
      const isActive = true;
      const hasPermission = false;
      ```

13. **Generic Type Parameters**

    - Use single uppercase letters (e.g., T, U, V) for generic type parameters.
    - Example:
      ```ts
      function identity<T>(arg: T): T {
        return arg;
      }
      ```

14. **Context Files**

    - Name context files with `-context` suffix.
    - Example:
      ```
      auth-context.tsx
      ```

15. **Index Files**

    - Use `index.ts` or `index.tsx` for entry points in folders.
    - Example:
      ```
      components/
        Button/
          index.tsx
      ```

16. **JSON Field Naming**

- All JSON fields must use snake_case.
- Example:

  ```json
  // Good
  {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe"
  }
  // Bad
  {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

Following these conventions will help keep your codebase organized and easy to navigate.
