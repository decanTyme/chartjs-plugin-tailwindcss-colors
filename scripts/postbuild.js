/**
 * Manually edit the cjs types to use the correct export type
 * i.e. `export = ...`
 */
const fs = require("node:fs")

const name = "twColorsPlugin"
const filePath = "dist/index.d.ts"

const content = fs.readFileSync(filePath, "utf8")

fs.writeFileSync(
  filePath,
  content.replace(`export { ${name} as default };`, `export = ${name};`),
  "utf8"
)

console.info("Post-build script executed successfully.")
