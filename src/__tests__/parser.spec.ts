import TailwindColorsParser from "../parser"

import tailwindConfig from "./tailwind.config"

const parser = new TailwindColorsParser(tailwindConfig)

describe("Parser resolves configured colors and opacity", () => {
  test.each`
    color             | output
    ${"black"}        | ${"#000"}
    ${"slate-700"}    | ${"#334155"}
    ${"yellow-50"}    | ${"#fefce8"}
    ${"red-100"}      | ${"#fee2e2"}
    ${"main"}         | ${"#5a65f6"}
    ${"choco-50"}     | ${"#987654"}
    ${"choco-300"}    | ${"#6a533b"}
    ${"stone-50"}     | ${"#fafaf9"}
    ${"green-900"}    | ${"#14532d"}
    ${"green-400/50"} | ${"rgb(74 222 128 / 0.5)"}
    ${"crimson/50"}   | ${"rgb(220 20 60 / 0.5)"}
    ${"stone-50/30"}  | ${"rgb(250 250 249 / 0.3)"}
    ${"#3b82f6/75"}   | ${"rgb(59 130 246 / 0.75)"}
  `(
    "resolves $color",
    ({ color, output }: { color: string; output: string }) => {
      expect(parser.resolve(color)).toEqual({
        kind: "converted",
        value: output,
      })
    },
  )

  test.each([
    "brand-rgb",
    "rgb-brand",
    "brand-hsl",
    "hsl-brand",
    "brand-transparent",
    "transparent-brand",
    "brand-color",
    "color-brand",
    "brand-color-mix",
    "color-mix-brand",
    "brand-light-dark",
    "light-dark-brand",
    "RED",
    "CanvasText",
    "WindowText",
  ])("resolves configured alias %s containing a CSS color name", (color) => {
    const configuredParser = new TailwindColorsParser({
      content: [],
      theme: { colors: { [color]: "#123456" } },
    })

    expect(configuredParser.resolve(color)).toEqual({
      kind: "converted",
      value: "#123456",
    })
  })

  test("resolves configured aliases that shadow Object.prototype", () => {
    const configuredParser = new TailwindColorsParser({
      content: [],
      theme: { colors: { constructor: "#123456", toString: "#654321" } },
    })

    expect(configuredParser.resolve("constructor")).toEqual({
      kind: "converted",
      value: "#123456",
    })
    expect(configuredParser.resolve("toString")).toEqual({
      kind: "converted",
      value: "#654321",
    })
  })
})

describe("Parser recognizes native CSS colors", () => {
  test.each([
    "rgb(1 2 3)",
    "color(srgb 1 0 0)",
    "color-mix(in srgb, red 50%, blue)",
    "light-dark(rgb(1 2 3), rgb(4 5 6))",
    "transparent",
    "currentColor",
    "bisque",
    "#fff",
    "#fff8",
    "#c08240",
    "#c0824066",
    "RED",
    "RebeccaPurple",
    "CanvasText",
    "\tCanvasText\n",
    "WindowText",
  ])("leaves %s to the browser", (color) => {
    expect(parser.resolve(color)).toEqual({ kind: "native" })
  })
})

describe("Parser identifies invalid colors without choosing a handling mode", () => {
  test.each([
    "constructor",
    "toString",
    "__proto__",
    "constructor/50",
    "toString/50",
    "__proto__/50",
    "__esModule/50",
    "default/50",
    "#fffff/50",
    "#fff/50/extra",
    "#fff/50.5",
    "red-999/50",
    "not-a-color",
    "orange-90",
    "pink-250",
    "indigo-0",
    "mango-200",
    "",
    " ",
    "emerald-",
    "purple-cyan",
    "slate-0",
    "#cyan-900",
    "#cyan-900/55",
    "##cyan-900/55",
    "b69576",
    "##b69576",
    "b69576/",
    "zinc",
  ])("identifies %s as invalid", (color) => {
    expect(parser.resolve(color)).toEqual({ kind: "invalid" })
  })

  test("identifies palette values that cannot be converted to RGB with opacity", () => {
    const configuredParser = new TailwindColorsParser({
      content: [],
      theme: {
        colors: {
          "custom-500": "var(--chart-color)",
          "custom-600": "rgb(1 2 3)",
        },
      },
    })

    expect(configuredParser.resolve("custom-500")).toEqual({
      kind: "converted",
      value: "var(--chart-color)",
    })
    expect(configuredParser.resolve("custom-500/50")).toEqual({
      kind: "invalid",
    })
    expect(configuredParser.resolve("custom-600/50")).toEqual({
      kind: "invalid",
    })
  })
})
