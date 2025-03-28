
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
    
    // React hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    
    // React refresh rules (for development)
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  }
};
