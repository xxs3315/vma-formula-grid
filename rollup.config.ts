import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

/**
 * Rollup Configuration
 */
export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'es',
        entryFileNames: chunk => `index.es.js`
      },
      {
        dir: 'dist',
        format: 'cjs',
        exports: 'named',
        entryFileNames: chunk => `index.cjs.js`
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        check: false,
      }),
      babel(),
      terser(),
    ],
    external: [
      'vue',
      'bahttext',
      'bessel',
      'chevrotain',
      'jstat'
    ]
  }
])
