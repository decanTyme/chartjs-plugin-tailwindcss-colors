import { TailwindColorGroup } from "tailwindcss/tailwind-config"

const VALID_COLOR_FORM = `((#[0-9A-Fa-f]{6})|(?!#)[a-z]+(-?[0-9]{2,3}|))`
const VALID_ALPHA = `\\/(?=(\\b([1-9]|[1-9][0-9]|100)\\b))`

/**
 * Checks if a given color is valid according to the
 * specified TailwindCSS config.
 *
 * @returns A validator function
 */
export const twColorValidator =
  (colorPalette: TailwindColorGroup) =>
  (value: string): boolean =>
    Object.hasOwn(colorPalette, value)

/**
 * Checks first if the color is in a valid form, then
 * checks if it has a valid `alpha` color channel.
 */
export const hasAlpha = (value: string): boolean =>
  new RegExp(`(?<=(${VALID_COLOR_FORM}))${VALID_ALPHA}`, "g").test(value)
