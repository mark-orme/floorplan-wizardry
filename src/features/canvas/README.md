
# Canvas Feature

This directory contains all components, hooks, and utilities related to the canvas drawing system.

## Structure

- `components/`: Canvas-related components like toolbars and canvas containers
- `hooks/`: Custom hooks for canvas manipulation and state
- `utils/`: Canvas-specific utility functions
- `types/`: TypeScript type definitions for canvas data

## Responsibilities

- Canvas initialization and rendering
- Drawing tools and interactions
- Canvas state management
- Object manipulation
- Canvas export and import functionality

## Usage

```tsx
import { CanvasApp, Toolbar, CanvasContainer } from '@/features/canvas';
import { useCanvasContext, DrawingProvider } from '@/features/canvas';
```
