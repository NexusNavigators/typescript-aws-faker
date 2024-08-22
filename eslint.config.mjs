import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import importX from 'eslint-plugin-import-x'

export default [
  {
    files: ['**/*.{mjs,ts}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.es2023,
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  stylistic.configs['recommended-flat'],
  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      'import-x/extensions': ['error', { ts: 'ignorePackages' }],
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-duplicates': 'error',
    },
  },
]
