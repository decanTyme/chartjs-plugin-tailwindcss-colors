import type { Config as TailwindConfig } from "tailwindcss"
import type { RecursiveKeyValuePair } from "tailwindcss/types/config"

import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"

import type {
  InvalidColorReporter,
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

  public parse<T extends string[] | string>(
    value: T,
    reportInvalidColor?: InvalidColorReporter,
  ): T
  public parse(
    value: string[] | string,
    reportInvalidColor?: InvalidColorReporter,
  ): string[] | string {
    if (Array.isArray(value)) {
      return value.map((v, index) =>
        this.parseString(v, reportInvalidColor, index),
      )
    }

    return this.parseString(value, reportInvalidColor)
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
      // Parse array entries independently, preserving unsupported values.
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

  public isInvalidColor(value: unknown): value is string {
    if (!utils.isParsableString(value)) return false

    const color = value.trim()

    return (
      this.getPaletteColor(color) === undefined &&
      !utils.isHex(color) &&
      !utils.isNamedColor(color) &&
      this.getAlphaColor(value) === undefined
    )
  }

  private parseString(
    value: string,
    reportInvalidColor?: InvalidColorReporter,
    index?: number,
  ): string {
    if (!utils.isParsableString(value)) return value

    const alphaColor = this.getAlphaColor(value)

    if (alphaColor !== undefined) {
      return formatColor({
        ...parseColor(alphaColor.color),
        alpha: alphaColor.alpha,
      })
    }

    const color = value.trim()
    const paletteColor = this.getPaletteColor(color)

    if (paletteColor !== undefined) return paletteColor

    if (utils.isHex(color) || utils.isNamedColor(color)) {
      return formatColor(parseColor(color))
    }

    if (reportInvalidColor === undefined) {
      const path = index === undefined ? "color" : `color[${index}]`
      throw new Error(
        `Cannot resolve color ${JSON.stringify(value)} at ${path}.`,
      )
    }

    reportInvalidColor(value, index)
    return value
  }

  private getPaletteColor(value: string): string | undefined {
    // Color names must never resolve through the palette's prototype.
    return Object.hasOwn(this.colorPalette, value)
      ? this.colorPalette[value]
      : undefined
  }

  private getAlphaColor(value: string): utils.ColorWithAlpha | undefined {
    const alphaColor = utils.parseAlpha(value)

    if (alphaColor === undefined) return undefined

    const { color, alpha } = alphaColor
    const resolvedColor = (this.getPaletteColor(color) ?? color).trim()

    return utils.isHex(resolvedColor) ||
      utils.isNamedColor(resolvedColor) ||
      resolvedColor === "transparent"
      ? { color: resolvedColor, alpha }
      : undefined
  }
}

export default TailwindColorsParser
