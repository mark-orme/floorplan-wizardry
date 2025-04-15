
# Canvas Hook System

This directory contains a modular approach to canvas state management, persistence, and auto-save functionality.

## Hook Structure

The canvas hooks are organized as follows:

- `useCanvasPersistence`: Handles saving and loading canvas data to/from localStorage and IndexedDB
- `useCanvasAutoSave`: Sets up automatic saving of canvas changes
- `useCanvasRestoreCheck`: Checks whether there is canvas data available to restore

## Usage Example

```typescript
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas.refactored';

function CanvasComponent() {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  const {
    isSaving,
    canRestore,
    saveCanvas,
    restoreCanvas
  } = useAutoSaveCanvas({
    canvas,
    canvasId: 'my-canvas',
    onSave: (success) => {
      if (success) {
        toast.success('Canvas saved');
      }
    }
  });
  
  // Later, you can manually save
  const handleSave = () => {
    saveCanvas();
  };
  
  // Or restore
  const handleRestore = () => {
    if (canRestore) {
      restoreCanvas();
    }
  };
  
  return (
    <div>
      <canvas ref={/* canvas ref */} />
      <div>
        <button onClick={handleSave} disabled={isSaving}>
          Save {isSaving && 'Saving...'}
        </button>
        <button onClick={handleRestore} disabled={!canRestore}>
          Restore
        </button>
      </div>
    </div>
  );
}
```

## Migration Guide

To migrate from the old `useAutoSaveCanvas` to the new modular approach:

1. Import from the refactored version: `import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas.refactored'`
2. The API remains the same, so no changes needed to your component code
3. For more fine-grained control, you can import the individual hooks directly:
   ```typescript
   import { useCanvasAutoSave, useCanvasRestoreCheck } from '@/hooks/canvas';
   ```
