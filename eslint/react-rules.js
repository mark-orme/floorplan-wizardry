
/**
 * React-specific ESLint rules
 * @module eslint/react-rules
 */
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";

export const reactRules = {
  extends: [
    ...reactHooks.configs.recommended,
    reactPlugin.configs.recommended,
  ],
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    "react": reactPlugin,
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    // React general rules
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unused-prop-types": "warn",
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-boolean-value": ["error", "never"],
    "react/no-unstable-nested-components": "warn",
    
    // React function component definition style
    "react/function-component-definition": ["warn", {
      "namedComponents": "arrow-function",
      "unnamedComponents": "arrow-function"
    }],
    
    // React hooks rules - Stricter rules to prevent infinite loops
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": ["error", {
      "additionalHooks": "(useRecoilCallback|useRecoilTransaction_UNSTABLE)"
    }],
    
    // Custom rule to detect potential infinite loops
    "custom/no-recursive-updates": {
      create(context) {
        return {
          CallExpression(node) {
            // Check for setState in useEffect without proper deps
            if (node.callee.type === "Identifier" && 
                node.callee.name.startsWith("set") && 
                node.callee.name[3] && 
                node.callee.name[3] === node.callee.name[3].toUpperCase()) {
              
              const ancestors = context.getAncestors();
              const useEffectAncestor = ancestors.find(ancestor => 
                ancestor.type === "CallExpression" && 
                ancestor.callee.type === "Identifier" && 
                ancestor.callee.name === "useEffect"
              );
              
              if (useEffectAncestor) {
                // Check if the setState's state is in the dependencies array
                const stateVar = node.callee.name.substring(3);
                const stateVarLowerCase = stateVar.charAt(0).toLowerCase() + stateVar.slice(1);
                
                const depsArray = useEffectAncestor.arguments[1];
                if (!depsArray || depsArray.type !== "ArrayExpression") {
                  context.report({
                    node,
                    message: `useState setter (${node.callee.name}) is used in a useEffect without a dependency array. This might cause an infinite loop.`
                  });
                  return;
                }
                
                // Check if corresponding state variable is in deps array
                const depElements = depsArray.elements || [];
                const hasStateDep = depElements.some(
                  el => el.type === "Identifier" && (el.name === stateVarLowerCase || el.name === node.callee.name)
                );
                
                // If not in deps array, warn about potential infinite loop
                if (!hasStateDep) {
                  context.report({
                    node,
                    message: `useState setter (${node.callee.name}) might cause recursive updates because it updates state (${stateVarLowerCase}) which is missing from the deps array.`
                  });
                }
              }
            }
          }
        };
      }
    },
    
    // React refresh rules (for development)
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  }
};
