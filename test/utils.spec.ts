/* eslint-disable @typescript-eslint/ban-ts-comment */
import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"
import { flattenColorPalette } from "../src/color"
import { hasValidAlpha, twColorValidator } from "../src/utils"

// @ts-ignore
import tailwindConfig from "./tailwind.config"

const {
  theme: { colors },
} = resolveConfig(tailwindConfig)

invariant(colors, "TailwindCSS theme colors is undefined!")

const colorPalette = flattenColorPalette(colors)
const isValidTwColor = twColorValidator(colorPalette)

describe("Validator is working with config colors only (strict)", () => {
  test("If `transparent` is valid", () => {
    expect(isValidTwColor("transparent")).toBe(true)
  })

  test("If `black` is valid", () => {
    expect(isValidTwColor("black")).toBe(true)
  })

  test("If `yellow-50` is valid", () => {
    expect(isValidTwColor("yellow-50")).toBe(true)
  })

  test("If `red-100` is valid", () => {
    expect(isValidTwColor("red-100")).toBe(true)
  })

  test("If `` is invalid", () => {
    expect(isValidTwColor("")).toBe(false)
  })

  test("If `orange-90` is invalid", () => {
    expect(isValidTwColor("orange-90")).toBe(false)
  })

  test("If `pink-250` is invalid", () => {
    expect(isValidTwColor("pink-250")).toBe(false)
  })

  test("If `indigo-0` is invalid", () => {
    expect(isValidTwColor("indigo-0")).toBe(false)
  })

  test("If `#c08240` is invalid", () => {
    expect(isValidTwColor("#c08240")).toBe(false)
  })
})

describe("Validator is working (non-strict)", () => {
  const opts = { strict: false }

  test("If arrays with valid values should be parsed", () => {
    expect(isValidTwColor(["red-600", "#3b82f6/75"], opts)).toBe(true)
  })

  test("If only valid values should be parsed", () => {
    expect(isValidTwColor("orange", opts)).toBe(true)
    expect(isValidTwColor("orange/50", opts)).toBe(true)
    expect(isValidTwColor("stone-50", opts)).toBe(true)
    expect(isValidTwColor("stone-50/30", opts)).toBe(true)
    expect(isValidTwColor("green-900", opts)).toBe(true)
    expect(isValidTwColor("green-900/55", opts)).toBe(true)
    expect(isValidTwColor("#c08240", opts)).toBe(true)
    expect(isValidTwColor("#3b82f6/75", opts)).toBe(true)

    expect(isValidTwColor("emerald-", opts)).toBe(false)
    expect(isValidTwColor("zinc-0", opts)).toBe(false)
    expect(isValidTwColor("#cyan-900", opts)).toBe(false)
    expect(isValidTwColor("#cyan-900/55", opts)).toBe(false)
    expect(isValidTwColor("b69576", opts)).toBe(false)
    expect(isValidTwColor("#b69576/", opts)).toBe(false)
    expect(isValidTwColor("/")).toBe(false)
    expect(isValidTwColor("/0")).toBe(false)
    expect(isValidTwColor("#/20")).toBe(false)
  })

  test("If `rgb/a` form should not be parsed", () => {
    expect(isValidTwColor("rgb(0,0,0)", opts)).toBe(false)
    expect(isValidTwColor("rgb(0 0 0)", opts)).toBe(false)
    expect(isValidTwColor("rgba(0,0,0,0.1)", opts)).toBe(false)
    expect(isValidTwColor("rgb(0 0 0 / 0.1)", opts)).toBe(false)
  })

  test("If `hsl/a` form should not be parsed", () => {
    expect(isValidTwColor("hsl(50,80%,40%)", opts)).toBe(false)
    expect(isValidTwColor("hsl(150deg 30% 60%)", opts)).toBe(false)
    expect(isValidTwColor("hsla(0.3turn,60%,45%,.7)", opts)).toBe(false)
    expect(isValidTwColor("hsla(0 80% 50% / 25%)", opts)).toBe(false)
  })
})

describe("Validator is working with extended colors", () => {
  test("If `main` is valid", () => {
    expect(isValidTwColor("main")).toBe(true)
  })

  test("If `choco-50` is valid", () => {
    expect(isValidTwColor("choco-50")).toBe(true)
  })

  test("If `mango-200` is invalid", () => {
    expect(isValidTwColor("mango-200")).toBe(false)
  })
})

describe("Alpha validator is working", () => {
  test("If `yellow-50/1` is valid", () => {
    expect(hasValidAlpha("yellow-50/1")).toBe(true)
  })

  test("If `red-100/100` is valid", () => {
    expect(hasValidAlpha("red-100/100")).toBe(true)
  })

  test("If `green-900/50` is valid", () => {
    expect(hasValidAlpha("green-900/50")).toBe(true)
  })

  test("If `lime-600/200` is invalid", () => {
    expect(hasValidAlpha("green-600/200")).toBe(false)
  })

  test("If `orange-200/` is invalid", () => {
    expect(hasValidAlpha("orange-200/")).toBe(false)
  })

  test("If `pink-300/0` is invalid", () => {
    expect(hasValidAlpha("pink-300/0")).toBe(false)
  })

  test("If `/` is invalid", () => {
    expect(hasValidAlpha("/")).toBe(false)
  })

  test("If `/0` is invalid", () => {
    expect(hasValidAlpha("/0")).toBe(false)
  })

  test("If `#/20` is invalid", () => {
    expect(hasValidAlpha("#/20")).toBe(false)
  })
})

describe("Alpha validator is working with hex values", () => {
  test("If `#c08240/20` is valid", () => {
    expect(hasValidAlpha("#c08240/20")).toBe(true)
  })

  test("If `#a42c20/200` is invalid", () => {
    expect(hasValidAlpha("#a42c20/200")).toBe(false)
  })

  test("If `#a42c20/0` is invalid", () => {
    expect(hasValidAlpha("#a42c20/200")).toBe(false)
  })

  test("If `b69576/45` is invalid", () => {
    expect(hasValidAlpha("b69576/45")).toBe(false)
  })

  test("If `#b69576/` is invalid", () => {
    expect(hasValidAlpha("#b69576/")).toBe(false)
  })
})
