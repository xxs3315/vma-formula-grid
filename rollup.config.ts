import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import vue from 'rollup-plugin-vue'
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
        entryFileNames: chunk => `[name].mjs`
      },
      {
        dir: 'dist',
        format: 'cjs',
        exports: 'named',
        entryFileNames: chunk => `[name].cjs`
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        check: false
      }),
      terser(),
      vue(),
      postcss(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.vue']
      })
    ],
    external: [
      /^vue(\/.+|$)/
    ]
  }
])
