import type { Config as TailwindConfig } from "tailwindcss"
import type { RecursiveKeyValuePair } from "tailwindcss/types/config"

import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"

import type { Maybe, TailwindColorGroup, TwColorValidatorOpts } from "./types"

import { flattenColorPalette, formatColor, parseColor } from "./color"
import * as utils from "./utils"

class TailwindColorsParser {
  config: TailwindConfig
  colorPalette: TailwindColorGroup

  constructor(config: TailwindConfig) {
    const colors = {
      ...resolveConfig(config).theme?.colors,
    } as Maybe<RecursiveKeyValuePair>

    invariant(colors, "TailwindCSS theme colors is undefined!")

    this.colorPalette = flattenColorPalette(colors)
    this.config = config
  }

  parse<T extends string | string[]>(value: T): T
  parse(value: string | string[]): string | string[] {
    if (Array.isArray(value)) {
      return value.map((v) => this.parse(v))
    }

    if (utils.hasValidAlpha(value)) {
      const [color, alpha] = value.split("/")

      return formatColor({
        ...parseColor(this.colorPalette[color] ?? color),
        alpha: parseInt(alpha, 10) / 100,
      })
    }

    return this.colorPalette[value] ?? value
  }

  /**
   * Checks if a given color/value is valid, and
   * whether it should to be parsed.
   */
  isParsable(
    value: unknown,
    { strict = false, hex, named }: TwColorValidatorOpts = {}
  ): value is string | string[] {
    if (!value) return false

    if (!strict) {
      // Since some colors are stored in arrays, assuming the values
      // in the array are valid, the array itself is valid
      if (utils.isValidArray(value)) return true

      if (!utils.isParsableString(value)) return false

      if (hex || named) {
        return utils.isHex(value) || utils.isNamedColor(value)
      }

      // Ignore hex and named colors without a valid alpha
      return Object.hasOwn(this.colorPalette, value) || utils.shouldParse(value)
    }

    // Strictly from the specified config
    return typeof value === "string" && Object.hasOwn(this.colorPalette, value)
  }
}

export default TailwindColorsParser
