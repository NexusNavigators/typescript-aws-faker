import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default [
  { files: ['**/*.{mjs,ts}'] },
  { languageOptions: {
    globals: globals.node,
  } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs['recommended-flat'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
