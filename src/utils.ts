import Colors from "color-name"

import type { NamedColor } from "./types"

export interface ColorWithAlpha {
  color: string
  alpha: number
}

const VALID_HEX = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i
const VALID_TW_COLOR_CLASS = /^[a-z]+-\d{2,3}$/i
const VALID_ALPHA = /^(?:[1-9]\d?|100)$/
const NATIVE_CSS_COLOR =
  /^\s*(?:(?:rgba?|hsla?|hwb|(?:ok)?lab|(?:ok)?lch|color(?:-mix)?|light-dark)\(|transparent\s*$)/i

export const isParsableString = (value: unknown): value is string =>
  typeof value === "string" &&
  // Chart.js accepts native CSS colors without conversion.
  !NATIVE_CSS_COLOR.test(value)

export const isValidArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string")

export const isHex = (value: string): boolean => VALID_HEX.test(value)
export const isNamedColor = (value: string): value is NamedColor =>
  Object.hasOwn(Colors, value) && Array.isArray(Colors[value as NamedColor])

/**
 * Validates the color and opacity together, returning both so callers
 * can reuse them without splitting the input again.
 */
export const parseAlpha = (value: string): ColorWithAlpha | undefined => {
  const parts = value.trim().split("/")

  if (parts.length !== 2) return undefined

  const [color, alpha] = parts

  if (
    !VALID_ALPHA.test(alpha) ||
    !(isNamedColor(color) || isHex(color) || VALID_TW_COLOR_CLASS.test(color))
  ) {
    return undefined
  }

  return { color, alpha: Number.parseInt(alpha, 10) / 100 }
}

export const hasValidAlpha = (value: string): boolean =>
  parseAlpha(value) !== undefined
