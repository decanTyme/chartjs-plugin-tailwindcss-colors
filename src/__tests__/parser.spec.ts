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
    }
  )

  test.each`
    color       | output   | status
    ${"bisque"} | ${true}  | ${"is"}
    ${"zinc"}   | ${false} | ${"is not"}
  `(
    "If `$color` $status parsed when the `named` flag is passed",
    ({ color, output }) => {
      expect(parser.isParsable(color, { named: true })).toBe(output)
    }
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
