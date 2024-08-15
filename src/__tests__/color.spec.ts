// Color utilities tests taken from the CSS framework tailwindcss, which is
// Copyright (c) Tailwind Labs, Inc. (https://tailwindcss.com/)
// and used under the terms of the MIT license
// @see https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE

import type { Color } from "../types"

import { flattenColorPalette, formatColor, parseColor } from "../color"

describe("Color palette is correctly flattened", () => {
  test("It flattens nested color objects", () => {
    expect(
      flattenColorPalette({
        purple: "purple",
        white: {
          25: "rgba(255,255,255,.25)",
          50: "rgba(255,255,255,.5)",
          75: "rgba(255,255,255,.75)",
          DEFAULT: "#fff",
        },
        red: {
          1: "rgb(33,0,0)",
          2: "rgb(67,0,0)",
          3: "rgb(100,0,0)",
        },
        green: {
          1: "rgb(0,33,0)",
          2: "rgb(0,67,0)",
          3: "rgb(0,100,0)",
        },
        blue: {
          1: "rgb(0,0,33)",
          2: "rgb(0,0,67)",
          3: "rgb(0,0,100)",
        },
      })
    ).toEqual({
      purple: "purple",
      "white-25": "rgba(255,255,255,.25)",
      "white-50": "rgba(255,255,255,.5)",
      "white-75": "rgba(255,255,255,.75)",
      white: "#fff",
      "red-1": "rgb(33,0,0)",
      "red-2": "rgb(67,0,0)",
      "red-3": "rgb(100,0,0)",
      "green-1": "rgb(0,33,0)",
      "green-2": "rgb(0,67,0)",
      "green-3": "rgb(0,100,0)",
      "blue-1": "rgb(0,0,33)",
      "blue-2": "rgb(0,0,67)",
      "blue-3": "rgb(0,0,100)",
    })
  })

  test("It flattens deeply nested color objects", () => {
    expect(
      flattenColorPalette({
        primary: "purple",
        secondary: {
          DEFAULT: "blue",
          hover: "cyan",
          focus: "red",
        },
        button: {
          primary: {
            DEFAULT: "magenta",
            hover: "green",
            focus: {
              DEFAULT: "yellow",
              variant: "orange",
            },
          },
        },
      })
    ).toEqual({
      primary: "purple",
      secondary: "blue",
      "secondary-hover": "cyan",
      "secondary-focus": "red",
      "button-primary": "magenta",
      "button-primary-hover": "green",
      "button-primary-focus": "yellow",
      "button-primary-focus-variant": "orange",
    })
  })

  test("It handles empty objects", () => {
    expect(flattenColorPalette({})).toEqual({})
  })
})

describe("`parseColor` works as intended", () => {
  it.each`
    color            | output
    ${"black"}       | ${{ mode: "rgb", values: ["0", "0", "0"], alpha: undefined }}
    ${"#0088cc"}     | ${{ mode: "rgb", values: ["0", "136", "204"], alpha: undefined }}
    ${"#08c"}        | ${{ mode: "rgb", values: ["0", "136", "204"], alpha: undefined }}
    ${"#0088cc99"}   | ${{ mode: "rgb", values: ["0", "136", "204"], alpha: "0.6" }}
    ${"#08c9"}       | ${{ mode: "rgb", values: ["0", "136", "204"], alpha: "0.6" }}
    ${"transparent"} | ${{ mode: "rgb", values: ["0", "0", "0"], alpha: "0" }}
  `(
    'Should parse "$color" to the correct value',
    ({ color, output }: { color: string; output: Color }) => {
      expect(parseColor(color)).toEqual(output)
    }
  )
})

describe("`formatColor` works as intended", () => {
  it.each`
    color                                                             | output
    ${{ mode: "rgb", values: ["0", "0", "0"], alpha: undefined }}     | ${"rgb(0 0 0)"}
    ${{ mode: "rgb", values: ["0", "136", "204"], alpha: undefined }} | ${"rgb(0 136 204)"}
    ${{ mode: "rgb", values: ["0", "136", "204"], alpha: "0.6" }}     | ${"rgb(0 136 204 / 0.6)"}
  `(
    'Should format the color pieces into a proper "$output"',
    ({ color, output }: { color: Color; output: string }) => {
      expect(formatColor(color)).toEqual(output)
    }
  )
})
