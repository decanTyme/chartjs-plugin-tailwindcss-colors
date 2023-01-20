// Color utilities taken from the CSS framework tailwindcss, which is
// Copyright (c) Tailwind Labs, Inc. (https://tailwindcss.com/)
// and used under the terms of the MIT license

import Colors from "color-name"
import {
  TailwindColorGroup,
  TailwindThemeColors,
} from "tailwindcss/tailwind-config"
import invariant from "tiny-invariant"
import { Color } from "./types"

const HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
const VALUE = `(?:\\d+|\\d*\\.\\d+)%?`
const SEP = `(?:\\s*,\\s*|\\s+)`
const ALPHA_SEP = `\\s*[,/]\\s*`

const RGB = new RegExp(
  `^rgba?\\(\\s*(${VALUE})${SEP}(${VALUE})${SEP}(${VALUE})(?:${ALPHA_SEP}(${VALUE}))?\\s*\\)$`
)

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

export function parseColor(value: string): Color {
  value = value.trim()

  if (value === "transparent") {
    return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" }
  }

  if (value in Colors) {
    return {
      mode: "rgb",
      color: Colors[value as keyof typeof Colors].map((v) => v.toString()),
    }
  }

  const rgbMatch = value.match(RGB)

  if (rgbMatch) {
    return {
      mode: "rgb",
      color: [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((v) => v.toString()),
      alpha: rgbMatch[4]?.toString?.(),
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
    color: [
      parseInt(hex[1], 16),
      parseInt(hex[2], 16),
      parseInt(hex[3], 16),
    ].map((v) => v.toString()),
    alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : undefined,
  }
}

export function formatColor({ mode, color, alpha }: Color): string {
  return `${mode}(${color.join(" ")}${alpha ? ` / ${alpha}` : ""})`
}
