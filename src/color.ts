// Color utilities taken from the CSS framework tailwindcss, which is
// Copyright (c) Tailwind Labs, Inc. (https://tailwindcss.com/)
// and used under the terms of the MIT license
// @see https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE

import Colors from "color-name"
import invariant from "tiny-invariant"

import type { Color, TailwindColorGroup, TailwindThemeColors } from "./types"

const HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i

// @see https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/flattenColorPalette.js
export const flattenColorPalette = (
  colors: TailwindThemeColors
): TailwindColorGroup =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values === "object"
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  )

// @see https://github.com/tailwindlabs/tailwindcss/blob/master/src/util/color.js
export function parseColor(value: string): Color {
  value = value.trim()

  if (value === "transparent") {
    return { mode: "rgb", values: ["0", "0", "0"], alpha: "0" }
  }

  if (value in Colors) {
    return {
      mode: "rgb",
      values: Colors[value as keyof typeof Colors].map((v) => v.toString()),
    }
  }

  // We already filter out and validate before even trying
  // to parse, so this should now always match a hex
  const hex = value
    .replace(SHORT_HEX, (_, r, g, b, a) =>
      ["#", r, r, g, g, b, b, a ? a + a : ""].join("")
    )
    .match(HEX)

  invariant(hex, `Invalid value: ${value}`)

  return {
    mode: "rgb",
    values: [
      parseInt(hex[1], 16),
      parseInt(hex[2], 16),
      parseInt(hex[3], 16),
    ].map((v) => v.toString()),
    alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : undefined,
  }
}

export function formatColor({ mode, values, alpha }: Color): string {
  return `${mode}(${values.join(" ")}${alpha ? ` / ${alpha}` : ""})`
}
