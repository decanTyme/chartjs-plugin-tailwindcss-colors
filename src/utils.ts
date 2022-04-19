import { TailwindColorGroup } from "tailwindcss/tailwind-config"

export const twColorValidator =
  (colorPalette: TailwindColorGroup) => (name: string) =>
    Object.hasOwn(colorPalette, name)

// TODO: Compress regex into one test
export const hasAlpha = (name: string) => {
  const isHex = /#[0-9A-Fa-f]{6}/g.test(name)
  const validAlpha = /\/(?=(\b([1-9]|[1-9][0-9]|100)\b))/g.test(name)

  // Check first if `name` is a hex, since `validAlpha` will catch anything
  // with a valid opacity modifier, but hex without `#` is invalid
  return /#?[0-9A-Fa-f]{6}/g.test(name) ? isHex && validAlpha : validAlpha
}
