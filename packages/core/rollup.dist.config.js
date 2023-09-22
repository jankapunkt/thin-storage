import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'lib/ThinStorage.js',
  output: [
    {
      file: 'dist/ThinStorage.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/ThinStorage.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/ThinStorage.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    }
  ]
}, {
  input: 'lib/ThinStorage.js',
  output: {
    file: 'dist/ThinStorage.iife.js',
    format: 'iife',
    name: 'ThinStorage',
    sourcemap: true
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}]
