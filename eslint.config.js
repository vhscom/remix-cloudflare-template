import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // Base configuration for all files
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Equivalent to env settings
        window: 'readonly',
        document: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    ignores: ['!**/.server', '!**/.client'],
  },

  // Include recommended JS rules
  js.configs.recommended,

  // React and JSX configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import/resolver': {
        typescript: {},
      },
    },
  },

  // TypeScript specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
    },
  },
];
