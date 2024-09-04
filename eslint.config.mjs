// @ts-check
import globals from 'globals'
// eslint-disable-next-line import-x/no-unresolved
import tslint from 'typescript-eslint'
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
  ...tslint.configs.strict,
  stylistic.configs['recommended-flat'],
  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      'import-x/extensions': ['error', { ts: 'ignorePackages' }],
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'error',
    },
  },
]
