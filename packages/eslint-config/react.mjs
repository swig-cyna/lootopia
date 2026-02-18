import globals from "globals"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"
import { createConfig } from "@lootopia/eslint-config"

/**
 * ESLint config for React packages.
 * Extends the base config with React, React Hooks, and JSX a11y rules.
 * @param {string} tsconfigRootDir - Path to the package root (use import.meta.dirname)
 * @param {import("eslint").Linter.Config[]} overrides - Additional config blocks to merge
 */
export function createReactConfig(tsconfigRootDir, ...overrides) {
  return createConfig(
    tsconfigRootDir,
    {
      files: ["**/*.tsx", "**/*.jsx"],
      languageOptions: {
        globals: {
          ...globals.browser,
        },
      },
      plugins: {
        react: reactPlugin,
        "react-hooks": reactHooksPlugin,
        "jsx-a11y": jsxA11yPlugin,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        ...reactPlugin.configs.recommended.rules,
        ...reactHooksPlugin.configs.recommended.rules,
        ...jsxA11yPlugin.configs.recommended.rules,

        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/self-closing-comp": ["error", { component: true, html: true }],
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "react/jsx-curly-brace-presence": [
          "error",
          { props: "never", children: "never" },
        ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
    ...overrides,
  )
}
