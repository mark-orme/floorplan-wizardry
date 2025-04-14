
/**
 * TypeScript ESLint rules
 * @module eslint/typescript/index
 */
import { baseRules } from './base-rules.js';
import { reactRules } from './react-rules.js';
import { assertionRules } from './assertion-rules.js';
import { safetyRules } from './safety-rules.js';
import { namingRules } from './naming-rules.js';
import { gridTypeSafety } from './grid-type-safety.js';
import { fabricRules } from './fabric-rules.js';
import { gridStatePropertyRules } from './grid-state-property-rules.js';
import { drawingToolRules } from './drawing-tool-rules.js';
import { lineDrawingRules } from './line-drawing-rules.js';
import { aiDevRules } from './ai-dev-rules.js';
import { fabricEventRules } from './fabric-event-rules.js';
import { fabricEventTypingRules } from './fabric-event-typing-rules.js';

// Export all TypeScript rules
export const typescriptRules = [
  baseRules,
  reactRules,
  assertionRules,
  safetyRules,
  namingRules,
  gridTypeSafety,
  fabricRules,
  gridStatePropertyRules,
  drawingToolRules,
  lineDrawingRules,
  aiDevRules,
  fabricEventRules,
  fabricEventTypingRules
];
