
// This is a utility to document the fixed captureError calls across the application
// The following files were updated to use the new captureError(error, context) signature:

/*
- src/components/canvas/grid/MobileGridLayer.tsx
- src/components/forms/ValidationDemoForm.tsx
- src/hooks/canvas-operations/useColorOperations.ts
- src/hooks/canvas-operations/useToolOperations.ts
- src/hooks/canvas-operations/useZoomOperations.ts
- src/hooks/canvas/useCanvasObservability.ts
- src/utils/diagnostics/lineToolDiagnostics.ts
- src/utils/diagnostics/straightLineValidator.ts
- src/utils/diagnostics/toolbar/toolbarRunDiagnostics.ts
- src/utils/grid/gridErrorHandling.ts
- src/utils/logging/toolbar/toolActionLogger.ts
- src/utils/validation/validatorService.ts
*/

// Example of how calls should be updated:
// OLD: captureError(error, 'context', extraData);
// NEW: captureError(error, { context: 'context', extraData });

// This file serves as documentation only and has no runtime impact.
