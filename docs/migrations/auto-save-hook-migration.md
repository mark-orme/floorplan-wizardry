
# AutoSave Hook Migration Guide

This document explains how to migrate from the original `useAutoSaveCanvas` hook to the new modular hook system.

## Why We Refactored

The original `useAutoSaveCanvas` hook was:
- Too large (over 200 lines)
- Handled multiple concerns (saving, loading, checking, event handling)
- Difficult to test and maintain
- Challenging to reuse parts of its functionality

The new modular approach provides:
- Smaller, focused hooks
- Better separation of concerns
- Improved testability
- More reusable components

## How to Migrate

### Quick Migration (Minimal Changes)

For a quick migration with minimal code changes:

```typescript
// Before:
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';

// After:
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas.refactored';
```

The API remains identical, so no changes to how you use the hook are needed.

### Advanced Migration (Using Modular Hooks)

For more control, you can use the individual hooks directly:

```typescript
// Before:
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';

const { 
  isSaving, 
  canRestore, 
  saveCanvas, 
  restoreCanvas 
} = useAutoSaveCanvas({ canvas, canvasId: 'myCanvas' });

// After:
import { useCanvasAutoSave } from '@/hooks/canvas/useCanvasAutoSave';
import { useCanvasRestoreCheck } from '@/hooks/canvas/useCanvasRestoreCheck';

const { canRestore } = useCanvasRestoreCheck({ canvasId: 'myCanvas' });
const { 
  isSaving, 
  saveCanvas, 
  restoreCanvas 
} = useCanvasAutoSave({ canvas, canvasId: 'myCanvas' });
```

This approach gives you more flexibility and could reduce bundle size if you only need specific functionality.

## New Features in the Modular Hooks

The modular hooks come with some improvements:

1. Better error handling and logging
2. More consistent behavior between localStorage and IndexedDB storage
3. Easier to customize (you can replace just one part of the system)
4. Cleaner separation of concerns

## Testing the New Hooks

Each hook can now be tested in isolation:

```typescript
// Test just the persistence logic
test('useCanvasPersistence can save and restore canvas data', () => {
  // Test implementation
});

// Test just the auto-save functionality
test('useCanvasAutoSave triggers save on canvas changes', () => {
  // Test implementation
});
```

## Timeline for Deprecation

- For now, both the original hook and the refactored version are available
- In future releases, the original hook will be deprecated
- We recommend migrating to the new hooks when convenient
