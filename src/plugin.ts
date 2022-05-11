/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Plugin } from "chart.js"
import set from "lodash.set"
import get from "lodash.get"
import resolveConfig from "tailwindcss/resolveConfig"
import { TailwindConfig } from "tailwindcss/tailwind-config"
import invariant from "tiny-invariant"
import { flattenColorPalette, formatColor, parseColor } from "./color"
import { Maybe, MaybeArray, ParsableOptions } from "./types"
import { hasAlpha, twColorValidator } from "./utils"

const twColorsPlugin = (
  tailwindConfig: TailwindConfig,
  defaults: Partial<ParsableOptions> = {}
): Plugin => {
  const {
    theme: { colors },
  } = resolveConfig(tailwindConfig)

  invariant(colors, "Undefined TailwindCSS theme colors")

  const flattenedColorPalette = flattenColorPalette(colors)

  const isValidTwColor = twColorValidator(flattenedColorPalette)

  const parseTailwindColor = (
    name: MaybeArray<string>
  ): Maybe<MaybeArray<string>> => {
    if (!name) return undefined

    if (Array.isArray(name))
      return name.map((val) => <string>parseTailwindColor(val))

    if (hasAlpha(name)) {
      const [color, alpha] = name.split("/")

      const parsedColor = parseColor(<string>parseTailwindColor(color))

      if (!parsedColor) return undefined

      return formatColor({
        ...parsedColor,
        alpha: parseInt(alpha, 10) / 100,
      })
    }

    // Anything that is not a tailwindcss valid color format
    // (i.e., hex or rgb forms) should be returned as-is
    if (!isValidTwColor(name)) return name

    const parsedColor = parseColor(flattenedColorPalette[name])

    if (!parsedColor) return undefined

    return formatColor(parsedColor)
  }

  return {
    id: "tailwindcss-colors",
    afterInit: (chart) => {
      const parsableOpts = [
        "color",
        "borderColor",
        "backgroundColor",
        "hoverBorderColor",
        "hoverBackgroundColor",
        "pointBorderColor",
        "pointBackgroundColor",
        "pointHoverBackgroundColor",
        "pointHoverBorderColor",
        "fill.above",
        "fill.below",
        "fill",
      ]

      parsableOpts.forEach((parsableOpt) => {
        const defaultOpt = defaults[parsableOpt]
        const chartOpt = get(chart.options, parsableOpt)

        chart.data.datasets?.forEach((dataset) => {
          const color =
            get(dataset, parsableOpt) ||
            (isValidTwColor(<string>chartOpt) ? chartOpt : defaultOpt)

          if (color) {
            if (typeof color === "boolean") {
              // Manually set for boolean fill option values,
              // otherwise fill won't work
              set(dataset, parsableOpt, { target: "origin" })
            } else set(dataset, parsableOpt, parseTailwindColor(color))
          }
        })
      })
    },
  }
}

export default twColorsPlugin
