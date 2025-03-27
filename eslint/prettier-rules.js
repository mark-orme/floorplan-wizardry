
/**
 * Prettier integration with ESLint
 * @module eslint/prettier-rules
 */
import prettier from "eslint-plugin-prettier";
import { PRETTIER_OPTIONS } from "./constants.js";

export const prettierRules = {
  plugins: {
    "prettier": prettier,
  },
  rules: {
    "prettier/prettier": ["warn", PRETTIER_OPTIONS]
  }
};
