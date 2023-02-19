/* eslint-disable @typescript-eslint/ban-ts-comment */
import TailwindColorsParser from "../src/parser"

// @ts-ignore
import tailwindConfig from "./tailwind.config"

const parser = new TailwindColorsParser(tailwindConfig)

describe("Validator is working with configured colors only (strict)", () => {
  const opts = { strict: true }

  test("If `transparent` is valid", () => {
    expect(parser.isParsable("transparent", opts)).toBe(true)
  })

  test("If `black` is valid", () => {
    expect(parser.isParsable("black", opts)).toBe(true)
  })

  test("If `yellow-50` is valid", () => {
    expect(parser.isParsable("yellow-50", opts)).toBe(true)
  })

  test("If `red-100` is valid", () => {
    expect(parser.isParsable("red-100", opts)).toBe(true)
  })

  test("If `orange-90` is invalid", () => {
    expect(parser.isParsable("orange-90", opts)).toBe(false)
  })

  test("If `pink-250` is invalid", () => {
    expect(parser.isParsable("pink-250", opts)).toBe(false)
  })

  test("If `indigo-0` is invalid", () => {
    expect(parser.isParsable("indigo-0")).toBe(false)
  })

  test("If `#c08240` is invalid", () => {
    expect(parser.isParsable("#c08240", opts)).toBe(false)
  })
})

describe("Validator is working (non-strict)", () => {
  test("If `` is invalid", () => {
    expect(parser.isParsable("")).toBe(false)
  })

  test("If `transparent` is valid", () => {
    expect(parser.isParsable("transparent")).toBe(true)
  })

  test("If `black` is valid", () => {
    expect(parser.isParsable("black")).toBe(true)
  })

  test("If arrays with valid values should be parsed", () => {
    expect(parser.isParsable(["red-600", "#3b82f6/75"])).toBe(true)
  })

  test("If only valid values should be parsed", () => {
    expect(parser.isParsable("orange/50")).toBe(true)
    expect(parser.isParsable("stone-50")).toBe(true)
    expect(parser.isParsable("stone-50/30")).toBe(true)
    expect(parser.isParsable("green-900")).toBe(true)
    expect(parser.isParsable("green-900/55")).toBe(true)
    expect(parser.isParsable("#3b82f6/75")).toBe(true)

    expect(parser.isParsable("orange")).toBe(false)
    expect(parser.isParsable("#c08240")).toBe(false)
    expect(parser.isParsable("emerald-")).toBe(false)
    expect(parser.isParsable("purple-cyan")).toBe(false)
    expect(parser.isParsable("slate-0")).toBe(false)
    expect(parser.isParsable("#cyan-900")).toBe(false)
    expect(parser.isParsable("#cyan-900/55")).toBe(false)
    expect(parser.isParsable("b69576")).toBe(false)
    expect(parser.isParsable("#b69576/")).toBe(false)
    expect(parser.isParsable("/")).toBe(false)
    expect(parser.isParsable("/0")).toBe(false)
    expect(parser.isParsable("#/20")).toBe(false)
  })

  test("If hex is parsed when `hex` flag is passed", () => {
    expect(parser.isParsable("#c08240", { hex: true })).toBe(true)
  })

  test("If hex is parsed when `named` flag is passed", () => {
    expect(parser.isParsable("bisque", { named: true })).toBe(true)
    expect(parser.isParsable("zinc", { named: true })).toBe(false)
  })

  test("If `rgb/a` form should not be parsed", () => {
    expect(parser.isParsable("rgb(0,0,0)")).toBe(false)
    expect(parser.isParsable("rgb(0 0 0)")).toBe(false)
    expect(parser.isParsable("rgba(0,0,0,0.1)")).toBe(false)
    expect(parser.isParsable("rgb(0 0 0 / 0.1)")).toBe(false)
  })

  test("If `hsl/a` form should not be parsed", () => {
    expect(parser.isParsable("hsl(50,80%,40%)")).toBe(false)
    expect(parser.isParsable("hsl(150deg 30% 60%)")).toBe(false)
    expect(parser.isParsable("hsla(0.3turn,60%,45%,.7)")).toBe(false)
    expect(parser.isParsable("hsla(0 80% 50% / 25%)")).toBe(false)
  })
})

describe("Validator is working with extended colors", () => {
  const opts = { strict: true }

  test("If `main` is valid", () => {
    expect(parser.isParsable("main", opts)).toBe(true)
  })

  test("If `choco-50` is valid", () => {
    expect(parser.isParsable("choco-50", opts)).toBe(true)
  })

  test("If `mango-200` is invalid", () => {
    expect(parser.isParsable("mango-200", opts)).toBe(false)
  })
})
