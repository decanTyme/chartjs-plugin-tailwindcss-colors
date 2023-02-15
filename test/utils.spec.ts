/* eslint-disable @typescript-eslint/ban-ts-comment */
import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"
import { flattenColorPalette } from "../src/color"
import { TailwindThemeColors } from "../src/types"
import { hasValidAlpha, twColorValidator } from "../src/utils"

// @ts-ignore
import tailwindConfig from "./tailwind.config"

const colors = resolveConfig(tailwindConfig).theme
  ?.colors as TailwindThemeColors

invariant(colors, "TailwindCSS theme colors is undefined!")

const colorPalette = flattenColorPalette(colors)
const isParsable = twColorValidator(colorPalette)

describe("Validator is working with config colors only (strict)", () => {
  test("If `transparent` is valid", () => {
    expect(isParsable("transparent")).toBe(true)
  })

  test("If `black` is valid", () => {
    expect(isParsable("black")).toBe(true)
  })

  test("If `yellow-50` is valid", () => {
    expect(isParsable("yellow-50")).toBe(true)
  })

  test("If `red-100` is valid", () => {
    expect(isParsable("red-100")).toBe(true)
  })

  test("If `` is invalid", () => {
    expect(isParsable("")).toBe(false)
  })

  test("If `orange-90` is invalid", () => {
    expect(isParsable("orange-90")).toBe(false)
  })

  test("If `pink-250` is invalid", () => {
    expect(isParsable("pink-250")).toBe(false)
  })

  test("If `indigo-0` is invalid", () => {
    expect(isParsable("indigo-0")).toBe(false)
  })

  test("If `#c08240` is invalid", () => {
    expect(isParsable("#c08240")).toBe(false)
  })
})

describe("Validator is working (non-strict)", () => {
  const opts = { strict: false }

  test("If arrays with valid values should be parsed", () => {
    expect(isParsable(["red-600", "#3b82f6/75"], opts)).toBe(true)
  })

  test("If only valid values should be parsed", () => {
    expect(isParsable("orange", opts)).toBe(true)
    expect(isParsable("orange/50", opts)).toBe(true)
    expect(isParsable("stone-50", opts)).toBe(true)
    expect(isParsable("stone-50/30", opts)).toBe(true)
    expect(isParsable("green-900", opts)).toBe(true)
    expect(isParsable("green-900/55", opts)).toBe(true)
    expect(isParsable("#c08240", opts)).toBe(true)
    expect(isParsable("#3b82f6/75", opts)).toBe(true)

    expect(isParsable("emerald-", opts)).toBe(false)
    expect(isParsable("zinc-0", opts)).toBe(false)
    expect(isParsable("#cyan-900", opts)).toBe(false)
    expect(isParsable("#cyan-900/55", opts)).toBe(false)
    expect(isParsable("b69576", opts)).toBe(false)
    expect(isParsable("#b69576/", opts)).toBe(false)
    expect(isParsable("/")).toBe(false)
    expect(isParsable("/0")).toBe(false)
    expect(isParsable("#/20")).toBe(false)
  })

  test("If `rgb/a` form should not be parsed", () => {
    expect(isParsable("rgb(0,0,0)", opts)).toBe(false)
    expect(isParsable("rgb(0 0 0)", opts)).toBe(false)
    expect(isParsable("rgba(0,0,0,0.1)", opts)).toBe(false)
    expect(isParsable("rgb(0 0 0 / 0.1)", opts)).toBe(false)
  })

  test("If `hsl/a` form should not be parsed", () => {
    expect(isParsable("hsl(50,80%,40%)", opts)).toBe(false)
    expect(isParsable("hsl(150deg 30% 60%)", opts)).toBe(false)
    expect(isParsable("hsla(0.3turn,60%,45%,.7)", opts)).toBe(false)
    expect(isParsable("hsla(0 80% 50% / 25%)", opts)).toBe(false)
  })
})

describe("Validator is working with extended colors", () => {
  test("If `main` is valid", () => {
    expect(isParsable("main")).toBe(true)
  })

  test("If `choco-50` is valid", () => {
    expect(isParsable("choco-50")).toBe(true)
  })

  test("If `mango-200` is invalid", () => {
    expect(isParsable("mango-200")).toBe(false)
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
