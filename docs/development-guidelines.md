
# Development Guidelines for Floor Plan Designer

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

## 🔒 Security Considerations

- Validate and sanitize all inputs
- Use proper TypeScript type guards
- Implement content security policies
- Sanitize user-generated content
- Use secure default configurations

## 📦 Package Management

- Keep dependencies minimal
- Regularly update dependencies
- Use `npm audit` for security checks
- Prefer official and well-maintained packages
- Consider bundle size impact
