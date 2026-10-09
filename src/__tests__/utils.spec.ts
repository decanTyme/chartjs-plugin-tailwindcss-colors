import type * as ColorUtils from "../utils"

import { hasValidAlpha, isHex, isNamedColor, isParsableString } from "../utils"

interface TestArgs {
  color: string
  output: boolean
}

describe("Parsable string validator recognises native CSS colors", () => {
  test.each([
    "rgb(1 2 3)",
    " rgba(1, 2, 3, 0.5) ",
    "hsl(120 100% 50%)",
    " HSLA(120, 100%, 50%, 0.5) ",
    "\tTrAnSpArEnT\n",
  ])("skips native CSS color %s", (color) => {
    expect(isParsableString(color)).toBe(false)
  })
})

describe("Named color validator rejects inherited properties and module metadata", () => {
  test.each(["constructor", "toString", "__proto__", "hasOwnProperty"])(
    "does not treat %s as a named color",
    (color) => {
      expect(isNamedColor(color)).toBe(false)
      expect(hasValidAlpha(`${color}/50`)).toBe(false)
    },
  )

  test("does not treat CommonJS module metadata as named colors", () => {
    jest.isolateModules(() => {
      jest.doMock("color-name", () => ({
        __esModule: true,
        default: { __esModule: true, default: {}, red: [255, 0, 0] },
      }))

      try {
        const utils = jest.requireActual<typeof ColorUtils>("../utils")

        expect(utils.isNamedColor("red")).toBe(true)
        expect(utils.isNamedColor("__esModule")).toBe(false)
        expect(utils.isNamedColor("default")).toBe(false)
        expect(utils.hasValidAlpha("__esModule/50")).toBe(false)
        expect(utils.hasValidAlpha("default/50")).toBe(false)
      } finally {
        jest.dontMock("color-name")
      }
    })
  })
})

describe("Hex validator is working", () => {
  test.each`
    color               | output   | status
    ${"#fff"}           | ${true}  | ${"valid"}
    ${"#ffff"}          | ${true}  | ${"valid"}
    ${"#ffffff"}        | ${true}  | ${"valid"}
    ${"#ffffffff"}      | ${true}  | ${"valid"}
    ${"#ff"}            | ${false} | ${"invalid"}
    ${"#fffff"}         | ${false} | ${"invalid"}
    ${"#fffffff"}       | ${false} | ${"invalid"}
    ${"#fffffffff"}     | ${false} | ${"invalid"}
    ${"#ffffffgarbage"} | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }: TestArgs) => {
    expect(isHex(color)).toBe(output)
  })
})

describe("Alpha validator is working", () => {
  test.each`
    color                 | output   | status
    ${"yellow-50/1"}      | ${true}  | ${"valid"}
    ${"green-900/50"}     | ${true}  | ${"valid"}
    ${"red-100/100"}      | ${true}  | ${"valid"}
    ${"aqua/75"}          | ${true}  | ${"valid"}
    ${"bisque/"}          | ${false} | ${"invalid"}
    ${"lime-600/200"}     | ${false} | ${"invalid"}
    ${"orange-200/"}      | ${false} | ${"invalid"}
    ${"pink-300/0"}       | ${false} | ${"invalid"}
    ${"/"}                | ${false} | ${"invalid"}
    ${"/85"}              | ${false} | ${"invalid"}
    ${"noop/85"}          | ${false} | ${"invalid"}
    ${"red-500/50/extra"} | ${false} | ${"invalid"}
    ${"red-500/50.5"}     | ${false} | ${"invalid"}
    ${"red-500/50%"}      | ${false} | ${"invalid"}
    ${"red-500/50!"}      | ${false} | ${"invalid"}
    ${"aqua/50.5"}        | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }: TestArgs) => {
    expect(hasValidAlpha(color)).toBe(output)
  })
})

describe("Alpha validator is working with hex values", () => {
  test.each`
    color                  | output   | status
    ${"#c08240/20"}        | ${true}  | ${"valid"}
    ${"#bc4/20"}           | ${true}  | ${"valid"}
    ${"#a42c20/200"}       | ${false} | ${"invalid"}
    ${"#bc4/200"}          | ${false} | ${"invalid"}
    ${"##a42c20/70"}       | ${false} | ${"invalid"}
    ${"#a42c20/0"}         | ${false} | ${"invalid"}
    ${"b69576/45"}         | ${false} | ${"invalid"}
    ${"#b69576/"}          | ${false} | ${"invalid"}
    ${"#/"}                | ${false} | ${"invalid"}
    ${"#/20"}              | ${false} | ${"invalid"}
    ${"#fffff/50"}         | ${false} | ${"invalid"}
    ${"#ffffffgarbage/50"} | ${false} | ${"invalid"}
    ${"#fff/50/extra"}     | ${false} | ${"invalid"}
  `("if `$color` is $status", ({ color, output }: TestArgs) => {
    expect(hasValidAlpha(color)).toBe(output)
  })
})
