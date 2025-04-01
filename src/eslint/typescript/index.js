
/**
 * Aggregated TypeScript ESLint rules
 * @module eslint/typescript
 */
import { baseRules } from './base-rules.js';
import { reactRules } from './react-rules.js';
import { safetyRules } from './safety-rules.js';
import { namingRules } from './naming-rules.js';
import { assertionRules } from './assertion-rules.js';
import { functionArgumentRules } from './function-argument-rules.js';
import { fabricRules } from './fabric-rules.js';
import { fabricEventRules } from './fabric-event-rules.js';
import { gridStatePropRules } from './grid-state-property-rules.js';
import { gridTypeSafety } from './grid-type-safety.js';
import { lineDrawingRules } from './line-drawing-rules.js';
import { drawingToolRules } from './drawing-tool-rules.js';

/**
 * Export all TypeScript rules as an array
 */
export default [
  baseRules,
  reactRules,
  safetyRules,
  namingRules,
  assertionRules,
  functionArgumentRules,
  fabricRules,
  fabricEventRules,
  gridStatePropRules,
  gridTypeSafety,
  lineDrawingRules,
  drawingToolRules
];
