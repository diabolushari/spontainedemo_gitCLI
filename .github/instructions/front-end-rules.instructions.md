---
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---

## Project Structure & Organization

- Organize JavaScript code into logical directories (Components, Hooks, Libs, DataStructures, Pages, Layout) with ui directory for shadcn files.
- Group related files by feature within each directory rather than mixing them together.
- For larger applications, consider a module-based approach where all related files are grouped together regardless of their type.
- Keep reusable, cross-module components in a shared directory to prevent duplication.
- Use consistent naming conventions: PascalCase for components/pages, camelCase for hooks/utilities, Module directories in PascalCase.
- The ui directory should contain all shadcn components, keeping their original filenames.

## Component Design & Structure

- Do not use ternary operators or switch statements for conditional rendering, always use &&.
- Props should be readonly.
- Always break down the code into smaller components. Each component should have single responsibility.
- Always break reusable code/UI elements into components.
- Never define a component inside another component - define components at the top level.
- Group all TypeScript interfaces associated with a feature in a single file.

## Hooks & State Management

- Prefer custom hooks for application logic instead of writing the logic in component.
- Call hooks only at the top level of components or custom hooks, never inside loops or conditions.
- Don't pass hooks as props to components - call hooks directly in components.
- Use custom hooks named after their purpose (e.g., `useChatRoom`, `useOnlineStatus`).
- Use usePage hook from InertiaJS for accessing page props.

## Performance Optimization

- Use useMemo for expensive calculations and to prevent unnecessary re-renders.
- Use useCallback for functions that are passed as props to child components.
- Wrap components with React.memo when appropriate to prevent unnecessary re-renders.
- Always provide dependency arrays for useCallback and useMemo - don't omit them.
- Use useLayoutEffect only when you need synchronous DOM measurements before paint.

## Data Handling & Logic

- Use ?? for handling null values instead of ||.
- Prefer custom hooks for data fetching instead of useEffect in components.
- For side effects, prefer useEffect over direct function calls in component body.
- Use useSyncExternalStore for subscribing to external data stores.

## Routing & Navigation

- Use Ziggy for routing in frontend, route is a global variable - don't import it from ziggyjs.

## Styling

- Prefer using gap over space in TailwindCSS.

## Naming Conventions

- Use PascalCase for React component names (e.g., `UserProfile`, `PostCard`).
- Custom hooks must start with "use" and use camelCase (e.g., `useAuth`, `useLocalStorage`).
- Use PascalCase for TypeScript interfaces and types (e.g., `User`, `UserProfile`).
- Use PascalCase for enum names and UPPER_SNAKE_CASE for enum values.
- Use camelCase for variables and functions (e.g., `userName`, `getUserName`).
- Use kebab-case or camelCase for file and folder names (prefer kebab-case for consistency).
- Use UPPER_SNAKE_CASE for constants (e.g., `API_URL`, `MAX_RETRY_ATTEMPTS`).
- Use camelCase for props and state variables.
- Prefix event handlers with "handle" or "on" and use camelCase (e.g., `handleClick`, `onChange`).
- Name test files after the component/module with `.test.tsx` or `.spec.tsx` suffix.
- Prefix boolean variables with `is`, `has`, `can`, or `should` (e.g., `isActive`, `hasPermission`).
- Use single uppercase letters for generic type parameters (e.g., `T`, `U`, `V`).
- Name context files with `-context` suffix (e.g., `auth-context.tsx`).
- Use `index.ts` or `index.tsx` for entry points in folders.
- All JSON fields must use snake_case (e.g., `user_id`, `first_name`, `last_name`).

## TypeScript Best Practices

- Always type your component props with interfaces.
- Use generic types for reusable hooks when appropriate.
- Provide proper type annotations for custom hooks return values.
