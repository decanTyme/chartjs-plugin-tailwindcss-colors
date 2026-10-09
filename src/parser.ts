import type { Config as TailwindConfig } from "tailwindcss"
import type { RecursiveKeyValuePair } from "tailwindcss/types/config"

import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"

import type {
  Maybe,
  TailwindColorGroup,
  TwColorValidatorOptions,
} from "./types"

import { flattenColorPalette, formatColor, parseColor } from "./color"
import * as utils from "./utils"

class TailwindColorsParser {
  public config: TailwindConfig
  public colorPalette: TailwindColorGroup

  public constructor(config: TailwindConfig) {
    const colors = {
      ...resolveConfig(config).theme.colors,
    } as Maybe<RecursiveKeyValuePair>

    invariant(colors, "TailwindCSS theme colors is undefined!")

    this.colorPalette = flattenColorPalette(colors)
    this.config = config
  }

  public parse<T extends string[] | string>(value: T): T
  public parse(value: string[] | string): string[] | string {
    if (Array.isArray(value)) {
      return value.map((v) => this.parse(v))
    }

    if (!utils.isParsableString(value)) return value

    const alphaColor = this.getAlphaColor(value)

    if (alphaColor !== undefined) {
      const [, alpha] = value.trim().split("/")

      return formatColor({
        ...parseColor(alphaColor),
        alpha: Number.parseInt(alpha, 10) / 100,
      })
    }

    const color = value.trim()
    const paletteColor = this.getPaletteColor(color)

    if (paletteColor !== undefined) return paletteColor

    return formatColor(parseColor(color))
  }

  /**
   * Checks if a given color/value is valid, and
   * whether it should to be parsed.
   */
  public isParsable(
    value: unknown,
    { strict = false, hex, named }: TwColorValidatorOptions = {},
  ): value is string[] | string {
    if (!value) return false

    if (!strict) {
      // Parse each array entry; unsupported values fail during conversion.
      if (utils.isValidArray(value)) return true

      if (!utils.isParsableString(value)) return false

      if (hex) {
        return utils.isHex(value)
      }

      if (named) {
        return utils.isNamedColor(value)
      }

      // Ignore hex and named colors without a valid alpha
      return (
        this.getPaletteColor(value.trim()) !== undefined ||
        this.getAlphaColor(value) !== undefined
      )
    }

    // Strictly from the specified config
    return (
      utils.isParsableString(value) &&
      this.getPaletteColor(value.trim()) !== undefined
    )
  }

  private getPaletteColor(value: string): string | undefined {
    // Color names must never resolve through the palette's prototype.
    return Object.hasOwn(this.colorPalette, value)
      ? this.colorPalette[value]
      : undefined
  }

  private getAlphaColor(value: string): string | undefined {
    if (!utils.hasValidAlpha(value)) return undefined

    const [color] = value.trim().split("/")
    const resolvedColor = (this.getPaletteColor(color) ?? color).trim()

    return utils.isHex(resolvedColor) ||
      utils.isNamedColor(resolvedColor) ||
      resolvedColor === "transparent"
      ? resolvedColor
      : undefined
  }
}

export default TailwindColorsParser
