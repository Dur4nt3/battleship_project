import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat"

// Rules that shouldn't apply to the configuration file:
/* eslint quotes: 0 */
/* eslint @stylistic/quote-props: 0 */
/* eslint @stylistic/max-len: 0 */

export default defineConfig([
  globalIgnores([

    // Webpack configuration files are exempt
    "webpack.**.**",
    // test files are exempt
    "**/*.test.js",
    // Utilities used in test files are also exempt
    "src/modules/tests/utilities/*.js"

  ]),
  { files: ["**/*.{js,mjs,cjs}"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  eslintConfigPrettier,
  {
    plugins: { "@stylistic": stylistic },

    rules: {
      // ESLint Stylistic Plugin Rules:

      // Long strings (including comments) are exempt from this rule, and shouldn't be broken up
      "@stylistic/max-len": ["warn", { "code": 80, "ignoreComments": true, "ignoreStrings": true, }],

      "@stylistic/no-mixed-operators": "warn",
      "@stylistic/spaced-comment": ["warn", "always"],


      // Might be obtrusive => change to "off" if it is
      "prefer-const": "warn",

      "no-var": "error",
      "no-object-constructor": "error",
      "object-shorthand": "warn",
      "prefer-object-spread": "warn",
      "no-array-constructor": "error",
      "prefer-destructuring": "warn",
      "quotes": ["warn", "single"],
      "prefer-template": "warn",

      // "eval()" can open an application to vulnerabilities
      "no-eval": "error",

      // Similar to "eval()"
      "no-new-func": "error",

      "no-useless-escape": "warn",
      "func-names": ["error", "as-needed"],
      "no-loop-func": "error",
      "prefer-rest-params": "error",

      // Might not work as expected
      "camelcase": "error",

      "default-param-last": "error",
      "prefer-spread": "error",
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-useless-constructor": "error",
      "class-methods-use-this": "error",
      "no-duplicate-imports": "error",

      // Can switch to: "dot-notation": ["warn", { "allowKeywords": false }]
      "dot-notation": "warn",

      "prefer-exponentiation-operator": "warn",
      "no-undef": "error",

      // "never" ensures variable declarations are split
      "one-var": ["error", "never"],

      "no-multi-assign": "error",

      // Used due to potential errors caused by automatic semicolon insertions
      "no-plusplus": "error",

      "no-use-before-define": "error",
      "eqeqeq": "error",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-new-wrappers": "error",
      "radix": "error",

      // Exceptions: "e" for event listeners, "a" and "b" for sorting arrays, "i" and "j" for iterators
      "id-length": ["error", { "exceptions": ["e", "a", "b", "i", "j"] }],

      // Includes options you might want to add
      "new-cap": "error",

      "no-underscore-dangle": "warn",
      'no-restricted-globals': [
      'error',
      {
        name: 'isFinite',
        message:
          'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
      },
      {
        name: 'isNaN',
        message:
          'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
      },
    ],
    },
  },
]);
