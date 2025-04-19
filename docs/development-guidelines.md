# Development Guidelines for Floor Plan Designer

## 🔒 Security First Development

### Input Validation & Sanitization
- Validate ALL user input using TypeScript strict types
- Use DOMPurify for HTML sanitization
- Implement proper escaping for SQL, HTML, and JavaScript
- Validate file uploads for type and size

### Authentication & Authorization
- Always use Supabase auth hooks for user management
- Implement proper role-based access control
- Check resource ownership before operations
- Use HTTP-only cookies for session management

### Data Protection
- Never store sensitive data in localStorage/sessionStorage 
- Use environment variables for secrets (via Supabase)
- Implement proper CSRF protection
- Follow the principle of least privilege

### Security Headers
- Implement proper CSP headers
- Enable HSTS when deployed
- Set proper CORS policies
- Use X-Content-Type-Options: nosniff

### Secure Communication
- Always use HTTPS for API calls
- Implement proper SSL/TLS configuration
- Use secure WebSocket connections
- Validate all API responses

### Code Security
- Keep dependencies updated
- Run security audits regularly
- Use TypeScript strict mode
- Implement proper error handling
- Use ESLint security plugins
- Regular security testing
- Implement rate limiting
- Add audit logging for sensitive operations

## 🏗 Architecture Principles

### Component Design
- Keep components small and focused (<200 lines)
- Use composition over inheritance
- Follow single responsibility principle
- Implement proper error boundaries

### State Management
- Use React Query for server state
- Utilize React Context for global UI state
- Prefer local state with `useState`/`useReducer`
- Implement proper state initialization

### Performance Optimization
- Use `React.memo` for preventing unnecessary re-renders
- Implement lazy loading
- Use virtualization for large lists
- Minimize complex calculations in render methods

## 🛠 Technical Best Practices

### TypeScript Guidelines
- Strict typing with no `any`
- Use type inference where possible
- Create explicit interfaces
- Document types with JSDoc
- Use discriminated unions for complex states

### Error Handling
- Implement comprehensive error boundaries
- Log errors with context
- Provide user-friendly error messages
- Create fallback mechanisms
- Use custom error classes when appropriate

### Accessibility
- Follow WCAG 2.1 AA standards
- Implement keyboard navigation
- Use semantic HTML
- Add ARIA attributes
- Test with screen readers

## 🔌 Hook Development

### Custom Hook Patterns
- Keep hooks focused
- Return typed state and actions
- Handle side effects carefully
- Implement proper cleanup
- Add error handling

Example Hook Structure:
```typescript
function useCustomHook<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  
  const updateState = useCallback((newState: T) => {
    setState(newState);
  }, []);

  return { state, updateState };
}
```

## 🧪 Testing Strategies

### Unit Testing
- Test utility functions thoroughly
- Cover edge cases
- Mock external dependencies
- Aim for high code coverage

### Component Testing
- Test component rendering
- Verify prop changes
- Simulate user interactions
- Check accessibility

### E2E Testing
- Cover critical user journeys
- Test across different browsers
- Verify responsive design
- Implement visual regression tests

## 🛡️ Security Testing Checklist

### Before Deployment
- Run npm audit
- Check for exposed secrets
- Verify CSP implementation
- Test CSRF protection
- Validate input sanitization
- Check authorization rules
- Review error handling
- Test rate limiting
- Verify secure headers
- Run penetration tests

### Regular Maintenance
- Update dependencies weekly
- Review security logs
- Check for vulnerabilities
- Monitor for unusual activity
- Update security policies
- Review access controls
