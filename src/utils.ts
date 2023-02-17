import type { TailwindColorGroup, TwColorValidatorOpts } from "./types"

const VALID_HEX = `#([A-Fa-f\\d]{6})([A-Fa-f\\d]{2})?(?!\\/(?!\\S))`
const VALID_TW_CLASS = `(?<!#)\\b[a-z]+\\b(-?[0-9]{2,3}|)(?!-)`
const VALID_COLOR_FORM = `${VALID_HEX}|${VALID_TW_CLASS}`
const VALID_ALPHA = `\\/(?=(\\b([1-9]|[1-9][0-9]|100)\\b))`

export const isValidArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string")

/**
 * Checks first if the color is in a valid form, then
 * checks if it has a valid `alpha` color channel.
 */
export const hasValidAlpha = (value: string): boolean =>
  new RegExp(`(?<=(${VALID_COLOR_FORM}))${VALID_ALPHA}`).test(value)

/**
 * Checks if a given color/value is valid, and whether it should to be parsed.
 *
 * @returns A validator function.
 */
export const twColorValidator =
  (colorPalette: TailwindColorGroup) =>
  (
    value: unknown,
    { strict = true, hex = false }: TwColorValidatorOpts = {}
  ): value is string | string[] => {
    if (!value) return false

    if (!strict || hex) {
      // Since some colors are stored in arrays, assuming the values
      // in the array are valid, the array itself is valid
      if (isValidArray(value)) return true

      if (
        typeof value !== "string" ||
        /\b(?:rgba?)\b|\b(?:hsla?)\b/i.test(value)
      ) {
        return false
      }

      if (hex) {
        return new RegExp(`${VALID_COLOR_FORM}(${VALID_ALPHA})?`).test(value)
      }

      // Ignore hex values without a valid alpha
      return hasValidAlpha(value) || new RegExp(VALID_TW_CLASS).test(value)
    }

    // Strictly from the specified config
    return typeof value === "string" && Object.hasOwn(colorPalette, value)
  }
