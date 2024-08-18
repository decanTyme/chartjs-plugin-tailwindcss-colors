import type { ExternalOption, GlobalsOption } from "rollup"

import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import { defineConfig } from "rollup"
import typescript from "rollup-plugin-ts"

import pkg from "./package.json" assert { type: "json" }

const author = pkg.author.replaceAll(/ <[^>]+>/g, "")
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${author} and Contributors
 * Released under the ${pkg.license} License
 */`

const external: ExternalOption = [
  "chart.js",
  "tailwindcss/resolveConfig",
  "lodash/get",
  "lodash/set",
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
    external: external.slice(0, 2),
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
          sourceMap: true,
        }),
      }),
      commonjs(),
      resolve(),
    ],
  },
])
