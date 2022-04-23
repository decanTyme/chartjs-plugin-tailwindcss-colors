// Color utilities taken from the CSS framework tailwindcss, which is
// Copyright (c) Tailwind Labs, Inc. (https://tailwindcss.com/)
// and used under the terms of the MIT license

import namedColors, { RGB } from "color-name"
import {
  TailwindColorGroup,
  TailwindThemeColors,
} from "tailwindcss/tailwind-config"
import { Color, Maybe } from "./types"

const HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
const VALUE = `(?:\\d+|\\d*\\.\\d+)%?`
const SEP = `(?:\\s*,\\s*|\\s+)`
const ALPHA_SEP = `\\s*[,/]\\s*`
const RGB = new RegExp(
  `^rgba?\\(\\s*(${VALUE})${SEP}(${VALUE})${SEP}(${VALUE})(?:${ALPHA_SEP}(${VALUE}))?\\s*\\)$`
)
const HSL = new RegExp(
  `^hsla?\\(\\s*((?:${VALUE})(?:deg|rad|grad|turn)?)${SEP}(${VALUE})${SEP}(${VALUE})(?:${ALPHA_SEP}(${VALUE}))?\\s*\\)$`
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

export function parseColor(value: string): Maybe<Color> {
  if (!value) return undefined

  value = value.trim()
  if (value === "transparent") {
    return { mode: "rgb", color: ["0", "0", "0"], alpha: "0" }
  }

  if (value in namedColors) {
    return {
      mode: "rgb",
      color: namedColors[value as keyof typeof namedColors].map((v) =>
        v.toString()
      ),
    }
  }

  const hex = value
    .replace(SHORT_HEX, (_, r, g, b, a) =>
      ["#", r, r, g, g, b, b, a ? a + a : ""].join("")
    )
    .match(HEX)

  if (hex) {
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

  const rgbMatch = value.match(RGB)

  if (rgbMatch) {
    return {
      mode: "rgb",
      color: [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map((v) => v.toString()),
      alpha: rgbMatch[4]?.toString?.(),
    }
  }

  const hslMatch = value.match(HSL)

  if (hslMatch) {
    return {
      mode: "hsl",
      color: [hslMatch[1], hslMatch[2], hslMatch[3]].map((v) => v.toString()),
      alpha: hslMatch[4]?.toString?.(),
    }
  }

  return undefined
}

export function formatColor({ mode, color, alpha }: Partial<Color>) {
  if (!color) return undefined
  return `${mode}(${color?.join(" ")}${alpha ? ` / ${alpha}` : ""})`
}
