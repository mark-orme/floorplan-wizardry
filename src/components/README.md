
# Components

This directory contains reusable React components used throughout the application.

## Organization

- **ui/**: UI components following the shadcn/ui pattern
- **canvas/**: Canvas-specific components for drawing and rendering
- **forms/**: Form-related components with validation
- **layout/**: Layout components like containers, grids, etc.
- **security/**: Security-related components for safe rendering

## Component Guidelines

1. **Keep components small and focused** (preferably <100 lines)
2. **Use composition over inheritance**
3. **Follow the shadcn/ui pattern** for consistency
4. **Apply proper error boundaries** for resilience
5. **Implement proper TypeScript typing**

## Example Usage

### Security Components

```tsx
// Using the SecureInput component
<SecureInput
  value={value}
  onChange={setValue}
  placeholder="Enter text"
  sanitizationStrategy="basic"
/>

// Using the SafeHtml component
<SafeHtml
  html={userProvidedContent}
  allowRich={false}
/>
```

### Canvas Components

Canvas components should be wrapped in proper error boundaries:

```tsx
<ErrorBoundary componentName="DrawingTool">
  <DrawingManager />
</ErrorBoundary>
```
