import compat from 'eslint-plugin-compat'
import js from '@eslint/js'
import globals from 'globals'

// The gist of this configuration is
// - use modern javascript syntax (hence ecmaVersion: 2022)
// - don't use API that's not available in browsers since they support the module syntax
//
// This way we can produce a very small bundle for browsers since 2017 (supporting <script module='...')
// and fall back to full blown polyfilled bundle with <script nomodule>
export default [
  {
    ignores: [
      'eslint.config.js',
      'rollup.config.js',
      'dist/**/*',
      'src/compiled-schema/**/*',
    ],
  },
  js.configs.recommended,
  compat.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
      },
    },
  },
]
