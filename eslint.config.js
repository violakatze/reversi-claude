// ESLint設定（Flat Config形式、ESLint v9+対応）
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 無視するファイル
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  // 基本設定
  js.configs.recommended,
  // TypeScriptファイル設定
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Math: 'readonly',
        Infinity: 'readonly',
        JSON: 'readonly',
        Error: 'readonly',
        Array: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      // useEffect内でのsetStateは今回のゲームループ実装で必要なため無効化
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // Prettierとの競合を無効化
  prettierConfig,
];
