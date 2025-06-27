## Frontend Project Structure

1. **Organize your JavaScript code into logical directories (Components, Hooks, Libs, DataStructures, Pages, Layout) with ui directory for shadcn files.**

2. **Group related files by feature within each directory rather than mixing them together. This approach mirrors Laravel's organization and improves maintainability.**

```jsx
src/
  Components/
    Button.jsx
    UserProfile.jsx
    PostCard.jsx
    CommentForm.jsx
  Hooks/
    useAuth.js
    usePosts.js
    useComments.js
  Pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    PostList.jsx
  Layout/
    MainLayout.jsx
    Sidebar.jsx
    Header.jsx
  Libs/
    api.js
  DataStructures/
    Tree.js
    Queue.js
  ui/
    button.jsx
    dialog.jsx
    input.jsx
```

```jsx
src/
  Components/
    User/
      UserProfile.jsx
      UserAvatar.jsx
    Post/
      PostCard.jsx
      PostForm.jsx
    Comment/
      CommentList.jsx
      CommentForm.jsx
  Hooks/
    User/
      useAuth.js
      useProfile.js
    Post/
      usePosts.js
      usePostActions.js
    Comment/
      useComments.js
  Pages/
    Auth/
      Login.jsx
      Register.jsx
    Dashboard/
      Index.jsx
      Stats.jsx
    Post/
      PostList.jsx
      PostDetail.jsx
  Layout/
    Main/
      MainLayout.jsx
      Sidebar.jsx
      Header.jsx
    Auth/
      AuthLayout.jsx
  ui/
    button.jsx
    dialog.jsx
    input.jsx
  Libs/
    api.js
  DataStructures/
    Tree.js
    Queue.js
```

3. **For larger applications, consider a module-based approach where all related files are grouped together regardless of their type.**

```jsx
src/
  modules/
    Auth/
      components/
        LoginForm.jsx
        RegisterForm.jsx
      hooks/
        useAuth.js
      pages/
        Login.jsx
        Register.jsx
      utils/
        authHelpers.js
    Post/
      components/
        PostCard.jsx
        PostForm.jsx
      hooks/
        usePosts.js
      pages/
        PostList.jsx
        PostDetail.jsx
      utils/
        postFormatters.js
    Comment/
      components/
        CommentList.jsx
        CommentForm.jsx
      hooks/
        useComments.js
  shared/
    components/
      Button.jsx
      Card.jsx
    hooks/
      useForm.js
      useFetch.js
    utils/
      formatters.js
    layout/
      MainLayout.jsx
      AuthLayout.jsx
  ui/
    button.jsx
    dialog.jsx
    input.jsx
  DataStructures/
    Tree.js
    Queue.js
  Libs/
    api.js
    storage.js
```

4. **Keep reusable, cross-module components in a shared directory. This prevents duplication while maintaining organization.**

5. **Use consistent naming conventions for all files and directories:**

   - PascalCase for components and pages (UserProfile.jsx)
   - camelCase for hooks, utility functions, and other JS files (useAuth.js)
   - Module directories should be PascalCase (User/, Post/)

6. **The ui directory should contain all shadcn components, keeping their original filenames:**

```jsx
src/
  ui/
    button.jsx
    dialog.jsx
    dropdown-menu.jsx
    form.jsx
    input.jsx
    select.jsx
    textarea.jsx
