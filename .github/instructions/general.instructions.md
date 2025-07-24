---
applyTo: '**'
---

### Code Quality & Maintainability

- Write clean, readable, and self-documenting code.
- Follow SOLID principles and maintain single responsibility for classes and functions.
- Use meaningful variable and function names that clearly express intent.
- Keep functions and methods small and focused on a single task.
- Avoid deep nesting and complex conditional logic.

### Documentation & Comments

- Write clear and concise documentation for complex business logic.
- Update documentation when making significant changes to functionality.
- Use inline comments sparingly, preferring self-documenting code.
- Maintain up-to-date README files for setup and deployment instructions.

### Version Control Best Practices

- Write clear, descriptive commit messages.
- Make atomic commits that represent a single logical change.
- Use feature branches for development and merge via pull requests.
- Keep the main branch stable and deployable at all times.

### Testing Strategy

- Write tests for all critical business logic and user-facing features.
- Maintain good test coverage for both frontend and backend components.
- Use appropriate testing patterns (unit, integration, end-to-end).
- Mock external dependencies in tests to ensure reliability.

### Performance Considerations

- Optimize database queries and avoid N+1 problems.
- Use appropriate caching strategies for frequently accessed data.
- Implement lazy loading for large datasets and images.
- Always validate and sanitize user input.
- Implement proper authentication and authorization.
- Regularly update dependencies and patch security vulnerabilities.
- Never commit sensitive information like API keys or passwords.

### Error Handling

- Implement comprehensive error handling throughout the application.
- Provide meaningful error messages to users while hiding sensitive details.
- Log errors appropriately for debugging and monitoring.
- Use try-catch blocks judiciously and handle expected errors gracefully.

### Data Management

- Design database schemas with proper relationships and constraints.
- Use migrations for all database schema changes.
- Implement proper data validation at multiple layers.
- Consider data privacy and compliance requirements (GDPR, etc.).

### API Design

- Follow RESTful principles for API design.
- Use consistent naming conventions for endpoints.
- Implement proper status codes and error responses.
- Document APIs thoroughly for internal and external consumers.
- Version APIs appropriately to maintain backward compatibility.
