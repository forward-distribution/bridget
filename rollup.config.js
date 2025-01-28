import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import swc from '@rollup/plugin-swc'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const swcOpts = kind => ({
  exclude: '**/*.json',
  swc: {
    env: {
      ...(kind === 'modern' ? {} : { mode: 'usage', coreJs: '3.40.0' }),
      targets:
        kind === 'modern'
          ? 'fully supports es6-module and not op_mini all and not dead'
          : 'since 2015 and not dead',
    },

    module: {
      type: 'es6',
    },
  },
})

const outputPlugins = [terser()]
const commonOptions = {
  sourcemap: true,
}

const defaultPlugins = [resolve(), commonjs(), json()]

// The gist of this configuration is
// - use modern javascript syntax (hence ecmaVersion: 2022)
// - don't use API that's not available in browsers since they support the module syntax
//
// This way we can produce a very small bundle for browsers since 2017 (supporting <script module='...')
// and fall back to full blown polyfilled bundle with <script nomodule>
export default [
  {
    input: 'src/bridget.js',
    output: [
      {
        format: 'es',
        file: 'dist/bridget.js',
        ...commonOptions,
        plugins: outputPlugins,
      },
    ],
    plugins: [...defaultPlugins, swc(swcOpts('modern'))],
  },
  {
    input: 'src/bridget.js',
    output: {
      format: 'cjs',
      file: 'dist/legacy/bridget.js',
      ...commonOptions,
      plugins: outputPlugins,
    },
    plugins: [...defaultPlugins, swc(swcOpts('legacy'))],
  },
]
