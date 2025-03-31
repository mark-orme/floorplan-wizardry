
/**
 * TypeScript ESLint rules collection
 * Aggregates all TypeScript rule modules
 * @module eslint/typescript
 */
import { baseTypeScriptRules } from './base-rules.js';
import { typeSafetyRules } from './safety-rules.js';
import { namingRules } from './naming-rules.js';
import { fabricRules } from './fabric-rules.js';
import { fabricEventRules } from './fabric-event-rules.js';
import { drawingToolRules } from './drawing-tool-rules.js';
import { assertionRules } from './assertion-rules.js';
import { reactTypescriptRules } from './react-rules.js';
import { functionArgumentRules } from './function-argument-rules.js';
import { gridStatePropertyRules } from './grid-state-property-rules.js';

export const typescriptRules = [
  baseTypeScriptRules,
  typeSafetyRules,
  namingRules,
  fabricRules,
  fabricEventRules,
  drawingToolRules,
  assertionRules,
  reactTypescriptRules,
  functionArgumentRules,
  gridStatePropertyRules
];
