
# Features Directory

This directory contains feature-based modules that organize code by domain functionality rather than by technical type.

## Structure

Each feature folder contains all related components, hooks, utilities, and types that belong to that specific feature domain:

- `auth/` - Authentication related functionality
- `floorPlan/` - Floor plan creation and management
- `property/` - Property management functionality
- `canvas/` - Canvas drawing and interaction functionality
- `grid/` - Grid system for the canvas

## Usage Guidelines

1. When adding new functionality, determine which feature domain it belongs to
2. Place all related code (components, hooks, types, utils) within the feature directory
3. Export public API through the feature's `index.ts` barrel file
4. Avoid cross-feature dependencies where possible; use shared/common utilities instead

## Benefits

- Improves discoverability - all related code is in one place
- Simplifies maintenance - changes to a feature are isolated
- Enhances modularity - features can be more easily refactored
- Reduces cognitive load - developers can focus on one domain at a time
