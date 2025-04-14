
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
    // React hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // React refresh rules (for development)
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  }
};
