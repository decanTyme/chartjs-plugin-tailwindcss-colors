import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
import dts from "unplugin-dts/rollup"

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
        compilerOptions: {
          allowJs: false,
          sourceMap: true,
        },
      }),
      replace({ preventAssignment: true }),
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
        compilerOptions: {
          allowJs: false,
          sourceMap: true,
        },
      }),

      dts({
        bundleTypes: true,

        outDirs: [
          { dir: "dist", moduleFormat: "esm" },
          { dir: "dist", moduleFormat: "cjs" },
        ],

        // TypeScript never rewrites `export default` to `export =` in declaration
        // files, regardless of the target module format, so the CJS declaration
        // still describes an ESM namespace shape that doesn't match the actual
        // `module.exports = ...` produced by the CJS chunk.
        beforeWriteFile(filePath, content) {
          content = content.replace(/\nexport \{\s*\}\s*;?\s*$/, "\n")

          if (filePath.endsWith(".d.cts")) {
            content = content.replace(
              "export default twColorsPlugin;",
              "export = twColorsPlugin;",
            )
          }

          return { content }
        },
      }),

      commonjs(),
      resolve(),
    ],
  },
])
