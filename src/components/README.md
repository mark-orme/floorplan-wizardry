
# Components

This directory contains all the React components used throughout the application.

## Structure

- `ui/`: Contains reusable UI components like buttons, inputs, and other form elements
- `canvas/`: Contains components related to canvas rendering and manipulation
- `property/`: Contains components for property management and display
- `security/`: Contains security-related components like authentication forms

## Usage

Components should be:
1. Small and focused
2. Well-typed with proper prop interfaces
3. Documented with JSDoc comments

When creating new components:
- Create them in the appropriate subdirectory
- Export them through the appropriate barrel file (index.ts)
- Use composition over inheritance 
- Consider making them pure functional components when possible

## Examples

```tsx
import { Button } from '@/components/ui/button';
import { PropertyHeader } from '@/components/property/PropertyHeader';
import { CanvasApp } from '@/components/canvas/CanvasApp';
```
