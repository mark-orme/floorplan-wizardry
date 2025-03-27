
/**
 * ESLint configuration constants
 * Defines limits and settings for code quality checks
 * @module eslint/constants
 */

/**
 * Code style limits for readability
 * Enforces constraints that improve code clarity and maintainability
 */
export const CODE_STYLE_LIMITS = {
  /**
   * Maximum line length in characters
   * Prevents excessively long lines that harm readability
   * Fits comfortably in most code editors without horizontal scrolling
   * @constant {number}
   */
  MAX_LINE_LENGTH: 100,
  
  /**
   * Maximum number of lines per function
   * Encourages breaking down large functions for maintainability
   * Functions beyond this length are candidates for refactoring
   * @constant {number}
   */
  MAX_FUNCTION_LINES: 50
};

/**
 * Complexity limits for maintainability
 * Prevents overly complex code that's difficult to understand and test
 */
export const COMPLEXITY_LIMITS = {
  /**
   * Maximum cyclomatic complexity
   * Limits the number of logical paths through a function
   * Higher complexity correlates with increased defect rates
   * Values over 10 indicate highly complex code needing refactoring
   * @constant {number}
   */
  MAX_COMPLEXITY: 10,
  
  /**
   * Maximum nesting depth
   * Limits how deeply control structures can be nested
   * Deep nesting makes code difficult to understand and maintain
   * Encourages extracting logic into separate functions
   * @constant {number}
   */
  MAX_DEPTH: 3
};

/**
 * Prettier formatting options
 * Standard configuration for code formatting
 * Ensures consistent style across the codebase
 * @constant {Object}
 */
export const PRETTIER_OPTIONS = {
  /**
   * Whether to use semicolons
   * True ensures all statements end with semicolons
   * @constant {boolean}
   */
  semi: true,
  
  /**
   * Whether to use single quotes for strings
   * False uses double quotes for consistency
   * @constant {boolean}
   */
  singleQuote: false,
  
  /**
   * Maximum line width before wrapping
   * Matches our maximum line length setting
   * @constant {number}
   */
  printWidth: 100,
  
  /**
   * Trailing comma style
   * "all" adds trailing commas wherever possible
   * Makes version control diffs cleaner
   * @constant {string}
   */
  trailingComma: "all",
  
  /**
   * Number of spaces per indentation level
   * Standard 2 spaces for consistent indentation
   * @constant {number}
   */
  tabWidth: 2
};

// For backward compatibility
export const MAX_LINE_LENGTH = CODE_STYLE_LIMITS.MAX_LINE_LENGTH;
export const MAX_FUNCTION_LINES = CODE_STYLE_LIMITS.MAX_FUNCTION_LINES;
export const MAX_COMPLEXITY = COMPLEXITY_LIMITS.MAX_COMPLEXITY;
export const MAX_DEPTH = COMPLEXITY_LIMITS.MAX_DEPTH;
