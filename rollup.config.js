import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import swc from '@rollup/plugin-swc'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const swcOpts = kind => ({
  exclude: '**/*.json',
  swc: {
    env: {
      debug: true,
      mode: 'usage',
      coreJs: '3.40.0',
      targets: kind === 'modern' ? 'defaults' : 'since 2015, not dead',
    },

    module: {
      type: 'es6',
    },
  },
})

// const outputPlugins = [terser()]
const outputPlugins = []
const commonOptions = {
  sourcemap: true,
}

const defaultPlugins = [resolve(), commonjs(), json()]

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
