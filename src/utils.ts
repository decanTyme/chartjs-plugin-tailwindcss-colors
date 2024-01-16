import Colors from "color-name"

import type { NamedColor } from "./types"

const VALID_HEX = /#([\da-f]{6})([\da-f]{2})?(?!\/(?!\S))/i
const VALID_TW_COLOR_CLASS = /(?<![#-]+)\b[a-z]+\b-\d{2,3}(?![\w-]+)/i
const VALID_COLOR_FORM = `${VALID_HEX.source}|${VALID_TW_COLOR_CLASS.source}`
const VALID_ALPHA = /\/(?=(\b([1-9]|[1-9]\d|100)\b))/i

export const isValidArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string")

export const isParsableString = (value: unknown): value is string =>
  typeof value === "string" &&
  // No need to parse these as chart.js can readily accept it
  !/rgba?|hsla?/i.test(value)

export const isHex = (value: string): boolean =>
  new RegExp(`${VALID_HEX.source}(${VALID_ALPHA.source})?`).test(value)

export const isNamedColor = (value: string): value is NamedColor =>
  value in Colors && Boolean(Colors[value as NamedColor])

/**
 * Checks first if the color is in a valid form, then
 * checks if it has a valid `alpha` color channel.
 */
export const hasValidAlpha = (value: string): boolean =>
  // TODO There should be room for improvement here
  (isNamedColor(value.split("/")[0]) && VALID_ALPHA.test(value)) || // named colors
  new RegExp(`(?<=(${VALID_COLOR_FORM}))${VALID_ALPHA.source}`).test(value)

export const shouldParse = (value: string): boolean =>
  hasValidAlpha(value) || VALID_TW_COLOR_CLASS.test(value)
