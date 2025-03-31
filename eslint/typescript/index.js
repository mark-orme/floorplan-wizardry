
/**
 * Aggregated TypeScript ESLint rules
 * Imports and combines all TypeScript-specific ESLint rulesets
 * 
 * @module eslint/typescript/index
 */

const baseRules = require('./base-rules');
const assertionRules = require('./assertion-rules');
const fabricRules = require('./fabric-rules');
const functionArgumentRules = require('./function-argument-rules');
const gridStatePropertyRules = require('./grid-state-property-rules');
const gridTypeSafety = require('./grid-type-safety');
const namingRules = require('./naming-rules');
const reactRules = require('./react-rules');
const safetyRules = require('./safety-rules');
const drawingToolRules = require('./drawing-tool-rules');
const fabricEventRules = require('./fabric-event-rules');
const lineDrawingRules = require('./line-drawing-rules');

module.exports = {
  rules: {
    ...baseRules.rules,
    ...assertionRules.rules,
    ...fabricRules.rules,
    ...functionArgumentRules.rules,
    ...gridStatePropertyRules.rules,
    ...gridTypeSafety.rules,
    ...namingRules.rules,
    ...reactRules.rules,
    ...safetyRules.rules,
    ...drawingToolRules.rules,
    ...fabricEventRules.rules,
    ...lineDrawingRules.rules
  }
};
