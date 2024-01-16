// Color utilities taken from the CSS framework tailwindcss, which is
// Copyright (c) Tailwind Labs, Inc. (https://tailwindcss.com/)
// and used under the terms of the MIT license
// @see https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE

import type { RecursiveKeyValuePair } from "tailwindcss/types/config"

import Colors from "color-name"
import invariant from "tiny-invariant"

import type { Color, TailwindColorGroup, Writeable } from "./types"

import { isNamedColor } from "./utils"

const HEX = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i
const SHORT_HEX = /^#([\da-f])([\da-f])([\da-f])([\da-f])?$/i

// @see https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/flattenColorPalette.js
export const flattenColorPalette = (
  colors: RecursiveKeyValuePair
): TailwindColorGroup => {
  const result: Writeable<TailwindColorGroup> = {}
  Object.entries(colors).forEach(([color, value]) => {
    if (typeof value === "string") result[color] = value
    else {
      const nestedColors = flattenColorPalette(value)
      Object.entries(nestedColors).forEach(([number, hex]) => {
        result[`${color}${number === "DEFAULT" ? "" : `-${number}`}`] = hex
      })
    }
  })
  return result
}

// @see https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/color.js
export function parseColor(value: string): Color {
  value = value.trim()

  if (value === "transparent") {
    return { mode: "rgb", values: ["0", "0", "0"], alpha: "0" }
  }

  if (isNamedColor(value)) {
    return {
      mode: "rgb",
      values: Colors[value].map((v) => v.toString()),
    }
  }

  // We already filter out and validate before even trying
  // to parse, so this should now always match a hex
  const hex = HEX.exec(
    // eslint-disable-next-line @typescript-eslint/max-params
    value.replace(SHORT_HEX, (_, r, g, b, a) =>
      ["#", r, r, g, g, b, b, a ? a + a : ""].join("")
    )
  )

  invariant(hex, `Invalid value: ${value}`)

  return {
    mode: "rgb",
    values: [
      Number.parseInt(hex[1], 16),
      Number.parseInt(hex[2], 16),
      Number.parseInt(hex[3], 16),
    ].map((v) => v.toString()),
    alpha: hex[4] ? (Number.parseInt(hex[4], 16) / 255).toString() : undefined,
  }
}

export function formatColor({ mode, values, alpha }: Color): string {
  return `${mode}(${values.join(" ")}${alpha ? ` / ${alpha}` : ""})`
}
