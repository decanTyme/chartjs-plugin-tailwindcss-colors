/* eslint-disable @typescript-eslint/ban-ts-comment */
import { hasValidAlpha } from "../src/utils"

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

  test("If `aqua/75` is valid", () => {
    expect(hasValidAlpha("aqua/75")).toBe(true)
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
