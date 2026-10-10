import TailwindColorsParser from "../parser"

import tailwindConfig from "./tailwind.config"

const parser = new TailwindColorsParser(tailwindConfig)

describe("Parser", () => {
  test.each`
    color                          | output
    ${"transparent"}               | ${"transparent"}
    ${"black"}                     | ${"#000"}
    ${"slate-700"}                 | ${"#334155"}
    ${"main"}                      | ${"#5a65f6"}
    ${"green-400/50"}              | ${"rgb(74 222 128 / 0.5)"}
    ${["choco-300", "crimson/50"]} | ${["#6a533b", "rgb(220 20 60 / 0.5)"]}
  `("`$color`", ({ color, output }) => {
    expect(parser.parse(color)).toStrictEqual(output)
  })

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

    expect(configuredParser.isParsable(color)).toBe(true)
    expect(configuredParser.isParsable(color, { strict: true })).toBe(true)
    expect(configuredParser.parse(color)).toBe("#123456")
  })

  test.each([
    "color(srgb 1 0 0)",
    "color-mix(in srgb, red 50%, blue)",
    "light-dark(rgb(1 2 3), rgb(4 5 6))",
  ])("preserves native CSS color %s in a mixed array", (color) => {
    const colors = [color, "red-500", "blue-500/75"]

    expect(parser.isParsable(colors)).toBe(true)
    expect(parser.parse(colors)).toEqual([
      color,
      "#ef4444",
      "rgb(59 130 246 / 0.75)",
    ])
    expect(colors).toEqual([color, "red-500", "blue-500/75"])
  })

  test.each([
    "RED",
    "RebeccaPurple",
    "CanvasText",
    "\tCanvasText\n",
    "WindowText",
  ])("preserves native CSS keyword %s in scalars and arrays", (color) => {
    const reportInvalidColor = jest.fn()

    expect(parser.isInvalidColor(color)).toBe(false)
    expect(parser.parse(color)).toBe(color)
    expect(parser.parse([color, "red-500"], reportInvalidColor)).toEqual([
      color,
      "#ef4444",
    ])
    expect(reportInvalidColor).not.toHaveBeenCalled()
  })
})

describe("Parser handles invalid color input", () => {
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
  ])("rejects %s without an explicit invalid-color handler", (color) => {
    expect(parser.isParsable(color)).toBe(false)
    expect(parser.isInvalidColor(color)).toBe(true)
    expect(() => parser.parse(color)).toThrow("Cannot resolve color")
  })

  test("preserves invalid array entries only with an explicit handler", () => {
    const reportInvalidColor = jest.fn()

    expect(
      parser.parse(
        ["red-500", "not-a-color", "__proto__/50", "crimson/50"],
        reportInvalidColor,
      ),
    ).toEqual([
      "#ef4444",
      "not-a-color",
      "__proto__/50",
      "rgb(220 20 60 / 0.5)",
    ])
    expect(reportInvalidColor).toHaveBeenNthCalledWith(1, "not-a-color", 1)
    expect(reportInvalidColor).toHaveBeenNthCalledWith(2, "__proto__/50", 2)
  })

  test("does not partially convert an invalid array without a handler", () => {
    const colors = ["red-500", "not-a-color", "blue-500"]

    expect(() => parser.parse(colors)).toThrow('"not-a-color" at color[1]')
    expect(colors).toEqual(["red-500", "not-a-color", "blue-500"])
  })

  test("preserves configured color aliases that shadow Object.prototype", () => {
    const configuredParser = new TailwindColorsParser({
      content: [],
      theme: { colors: { constructor: "#123456", toString: "#654321" } },
    })

    expect(configuredParser.isParsable("constructor")).toBe(true)
    expect(configuredParser.parse("constructor")).toBe("#123456")
    expect(configuredParser.parse("toString")).toBe("#654321")
  })

  test("rejects palette values that cannot be converted to RGB with opacity", () => {
    const configuredParser = new TailwindColorsParser({
      content: [],
      theme: {
        colors: {
          "custom-500": "var(--chart-color)",
          "custom-600": "rgb(1 2 3)",
        },
      },
    })

    expect(configuredParser.parse("custom-500")).toBe("var(--chart-color)")
    expect(configuredParser.isParsable("custom-500/50")).toBe(false)
    expect(() => configuredParser.parse("custom-500/50")).toThrow(
      "Cannot resolve color",
    )
    expect(() => configuredParser.parse("custom-600/50")).toThrow(
      "Cannot resolve color",
    )
  })
})

describe("Validator is working with configured colors only (strict)", () => {
  test.each`
    color            | output   | status
    ${"black"}       | ${true}  | ${"valid"}
    ${"yellow-50"}   | ${true}  | ${"valid"}
    ${"red-100"}     | ${true}  | ${"valid"}
    ${"transparent"} | ${false} | ${"skipped"}
    ${"orange-90"}   | ${false} | ${"invalid"}
    ${"pink-250"}    | ${false} | ${"invalid"}
    ${"indigo-0"}    | ${false} | ${"invalid"}
    ${"#c08240"}     | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }) => {
    expect(parser.isParsable(color, { strict: true })).toBe(output)
  })
})

describe("Validator is working (non-strict)", () => {
  test("If arrays with valid values should be parsed", () => {
    expect(parser.isParsable(["red-600", "#3b82f6/75"])).toBe(true)
  })

  test.each`
    color            | output   | status
    ${"black"}       | ${true}  | ${"valid"}
    ${"transparent"} | ${false} | ${"skipped"}
    ${""}            | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }) => {
    expect(parser.isParsable(color)).toBe(output)
  })

  test.each`
    value              | output   | status
    ${"stone-50"}      | ${true}  | ${"be"}
    ${"stone-50/30"}   | ${true}  | ${"be"}
    ${"green-900"}     | ${true}  | ${"be"}
    ${" "}             | ${false} | ${"not be"}
    ${"bisque"}        | ${false} | ${"not be"}
    ${"#c08240"}       | ${false} | ${"not be"}
    ${"#c0824066"}     | ${false} | ${"not be"}
    ${"emerald-"}      | ${false} | ${"not be"}
    ${"purple-cyan"}   | ${false} | ${"not be"}
    ${"slate-0"}       | ${false} | ${"not be"}
    ${"#cyan-900"}     | ${false} | ${"not be"}
    ${"#cyan-900/55"}  | ${false} | ${"not be"}
    ${"##cyan-900/55"} | ${false} | ${"not be"}
    ${"b69576"}        | ${false} | ${"not be"}
    ${"##b69576"}      | ${false} | ${"not be"}
    ${"b69576/"}       | ${false} | ${"not be"}
  `("if `$value` should $status parsed", ({ value, output }) => {
    expect(parser.isParsable(value)).toBe(output)
  })

  test.each`
    color             | output   | status
    ${"#c08240"}      | ${true}  | ${"is"}
    ${"#c0824066"}    | ${true}  | ${"is"}
    ${"#cyan-900"}    | ${false} | ${"is not"}
    ${"#cyan-900/55"} | ${false} | ${"is not"}
  `(
    "If `$color` $status parsed when the `hex` flag is passed",
    ({ color, output }) => {
      expect(parser.isParsable(color, { hex: true })).toBe(output)
    },
  )

  test.each`
    color       | output   | status
    ${"bisque"} | ${true}  | ${"is"}
    ${"zinc"}   | ${false} | ${"is not"}
  `(
    "If `$color` $status parsed when the `named` flag is passed",
    ({ color, output }) => {
      expect(parser.isParsable(color, { named: true })).toBe(output)
    },
  )
})

describe("Validator is working with extended colors (strict)", () => {
  test.each`
    color          | output   | status
    ${"main"}      | ${true}  | ${"valid"}
    ${"choco-50"}  | ${true}  | ${"valid"}
    ${"mango-200"} | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }) => {
    expect(parser.isParsable(color, { strict: true })).toBe(output)
  })
})
