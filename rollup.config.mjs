import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { obfuscator } from "rollup-obfuscator";
import postcss from 'rollup-plugin-postcss';
import pkg from "./package.json" assert { type: 'json' };
import replace from "rollup-plugin-replace";



export default {
  moduleSideEffects: true,
  input: "src/index.ts",
  output: [
    {
      file: "./lib/cjs/index.js",
      format: "cjs",
    },
    {
      file: "./lib/esm/index.js",
      format: "es",
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      exclude: ["**/*.test.tsx", "**/*.test.ts", "**/*.stories.ts"],
    }),
    postcss({ extensions: ['.css'], inject: true, extract: false }),

    obfuscator({
      numbersToExpressions: true,
    }),
    terser(),
  ],
};
