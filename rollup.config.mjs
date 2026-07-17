import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import { defineConfig } from "rollup"
import typescript from "rollup-plugin-ts"

import pkg from "./package.json" with { type: "json" }

const author = pkg.author.replaceAll(/ <[^>]+>/g, "")
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${author} and Contributors
 * Released under the ${pkg.license} License
 */`

/** @type {import("rollup").ExternalOption} */
const external = [
  "chart.js",
  "tailwindcss/resolveConfig",
  "lodash/get",
  "lodash/set",
  "tiny-invariant",
  "color-name",
]

/** @type {import("rollup").GlobalsOption} */
const globals = {
  "chart.js": "Chart",
  "tailwindcss/resolveConfig": "tailwind.resolveConfig",
}

/**
 * TypeScript never rewrites `export default` to `export =` in declaration
 * files, regardless of the target module format, so the CJS declaration
 * still describes an ESM namespace shape that doesn't match the actual
 * `module.exports = ...` produced by the CJS chunk.
 * @type {import("rollup").Plugin}
 */
const fixCjsDeclarationExport = {
  name: "fix-cjs-declaration-export",
  generateBundle(_options, bundle) {
    const dts = bundle["index.d.cts"]
    if (dts?.type === "asset" && typeof dts.source === "string") {
      dts.source = dts.source.replace(
        "export { twColorsPlugin as default };",
        "export = twColorsPlugin;",
      )
    }
  },
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
        file: pkg.exports.import.default,
        format: "esm",
        sourcemap: true,
      },
      {
        file: pkg.exports.require.default,
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
      fixCjsDeclarationExport,
    ],
  },
])
