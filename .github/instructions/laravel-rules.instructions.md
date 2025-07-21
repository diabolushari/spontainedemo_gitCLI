---
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---

- do nor use ternary operators or switch statements for conditional rendering always use &&.
- Props should be readonly.
- group all typescript interfaces associated with a feature in a single file.
- use ziggy for routing in frontend, route is a global variable dont import it from ziggyjs.
- always break down the code into smaller components. each component should have single responsibility.
- always break reusable code/ui element into components.
- prefer custom hooks for application logic instead of writing the logic in component.
- use ?? for handling null values instead of ||.
- prefer using gap over space in tailwindcss.
- use useMemo for expensive calculations.
- use useCallback for functions that are passed as props to child components.
- use usePage hook from inertiajs for accessing page props.
