import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'

const outputPlugins = [terser()]
const defaultPlugins = [json()]

export default {
  input: 'src/bridget.js',
  output: [
    {
      file: 'dist/bridget.cjs',
      format: 'cjs',
      plugins: outputPlugins
    },
    {
      file: 'dist/bridget.js',
      format: 'es',
      plugins: outputPlugins
    }
  ],
  plugins: defaultPlugins
}
