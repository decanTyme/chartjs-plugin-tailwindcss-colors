import Colors from "color-name"

import type { NamedColor } from "./types"

const VALID_HEX = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i
const VALID_TW_COLOR_CLASS = /^[a-z]+-\d{2,3}$/i
const VALID_ALPHA = /^(?:[1-9]\d?|100)$/

export const isParsableString = (value: unknown): value is string =>
  typeof value === "string" &&
  // No need to parse these as chart.js can readily accept it
  !/rgba?|hsla?|transparent/i.test(value)

export const isValidArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string")

export const isHex = (value: string): boolean => VALID_HEX.test(value)
export const isNamedColor = (value: string): value is NamedColor =>
  Object.hasOwn(Colors, value) && Array.isArray(Colors[value as NamedColor])

/**
 * Checks first if the color is in a valid form, then
 * checks if it has a valid `alpha` color channel.
 */
export const hasValidAlpha = (value: string): boolean => {
  const parts = value.trim().split("/")

  if (parts.length !== 2) return false

  const [color, alpha] = parts

  return (
    VALID_ALPHA.test(alpha) &&
    (isNamedColor(color) || isHex(color) || VALID_TW_COLOR_CLASS.test(color))
  )
}
