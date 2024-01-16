import type { ExternalOption, GlobalsOption } from "rollup"

import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import { defineConfig } from "rollup"
import typescript from "rollup-plugin-ts"

import pkg from "./package.json" assert { type: "json" }

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.author.replaceAll(
  / <[^>]+>/g,
  ""
)} and ${pkg.name} Contributors
 * Released under the MIT License
 */`

const external: ExternalOption = [
  "chart.js",
  "tailwindcss/resolveConfig",
  "lodash.get",
  "lodash.set",
  "tiny-invariant",
  "color-name",
]

const globals: GlobalsOption = {
  "chart.js": "Chart",
  "tailwindcss/resolveConfig": "tailwind.resolveConfig",
}

export default defineConfig([
  {
    input: pkg.source,
    output: {
      name: "twColorsPlugin",
      file: pkg.exports.browser,
      format: "umd",
      banner,
      globals,
      sourcemap: true,
    },
    external: external.slice(0, 1),
    plugins: [
      typescript({
        tsconfig: (resolved) => ({
          ...resolved,
          allowJs: false,
          sourceMap: true,
        }),
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      commonjs(),
      resolve({ browser: true }),
    ],
  },
  {
    input: pkg.source,
    output: [
      {
        file: pkg.exports.import,
        format: "esm",
        sourcemap: true,
      },
      {
        file: pkg.exports.require,
        format: "cjs",
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      typescript({
        tsconfig: (resolved) => ({
          ...resolved,
          declaration: true,
          declarationMap: true,
          sourceMap: true,
        }),
        hook: {
          // ensure rewrite to avoid declaration dupes
          outputPath: (_, kind) =>
            `./dist/types.d.ts${kind === "declaration" ? "" : ".map"}`,
        },
      }),
      commonjs(),
      resolve(),
    ],
  },
])
