import type { Config as TailwindConfig } from "tailwindcss"
import type { RecursiveKeyValuePair } from "tailwindcss/types/config"

import resolveConfig from "tailwindcss/resolveConfig"
import invariant from "tiny-invariant"

import type { ColorResult, Maybe, TailwindColorGroup } from "./types"

import { flattenColorPalette, formatColor, parseColor } from "./color"
import * as utils from "./utils"

const maxCachedColors = 4096
const nativeResult: ColorResult = Object.freeze({ kind: "native" })
const invalidResult: ColorResult = Object.freeze({ kind: "invalid" })

class TailwindColorsParser {
  public config: TailwindConfig
  readonly #colorPalette: TailwindColorGroup
  readonly #cache = new Map<string, ColorResult>()

  public constructor(config: TailwindConfig) {
    const colors = {
      ...resolveConfig(config).theme.colors,
    } as Maybe<RecursiveKeyValuePair>

    invariant(colors, "TailwindCSS theme colors is undefined!")

    // Freeze our snapshot without changing the caller's configuration.
    this.#colorPalette = Object.freeze(flattenColorPalette(colors))
    this.config = config
  }

  /**
   * Reuses immutable results for this palette, leaving invalid-value handling
   * to the plugin so warnings and errors keep their chart-specific locations.
   */
  public resolve(value: string): ColorResult {
    if (!utils.isParsableString(value)) return nativeResult

    const cache = this.#cache
    const cached = cache.get(value)

    if (cached !== undefined) return cached

    const result = Object.freeze(this.resolveUncached(value))

    // Start a fresh batch at the limit so later colors can still be reused.
    if (cache.size === maxCachedColors) cache.clear()

    cache.set(value, result)

    return result
  }

  private resolveUncached(value: string): ColorResult {
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
      ? nativeResult
      : invalidResult
  }

  private getPaletteColor(value: string): string | undefined {
    const palette = this.#colorPalette

    // Color names must never resolve through the palette's prototype.
    return Object.hasOwn(palette, value) ? palette[value] : undefined
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
