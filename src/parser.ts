import type { Config as TailwindConfig } from "tailwindcss"
import type { RecursiveKeyValuePair } from "tailwindcss/types/config"

import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"

import type { ColorResult, Maybe, TailwindColorGroup } from "./types"

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

  /**
   * Resolves a color once, leaving invalid-value handling to the plugin.
   */
  public resolve(value: string): ColorResult {
    if (!utils.isParsableString(value)) return { kind: "native" }

    const color = value.trim()

    if (color.includes("/")) {
      const alphaColor = this.getAlphaColor(color)

      if (alphaColor !== undefined) {
        return {
          kind: "converted",
          value: formatColor({
            ...parseColor(alphaColor.color),
            alpha: alphaColor.alpha,
          }),
        }
      }
    }

    const paletteColor = this.getPaletteColor(color)

    if (paletteColor !== undefined) {
      return { kind: "converted", value: paletteColor }
    }

    return utils.isHex(color) || utils.isNativeColorKeyword(color)
      ? { kind: "native" }
      : { kind: "invalid" }
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
