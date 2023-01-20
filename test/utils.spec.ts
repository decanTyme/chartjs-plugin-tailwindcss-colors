/* eslint-disable @typescript-eslint/ban-ts-comment */
import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"
import { flattenColorPalette } from "../src/color"
import { hasAlpha, twColorValidator } from "../src/utils"

// @ts-ignore
import tailwindConfig from "./tailwind.config"

const {
  theme: { colors },
} = resolveConfig(tailwindConfig)

invariant(colors, "TailwindCSS theme colors is undefined!")

const colorPalette = flattenColorPalette(colors)
const isValidTwColor = twColorValidator(colorPalette)

describe("Validator is working", () => {
  test("If `transparent` is valid", () => {
    expect(isValidTwColor("transparent")).toEqual(true)
  })

  test("If `black` is valid", () => {
    expect(isValidTwColor("black")).toEqual(true)
  })

  test("If `yellow-50` is valid", () => {
    expect(isValidTwColor("yellow-50")).toEqual(true)
  })

  test("If `red-100` is valid", () => {
    expect(isValidTwColor("red-100")).toEqual(true)
  })

  test("If `green-900` is valid", () => {
    expect(isValidTwColor("green-900")).toEqual(true)
  })

  test("If `` is invalid", () => {
    expect(isValidTwColor("")).toEqual(false)
  })

  test("If `orange-90` is invalid", () => {
    expect(isValidTwColor("orange-90")).toEqual(false)
  })

  test("If `pink-250` is invalid", () => {
    expect(isValidTwColor("pink-250")).toEqual(false)
  })

  test("If `indigo-0` is invalid", () => {
    expect(isValidTwColor("indigo-0")).toEqual(false)
  })

  test("If `#c08240` is invalid", () => {
    expect(isValidTwColor("#c08240")).toEqual(false)
  })

  test("If `b69576` is invalid", () => {
    expect(isValidTwColor("b69576")).toEqual(false)
  })
})

describe("Validator is working with extended colors", () => {
  test("If `main` is valid", () => {
    expect(isValidTwColor("main")).toEqual(true)
  })

  test("If `choco-50` is valid", () => {
    expect(isValidTwColor("choco-50")).toEqual(true)
  })

  test("If `mango-200` is invalid", () => {
    expect(isValidTwColor("mango-200")).toEqual(false)
  })
})

describe("Alpha validator is working", () => {
  test("If `yellow-50/1` is valid", () => {
    expect(hasAlpha("yellow-50/1")).toEqual(true)
  })

  test("If `red-100/100` is valid", () => {
    expect(hasAlpha("red-100/100")).toEqual(true)
  })

  test("If `green-900/50` is valid", () => {
    expect(hasAlpha("green-900/50")).toEqual(true)
  })

  test("If `lime-600/200` is invalid", () => {
    expect(hasAlpha("green-600/200")).toEqual(false)
  })

  test("If `orange-200/` is invalid", () => {
    expect(hasAlpha("orange-200/")).toEqual(false)
  })

  test("If `pink-300/0` is invalid", () => {
    expect(hasAlpha("pink-300/0")).toEqual(false)
  })

  test("If `/` is invalid", () => {
    expect(hasAlpha("/")).toEqual(false)
  })

  test("If `/0` is invalid", () => {
    expect(hasAlpha("/0")).toEqual(false)
  })
})

describe("Alpha validator is working with arbitrary values", () => {
  test("If `#c08240/20` is valid", () => {
    expect(hasAlpha("#c08240/20")).toEqual(true)
  })

  test("If `#a42c20/200` is invalid", () => {
    expect(hasAlpha("#a42c20/200")).toEqual(false)
  })

  test("If `#a42c20/0` is invalid", () => {
    expect(hasAlpha("#a42c20/200")).toEqual(false)
  })

  test("If `b69576/45` is invalid", () => {
    expect(hasAlpha("b69576/45")).toEqual(false)
  })

  test("If `#b69576/` is invalid", () => {
    expect(hasAlpha("#b69576/")).toEqual(false)
  })
})
