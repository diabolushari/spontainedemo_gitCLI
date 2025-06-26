# React Best Practices

This document outlines key best practices for writing clean, maintainable, and performant React code.

## 1. Use Object Destructuring for Props

Destructuring props makes components cleaner and easier to read by clearly showing which props are being used.

```jsx
// ❌ Bad
function UserProfile(props) {
  return (
    <div>
      <h1>{props.user.name}</h1>
      <img src={props.user.avatarUrl} alt={props.user.name} />
    </div>
  );
}

// ✅ Good
function UserProfile({ user }) {
  // Destructure props directly
  // Further destructure nested objects if needed
  const { name, avatarUrl } = user;
  return (
    <div>
      <h1>{name}</h1>
      <img src={avatarUrl} alt={name} />
    </div>
  );
}
```

## 2. Treat Props as Immutable (Readonly)

Props should never be modified directly within a component. They represent data passed down from the parent and should remain unchanged. Modifying props breaks the one-way data flow and makes debugging difficult.

```jsx
// ❌ Bad
function Counter({ initialCount }) {
  // Trying to modify a prop directly
  initialCount = initialCount + 1; // This is wrong and won't re-render correctly

  return <div>Count: {initialCount}</div>;
}

// ✅ Good
import React, { useState } from "react";

function Counter({ initialCount }) {
  // Use state for values that change
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## 3. Do Not Assign State Directly

Always use the state setter function (`setState` or the function returned by `useState`) to update state. Direct assignment bypasses React's update mechanism, won't trigger re-renders, and can lead to bugs.

```jsx
import React, { useState } from "react";

function NameEditor() {
  const [name, setName] = useState("Guest");

  const handleChange = (event) => {
    // ❌ Bad: Direct state mutation
    // name = event.target.value; // This won't work!

    // ✅ Good: Use the state setter function
    setName(event.target.value);
  };

  return (
    <div>
      <input type="text" value={name} onChange={handleChange} />
      <p>Hello, {name}</p>
    </div>
  );
}
```

## 4. Adhere to the Single Responsibility Principle (SRP)

Components should ideally do one thing well. If a component handles too much logic, state management, and rendering, break it down into smaller, more focused components. This improves reusability and maintainability.

```jsx
// ❌ Bad: A single component handling user data fetching, display, and editing
function UserProfileSection() {
  // ... fetch user data
  // ... manage editing state
  // ... display user info
  // ... display edit form
  // ... handle form submission
  return <div>... complex JSX combining display and editing ...</div>;
}

// ✅ Good: Break down into smaller components
function UserProfileDisplay({ user }) {
  // Displays user info
  return <div>... display JSX ...</div>;
}

function UserEditForm({ user, onSave }) {
  // Handles the editing form
  return <form>... form JSX ...</form>;
}

function UserProfileSection() {
  const { user, isLoading } = useFetchUserData(); // Custom hook for data fetching
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedData) => {
    // ... save logic ...
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {/* Use && for conditional rendering */}
      {!isEditing && <UserProfileDisplay user={user} />}
      {isEditing && <UserEditForm user={user} onSave={handleSave} />}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit"}
      </button>
    </div>
  );
}
```

## 5. Use Logical AND (`&&`) for Simple Conditional Rendering

The `&&` operator is concise for rendering an element only if a condition is true. For `if-else` logic, use a ternary operator (`? :`). Be cautious with `&&` if the left-hand side can be `0`, as `0` will be rendered.

```jsx
function Notification({ messageCount }) {
  return (
    <div>
      <h2>Notifications</h2>
      {/* Use && for conditional rendering */}
      {messageCount > 0 && <p>You have {messageCount} new messages.</p>}
      {messageCount <= 0 && <p>No new messages.</p>}
    </div>
  );
}
```

## 6. Use Custom Hooks for Business Logic & Long useEffects

Extract reusable stateful logic, data fetching, or complex side effects (`useEffect`) into custom hooks. This cleans up components, improves reusability, and makes logic easier to test.

```jsx
import React, { useState, useEffect } from "react";

// ✅ Good: Custom hook for fetching data
function useFetchData(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [url]); // Dependency array is crucial

  return { data, isLoading, error };
}

// Component using the custom hook
function UserData({ userId }) {
  const { data: user, isLoading, error } = useFetchData(`/api/users/${userId}`);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return <div>{user.name}</div>;
}

// ❌ Bad: Fetching logic directly inside the component (less reusable)
function UserDataBad({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;

  return <div>{user.name}</div>;
}
```

## 7. Organize Layouts as Components

Create dedicated layout components (e.g., `MainLayout`, `DashboardLayout`) to handle common page structures like headers, footers, sidebars, and navigation. Page components then render their specific content within these layouts.

```jsx
// Example Layout Component
function MainLayout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <main>{children}</main> {/* Page content goes here */}
      </div>
      <Footer />
    </div>
  );
}

// Example Page using the Layout
function UserSettingsPage() {
  return (
    <MainLayout>
      <h1>User Settings</h1>
      {/* Page specific content */}
      <p>Configure your profile preferences here.</p>
    </MainLayout>
  );
}
```

## 8. Use Braces `{}` for `if` Statements; Avoid Excessive `else if`

Always use curly braces `{}` for `if`/`else` blocks, even if they contain only a single line, to prevent ambiguity and potential errors. Avoid long chains of `else if`; consider alternatives like mapping objects or using switch statements (outside JSX) if logic becomes complex.

```jsx
// ✅ Good: Always use braces
if (condition) {
  doSomething();
}

// ❌ Bad: Omitting braces (error-prone)
// if (condition) doSomething();

// 🤔 Consider alternatives for long else-if chains
function getStatusComponent(status) {
  // ❌ Potentially long else-if
  /*
  if (status === 'pending') {
    return <PendingComponent />;
  } else if (status === 'approved') {
    return <ApprovedComponent />;
  } else if (status === 'rejected') {
    return <RejectedComponent />;
  } else {
    return <DefaultComponent />;
  }
  */

  // ✅ Good: Using an object map
  const statusMap = {
    pending: <PendingComponent />,
    approved: <ApprovedComponent />,
    rejected: <RejectedComponent />,
  };

  return statusMap[status] || <DefaultComponent />;
}
```

## 9. Prefer Functional Components and Hooks Over Classes

For new React development, functional components with hooks (`useState`, `useEffect`, `useContext`, etc., and custom hooks) are the recommended approach. They offer a more concise syntax, better composition, and avoid the complexities of `this` binding found in class components.

## 10. Avoid Direct DOM Manipulation

React manages the DOM efficiently using its virtual DOM. Directly manipulating the DOM (e.g., using `document.getElementById`, jQuery) bypasses React's control, can lead to unpredictable behavior, performance issues, and makes the code harder to reason about. Use refs (`useRef`) only as a last resort for specific cases like managing focus, text selection, or integrating with third-party DOM libraries.

```jsx
import React, { useRef, useEffect } from "react";

function FocusInput() {
  // ✅ Good: Using useRef for DOM interaction when necessary
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input element when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Empty dependency array means this runs once on mount

  return <input ref={inputRef} type="text" placeholder="I will be focused" />;
}

// ❌ Bad: Direct DOM manipulation
function FocusInputBad() {
  useEffect(() => {
    // This bypasses React's control over the DOM
    const inputElement = document.getElementById("myInput");
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return <input id="myInput" type="text" placeholder="Focus attempt via ID" />;
}
```

## 11. Use Stable and Unique Keys for Lists

When rendering lists of elements using `map`, always provide a stable and unique `key` prop to each element. Using the array index as a key can lead to performance issues and bugs related to component state and identity, especially when the list items can be added, removed, or reordered.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {/* ❌ Bad: Using index as key */}
      {/* {todos.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))} */}

      {/* ✅ Good: Using a unique and stable ID from the data */}
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## 12. Use Context API for Global State Management (Avoid Prop Drilling)

For state that needs to be accessed by many components at different nesting levels, use the Context API to avoid "prop drilling" (passing props down through many intermediate components). Context is suitable for global state like themes, user authentication status, or locale preferences.

```jsx
import React, { createContext, useContext, useState } from "react";

// 1. Create Context
const ThemeContext = createContext();

// 2. Create Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Use Context in nested components
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Theme
    </button>
  );
}

// App structure
function App() {
  return (
    <ThemeProvider>
      {/* Other components */}
      <Toolbar />
    </ThemeProvider>
  );
}

function Toolbar() {
  // This component doesn't need to know about the theme,
  // but ThemedButton deep inside it can access it via context.
  return (
    <div>
      <ThemedButton />
    </div>
  );
}
```

## 13. Use `useCallback` When Passing Functions as Props to Child Components

When you pass a function as a prop to a child component, that function is re-created on every parent render. If the child component is memoized (using `React.memo`), it will still re-render if the function prop reference changes, even if the logic is the same. Using `useCallback` ensures the function reference stays the same unless its dependencies change, preventing unnecessary child re-renders and improving performance.

```jsx
import React, { useState, useCallback } from "react";

// ❌ Bad: Function is recreated on every render
function Parent() {
  const [count, setCount] = useState(0);

  // This function is a new reference every time Parent renders
  const handleClick = () => {
    setCount(count + 1);
  };

  return <Child onClick={handleClick} />;
}

const Child = React.memo(function Child({ onClick }) {
  console.log("Child rendered");
  return <button onClick={onClick}>Click me</button>;
});

// Even if Child is memoized, it will re-render every time Parent renders because 'handleClick' is a new function each time.

// ✅ Good: useCallback memoizes the function
function Parent() {
  const [count, setCount] = useState(0);

  // handleClick reference will only change if 'count' changes
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // or [count] if you need latest count

  return <Child onClick={handleClick} />;
}

// Now, Child will only re-render when 'handleClick' reference changes (i.e., when dependencies change)
```
