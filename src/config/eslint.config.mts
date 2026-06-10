import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "@typescript-eslint": tseslint.plugin },
    extends: ["js/recommended", prettier],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "getter-return": "error",
      "no-compare-neg-zero": "error",
      "no-console": "warn",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "curly": ["error", "all"],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      "no-duplicate-imports": "error",
      "object-shorthand": ["error", "always"],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": "return" },
        { "blankLine": "always", "prev": ["const", "let", "var"], "next": "*" },
        { "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"] }
      ],
      "prefer-arrow-callback": ["error", { "allowNamedFunctions": false, "allowUnboundThis": true }],
      "arrow-body-style": ["error", "as-needed"],
      "consistent-return": "error",
      "default-param-last": "error",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "ForInStatement",
          "message": "Use Object.keys/values/entries instead of for..in."
        },
        {
          "selector": "LabeledStatement",
          "message": "Avoid labels as they make code harder to follow."
        },
        {
          "selector": "WithStatement",
          "message": "Avoid with statements."
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@angular-eslint/contextual-lifecycle": "error",
      "@angular-eslint/no-attribute-decorator": "error",
      "rxjs/no-subscribe-handlers": "error",
      "@angular-eslint/component-selector": [
        "error",
        { "type": "element", "prefix": "cmap", "style": "kebab-case" }
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { "type": "attribute", "prefix": "cmap", "style": "camelCase" }
      ],
      "@angular-eslint/no-conflicting-lifecycle": "error"
    }
  },
  tseslint.configs.recommended,
]);
