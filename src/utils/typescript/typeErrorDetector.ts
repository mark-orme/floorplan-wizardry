
/**
 * TypeScript error detector utility
 * Helps identify and categorize common TypeScript errors during runtime
 */

export enum TypeErrorCategory {
  GENERIC_SYNTAX = 'generic_syntax',
  JSX_IN_TS_FILE = 'jsx_in_ts_file',
  ARROW_FUNCTION_GENERIC = 'arrow_function_generic',
  TYPE_MISMATCH = 'type_mismatch',
  UNDEFINED_PROPERTY = 'undefined_property',
  NULL_OBJECT = 'null_object'
}

interface TypeErrorInfo {
  category: TypeErrorCategory;
  message: string;
  suggestion: string;
  code?: string;
}

/**
 * Analyze an error message to determine if it's a TypeScript error and categorize it
 * @param errorMessage The error message to analyze
 * @returns Error information if it's a TypeScript error, null otherwise
 */
export function analyzeTypeError(errorMessage: string): TypeErrorInfo | null {
  // Check for JSX in .ts file errors
  if (
    errorMessage.includes("')' expected") || 
    errorMessage.includes("'>' expected") ||
    errorMessage.includes("JSX element 'div' has no corresponding closing tag")
  ) {
    return {
      category: TypeErrorCategory.JSX_IN_TS_FILE,
      message: "JSX syntax detected in a .ts file",
      suggestion: "Rename the file to .tsx or remove JSX elements",
      code: "const Component = () => <div>Content</div>; // Not allowed in .ts files"
    };
  }
  
  // Check for arrow function generic syntax errors
  if (
    (errorMessage.includes("',' expected") && errorMessage.includes("<")) ||
    (errorMessage.includes("Type parameter declaration expected") && errorMessage.includes("<")) ||
    errorMessage.includes("Unterminated regular expression literal")
  ) {
    return {
      category: TypeErrorCategory.ARROW_FUNCTION_GENERIC,
      message: "Generic arrow function syntax is ambiguous",
      suggestion: "Add a comma after the type parameter or use function declaration syntax",
      code: "const func = <T,>(param: T) => {}; // Notice the comma after T"
    };
  }
  
  // Check for type mismatch errors
  if (
    errorMessage.includes("Type") && 
    errorMessage.includes("is not assignable to type")
  ) {
    return {
      category: TypeErrorCategory.TYPE_MISMATCH,
      message: "Type mismatch detected",
      suggestion: "Ensure the types match or add proper type assertions",
      code: "const value: string = someValue as string;"
    };
  }
  
  // Check for undefined property access
  if (
    errorMessage.includes("Property") && 
    errorMessage.includes("does not exist on type")
  ) {
    return {
      category: TypeErrorCategory.UNDEFINED_PROPERTY,
      message: "Accessing undefined property",
      suggestion: "Check the property name or add it to the interface/type definition",
      code: "interface MyType { newProp?: string; }"
    };
  }
  
  // Generic TypeScript error
  if (errorMessage.includes(".ts(") || errorMessage.includes(".tsx(")) {
    return {
      category: TypeErrorCategory.GENERIC_SYNTAX,
      message: "TypeScript syntax error",
      suggestion: "Check the line mentioned in the error message",
      code: "// Review the syntax on the specified line"
    };
  }
  
  // Not a TypeScript error
  return null;
}

/**
 * Generate detailed report for TypeScript errors
 * @param errors List of error messages
 * @returns Structured report with categorized errors and suggestions
 */
export function generateTypeErrorReport(errors: string[]): {
  summary: {
    total: number;
    byCategory: Record<TypeErrorCategory, number>;
  };
  details: TypeErrorInfo[];
} {
  const details: TypeErrorInfo[] = [];
  const byCategory: Record<TypeErrorCategory, number> = {
    [TypeErrorCategory.GENERIC_SYNTAX]: 0,
    [TypeErrorCategory.JSX_IN_TS_FILE]: 0,
    [TypeErrorCategory.ARROW_FUNCTION_GENERIC]: 0,
    [TypeErrorCategory.TYPE_MISMATCH]: 0,
    [TypeErrorCategory.UNDEFINED_PROPERTY]: 0,
    [TypeErrorCategory.NULL_OBJECT]: 0
  };
  
  errors.forEach(error => {
    const analysis = analyzeTypeError(error);
    if (analysis) {
      details.push(analysis);
      byCategory[analysis.category]++;
    }
  });
  
  return {
    summary: {
      total: details.length,
      byCategory
    },
    details
  };
}

/**
 * Generate fix suggestions for a list of TypeScript errors
 * @param errors List of error messages
 * @returns Array of suggestions to fix the errors
 */
export function generateFixSuggestions(errors: string[]): string[] {
  const report = generateTypeErrorReport(errors);
  const suggestions: string[] = [];
  
  // Add general suggestions based on error categories
  if (report.summary.byCategory[TypeErrorCategory.JSX_IN_TS_FILE] > 0) {
    suggestions.push("Rename files containing JSX from .ts to .tsx");
  }
  
  if (report.summary.byCategory[TypeErrorCategory.ARROW_FUNCTION_GENERIC] > 0) {
    suggestions.push("Add commas after type parameters in generic arrow functions (<T,> instead of <T>)");
    suggestions.push("Or convert arrow functions with generics to regular function declarations");
  }
  
  return suggestions;
}
