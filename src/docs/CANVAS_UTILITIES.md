
# Canvas Utilities

This document describes the canvas utility functions available for consistent canvas handling throughout the application.

## Basic Utilities

### `getCanvas(ref)`

Safely gets the canvas from a React ref.

```typescript
import { getCanvas } from '@/utils/canvas';

const canvas = getCanvas(fabricCanvasRef);
if (!canvas) return;
```

### `safeRender(canvas)`

Safely renders a canvas, checking if it exists first.

```typescript
import { safeRender } from '@/utils/canvas';

safeRender(canvas);
```

### `safeDispose(canvas)`

Safely disposes a canvas, checking if it exists first and handling errors.

```typescript
import { safeDispose } from '@/utils/canvas';

safeDispose(canvas);
```

### `isCanvasValid(canvas)`

Checks if a canvas is valid and usable.

```typescript
import { isCanvasValid } from '@/utils/canvas';

if (isCanvasValid(canvas)) {
  // Safe to use the canvas
}
```

## Reusable Options

### `defaultFabricOptions`

Default options for non-interactive Fabric objects.

```typescript
import { defaultFabricOptions } from '@/utils/canvas';

const circle = new fabric.Circle({
  ...defaultFabricOptions,
  radius: 50,
  fill: 'red'
});
```

### `defaultInteractiveOptions`

Default options for interactive Fabric objects.

```typescript
import { defaultInteractiveOptions } from '@/utils/canvas';

const rect = new fabric.Rect({
  ...defaultInteractiveOptions,
  width: 100,
  height: 100,
  fill: 'blue'
});
```

### `gridLineOptions`

Default options for grid lines.

```typescript
import { gridLineOptions } from '@/utils/canvas';

const gridLine = new fabric.Line([0, 0, 100, 0], {
  ...gridLineOptions
});
```

## Type Definitions

Import type definitions for canvas references:

```typescript
import { CanvasRef, GridLayerRef, HistoryRef } from '@/types/canvas/CanvasReferences';

const fabricCanvasRef: CanvasRef = useRef(null);
const gridLayerRef: GridLayerRef = useRef([]);
```

## Best Practices

1. Always use `getCanvas()` to safely access canvas from refs
2. Use `safeRender()` instead of direct `requestRenderAll()` calls
3. Use the predefined option objects for consistent styling
4. Check canvas validity with `isCanvasValid()` before complex operations
5. Always clean up canvas resources with `safeDispose()`
