import Colors from "color-name"

const VALID_HEX = /#([A-Fa-f\d]{6})([A-Fa-f\d]{2})?(?!\/(?!\S))/i
const VALID_TW_COLOR_CLASS = /(?<![#-]+)\b[a-z]+\b-[0-9]{2,3}(?![-\w]+)/i
const VALID_COLOR_FORM = `${VALID_HEX.source}|${VALID_TW_COLOR_CLASS.source}`
const VALID_ALPHA = /\/(?=(\b([1-9]|[1-9][0-9]|100)\b))/i

export const isValidArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string")

export const isParsableString = (value: unknown): value is string =>
  typeof value === "string" &&
  // No need to parse these as chart.js can readily accept it
  !/rgb?a?|hsl?a?/i.test(value)

export const isHex = (value: string) =>
  new RegExp(`${VALID_HEX.source}(${VALID_ALPHA.source})?`).test(value)

export const isNamedColor = (value: string) => value in Colors

/**
 * Checks first if the color is in a valid form, then
 * checks if it has a valid `alpha` color channel.
 */
export const hasValidAlpha = (value: string): boolean =>
  // TODO There should be room for improvement here
  (VALID_ALPHA.test(value) && isNamedColor(value.split("/")[0])) || // named colors
  new RegExp(`(?<=(${VALID_COLOR_FORM}))${VALID_ALPHA.source}`).test(value)

export const shouldParse = (value: string) =>
  hasValidAlpha(value) || VALID_TW_COLOR_CLASS.test(value)
