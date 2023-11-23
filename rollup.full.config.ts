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
    input: 'src/index.common.ts',
    output: [
      {
        extend: true,
        format: 'iife',
        name: 'VMAFormulaGrid',
        file: "./dist/index.iife.js",
        globals: {
          vue: 'Vue'
        }
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        check: false,
      }),
      babel(),
      terser({
        ecma: 2015, // ES6
        mangle: { toplevel: true },
        compress: {
          module: true,
          toplevel: true,
          unsafe_arrows: true,
          drop_console: true
        },
        output: { comments: false } ,
      }),
    ],
    external: [
      'vue',
    ]
  }
])
