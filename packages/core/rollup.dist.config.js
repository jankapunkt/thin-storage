import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'lib/Storage.js',
  output: [
    {
      file: 'dist/Storage.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/Storage.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    },
    {
      file: 'dist/Storage.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
      sourcemap: true
    }
  ]
}, {
  input: 'lib/Storage.js',
  output: {
    file: 'dist/Storage.iife.js',
    format: 'iife',
    name: 'Storage',
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
